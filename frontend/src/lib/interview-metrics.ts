type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

const FILLER_PATTERNS = [
  /\bum\b/gi,
  /\buh\b/gi,
  /\blike\b/gi,
  /\byou know\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bi mean\b/gi
];

export type VoiceMetrics = {
  words_per_minute: number;
  speaking_seconds: number;
  filler_count: number;
  long_pause_count: number;
  average_volume: number;
  volume_stability: number;
  energy_score: number;
  clarity_score: number;
};

export type FaceMetrics = {
  samples: number;
  face_visible_percent: number;
  eye_contact_score: number;
  posture_stability: number;
  lighting_score: number;
  expression_engagement: number;
  head_movement_variance: number;
};

export type FaceSample = {
  faceVisible: boolean;
  centerOffset: number;
  luminance: number;
  motionDelta: number;
};

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }
  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

export function countFillerWords(text: string): number {
  return FILLER_PATTERNS.reduce((total, pattern) => {
    const matches = text.match(pattern);
    return total + (matches?.length ?? 0);
  }, 0);
}

export function createVoiceAnalyzer(stream: MediaStream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const volumeSamples: number[] = [];
  let longPauseCount = 0;
  let belowThresholdStreak = 0;
  const startedAt = performance.now();
  let rafId = 0;

  const tick = () => {
    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);
    let sum = 0;
    for (const value of buffer) {
      const normalized = (value - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / buffer.length);
    volumeSamples.push(rms);
    if (rms < 0.02) {
      belowThresholdStreak += 1;
      if (belowThresholdStreak > 45) {
        longPauseCount += 1;
        belowThresholdStreak = 0;
      }
    } else {
      belowThresholdStreak = 0;
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return {
    stop() {
      cancelAnimationFrame(rafId);
      void context.close();
    },
    buildMetrics(transcript: string, speakingSeconds: number): VoiceMetrics {
      const words = transcript.trim().split(/\s+/).filter(Boolean).length;
      const wpm = speakingSeconds > 0 ? Math.round((words / speakingSeconds) * 60) : 0;
      const averageVolume =
        volumeSamples.length > 0
          ? volumeSamples.reduce((sum, value) => sum + value, 0) / volumeSamples.length
          : 0;
      const variance =
        volumeSamples.length > 1
          ? volumeSamples.reduce((sum, value) => sum + (value - averageVolume) ** 2, 0) / volumeSamples.length
          : 0;
      const volumeStability = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 420));
      const energyScore = Math.max(0, Math.min(100, averageVolume * 520));
      const pacePenalty =
        wpm > 185 ? (wpm - 185) * 0.35 : wpm > 0 && wpm < 100 ? (100 - wpm) * 0.25 : 0;
      const clarityScore = Math.max(
        0,
        Math.min(100, 55 + volumeStability * 0.25 + energyScore * 0.2 - pacePenalty - longPauseCount * 3)
      );

      return {
        words_per_minute: wpm,
        speaking_seconds: Math.max(0, (performance.now() - startedAt) / 1000, speakingSeconds),
        filler_count: countFillerWords(transcript),
        long_pause_count: longPauseCount,
        average_volume: Number(averageVolume.toFixed(3)),
        volume_stability: Number(volumeStability.toFixed(1)),
        energy_score: Number(energyScore.toFixed(1)),
        clarity_score: Number(clarityScore.toFixed(1))
      };
    }
  };
}

export class FaceMetricsCollector {
  private samples: FaceSample[] = [];
  private previousCenter: { x: number; y: number } | null = null;
  private intervalId: number | null = null;
  private detector: { detect: (source: CanvasImageSource) => Promise<Array<{ boundingBox: DOMRectReadOnly }>> } | null =
    null;

  async init() {
    if (typeof window === "undefined") {
      return;
    }
    const browserWindow = window as Window & {
      FaceDetector?: new (options?: { fastMode?: boolean }) => {
        detect: (source: CanvasImageSource) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
      };
    };
    if (browserWindow.FaceDetector) {
      this.detector = new browserWindow.FaceDetector({ fastMode: true });
    }
  }

  start(video: HTMLVideoElement, canvas: HTMLCanvasElement, intervalMs = 700) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return;
    }

    this.intervalId = window.setInterval(() => {
      if (video.readyState < 2 || !video.videoWidth) {
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      void this.captureSample(context, canvas.width, canvas.height);
    }, intervalMs);
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async captureSample(context: CanvasRenderingContext2D, width: number, height: number) {
    let faceVisible = false;
    let centerOffset = 0.5;
    let motionDelta = 0;

    if (this.detector) {
      try {
        const faces = await this.detector.detect(context.canvas);
        if (faces.length > 0) {
          faceVisible = true;
          const box = faces[0].boundingBox;
          const centerX = (box.x + box.width / 2) / width;
          const centerY = (box.y + box.height / 2) / height;
          centerOffset = Math.hypot(centerX - 0.5, centerY - 0.42);
          if (this.previousCenter) {
            motionDelta = Math.hypot(centerX - this.previousCenter.x, centerY - this.previousCenter.y);
          }
          this.previousCenter = { x: centerX, y: centerY };
        }
      } catch {
        faceVisible = false;
      }
    } else {
      const heuristic = this.heuristicFace(context, width, height);
      faceVisible = heuristic.faceVisible;
      centerOffset = heuristic.centerOffset;
      motionDelta = heuristic.motionDelta;
    }

    const image = context.getImageData(0, 0, width, height).data;
    let luminanceTotal = 0;
    for (let index = 0; index < image.length; index += 16) {
      const red = image[index];
      const green = image[index + 1];
      const blue = image[index + 2];
      luminanceTotal += 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    }
    const luminance = luminanceTotal / (image.length / 16);

    this.samples.push({ faceVisible, centerOffset, luminance, motionDelta });
  }

  private heuristicFace(context: CanvasRenderingContext2D, width: number, height: number) {
    const centerWidth = Math.floor(width * 0.42);
    const centerHeight = Math.floor(height * 0.52);
    const startX = Math.floor((width - centerWidth) / 2);
    const startY = Math.floor(height * 0.12);
    const patch = context.getImageData(startX, startY, centerWidth, centerHeight).data;

    let skinScore = 0;
    let samples = 0;
    for (let index = 0; index < patch.length; index += 16) {
      const red = patch[index];
      const green = patch[index + 1];
      const blue = patch[index + 2];
      if (red > 55 && green > 35 && blue > 20 && red > green && red > blue) {
        skinScore += 1;
      }
      samples += 1;
    }

    const ratio = samples > 0 ? skinScore / samples : 0;
    const faceVisible = ratio > 0.14;
    const centerOffset = faceVisible ? Math.abs(0.5 - (startX + centerWidth / 2) / width) + 0.08 : 0.55;
    const motionDelta = this.previousCenter ? 0.02 : 0.04;
    if (faceVisible) {
      this.previousCenter = { x: 0.5, y: 0.42 };
    }

    return { faceVisible, centerOffset, motionDelta };
  }

  buildMetrics(): FaceMetrics {
    if (!this.samples.length) {
      return {
        samples: 0,
        face_visible_percent: 0,
        eye_contact_score: 0,
        posture_stability: 0,
        lighting_score: 0,
        expression_engagement: 0,
        head_movement_variance: 0
      };
    }

    const visible = this.samples.filter((sample) => sample.faceVisible).length;
    const faceVisiblePercent = (visible / this.samples.length) * 100;
    const offsets = this.samples.filter((sample) => sample.faceVisible).map((sample) => sample.centerOffset);
    const avgOffset = offsets.length ? offsets.reduce((sum, value) => sum + value, 0) / offsets.length : 0.5;
    const eyeContactScore = Math.max(0, Math.min(100, 100 - avgOffset * 180));
    const motionValues = this.samples.map((sample) => sample.motionDelta);
    const motionMean = motionValues.reduce((sum, value) => sum + value, 0) / motionValues.length;
    const motionVariance =
      motionValues.reduce((sum, value) => sum + (value - motionMean) ** 2, 0) / Math.max(1, motionValues.length);
    const postureStability = Math.max(0, Math.min(100, 100 - motionVariance * 9000));
    const luminanceValues = this.samples.map((sample) => sample.luminance);
    const avgLuminance = luminanceValues.reduce((sum, value) => sum + value, 0) / luminanceValues.length;
    const lightingScore = Math.max(0, Math.min(100, 100 - Math.abs(avgLuminance - 145) * 0.55));
    const expressionEngagement = Math.max(
      0,
      Math.min(100, faceVisiblePercent * 0.55 + eyeContactScore * 0.25 + lightingScore * 0.2)
    );

    return {
      samples: this.samples.length,
      face_visible_percent: Number(faceVisiblePercent.toFixed(1)),
      eye_contact_score: Number(eyeContactScore.toFixed(1)),
      posture_stability: Number(postureStability.toFixed(1)),
      lighting_score: Number(lightingScore.toFixed(1)),
      expression_engagement: Number(expressionEngagement.toFixed(1)),
      head_movement_variance: Number((motionVariance * 10000).toFixed(2))
    };
  }

  reset() {
    this.samples = [];
    this.previousCenter = null;
  }
}

export class SpeechTranscriber {
  private recognition: SpeechRecognitionInstance | null = null;
  private transcript = "";
  private startedAt = 0;

  isSupported() {
    return getSpeechRecognition() !== null;
  }

  start(onPartial?: (text: string) => void) {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      throw new Error("Speech recognition is not supported in this browser. Use Chrome or Edge.");
    }

    this.transcript = "";
    this.startedAt = performance.now();
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => {
      let combined = "";
      for (let index = 0; index < event.results.length; index += 1) {
        combined += `${event.results[index][0].transcript} `;
      }
      this.transcript = combined.trim();
      onPartial?.(this.transcript);
    };

    recognition.onerror = () => {
      // Keep partial transcript if the browser ends recognition unexpectedly.
    };

    recognition.start();
    this.recognition = recognition;
  }

  stop() {
    this.recognition?.stop();
    this.recognition = null;
    return {
      transcript: this.transcript,
      speakingSeconds: Math.max(1, (performance.now() - this.startedAt) / 1000)
    };
  }
}

export async function requestInterviewMedia() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true
    },
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  });
}

export function speakQuestion(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
