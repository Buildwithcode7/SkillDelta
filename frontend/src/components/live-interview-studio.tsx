"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  Eye,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  Video,
  VideoOff
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import {
  apiFetch,
  type InterviewAnswerAnalysis,
  type InterviewSession,
  type InterviewSessionReport
} from "@/lib/api";
import {
  createVoiceAnalyzer,
  FaceMetricsCollector,
  requestInterviewMedia,
  speakQuestion,
  SpeechTranscriber
} from "@/lib/interview-metrics";
import { saveInterviewSessionReport } from "@/lib/certificate-storage";
import { useLiveCareer } from "@/lib/live-career";
import { cn } from "@/lib/utils";

const interviewModes = [
  { label: "Technical", mode: "technical", icon: Mic },
  { label: "Behavioral", mode: "behavioral", icon: Sparkles },
  { label: "Coding", mode: "coding", icon: Video },
  { label: "System Design", mode: "system design", icon: Eye }
] as const;

type SessionPhase = "idle" | "setup" | "ready" | "asking" | "recording" | "analyzing" | "review" | "complete";

function ScoreBar({ label, score, note }: { label: string; score: number; note?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span>{Math.round(score)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export function LiveInterviewStudio() {
  const { profile, dashboard, loading: careerLoading } = useLiveCareer();
  const [mode, setMode] = useState<(typeof interviewModes)[number]["mode"]>("technical");
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [answerAnalyses, setAnswerAnalyses] = useState<InterviewAnswerAnalysis[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<InterviewAnswerAnalysis | null>(null);
  const [sessionReport, setSessionReport] = useState<InterviewSessionReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const voiceAnalyzerRef = useRef<ReturnType<typeof createVoiceAnalyzer> | null>(null);
  const faceCollectorRef = useRef<FaceMetricsCollector | null>(null);
  const transcriberRef = useRef<SpeechTranscriber | null>(null);

  const weakSkills = useMemo(
    () => dashboard?.gap_analysis.map((gap) => gap.skill).slice(0, 6) ?? [],
    [dashboard]
  );

  const currentQuestion = session?.questions[questionIndex] ?? null;
  const questionsTotal = session?.questions.length ?? 0;

  const stopMedia = useCallback(() => {
    voiceAnalyzerRef.current?.stop();
    voiceAnalyzerRef.current = null;
    faceCollectorRef.current?.stop();
    faceCollectorRef.current = null;
    transcriberRef.current?.stop();
    transcriberRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMediaReady(false);
  }, []);

  useEffect(() => () => stopMedia(), [stopMedia]);

  const enableMedia = async () => {
    setError(null);
    try {
      const stream = await requestInterviewMedia();
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const collector = new FaceMetricsCollector();
      await collector.init();
      faceCollectorRef.current = collector;
      if (videoRef.current && canvasRef.current) {
        collector.start(videoRef.current, canvasRef.current);
      }
      voiceAnalyzerRef.current = createVoiceAnalyzer(stream);
      setMediaReady(true);
      setPhase("ready");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Camera and microphone access is required for live interview practice."
      );
      setPhase("idle");
    }
  };

  const startSession = async () => {
    setError(null);
    setSessionReport(null);
    setAnswerAnalyses([]);
    setLatestAnalysis(null);
    setQuestionIndex(0);
    setPhase("setup");

    try {
      const response = await apiFetch<InterviewSession>("/api/mock-interview/session", {
        method: "POST",
        body: JSON.stringify({
          dream_job_title: profile.dream_job_title,
          mode,
          weak_skills: weakSkills
        })
      });
      setSession(response);
      if (!mediaReady) {
        await enableMedia();
      }
      setPhase("asking");
      if (response.questions[0]) {
        speakQuestion(response.questions[0]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start interview session.");
      setPhase("idle");
    }
  };

  const startRecording = () => {
    setError(null);
    setLiveTranscript("");
    faceCollectorRef.current?.reset();

    const transcriber = new SpeechTranscriber();
    if (!transcriber.isSupported()) {
      setError("Speech recognition requires Chrome or Edge. You can still practice on camera and type is not supported yet.");
      return;
    }

    transcriberRef.current = transcriber;
    try {
      transcriber.start((partial) => setLiveTranscript(partial));
      setPhase("recording");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start speech recognition.");
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !session) {
      return;
    }

    setPhase("analyzing");
    const speech = transcriberRef.current?.stop() ?? { transcript: liveTranscript, speakingSeconds: 1 };
    transcriberRef.current = null;

    const voiceMetrics =
      voiceAnalyzerRef.current?.buildMetrics(speech.transcript, speech.speakingSeconds) ?? {
        words_per_minute: 0,
        speaking_seconds: speech.speakingSeconds,
        filler_count: 0,
        long_pause_count: 0,
        average_volume: 0,
        volume_stability: 0,
        energy_score: 0,
        clarity_score: 0
      };
    const faceMetrics = faceCollectorRef.current?.buildMetrics() ?? {
      samples: 0,
      face_visible_percent: 0,
      eye_contact_score: 0,
      posture_stability: 0,
      lighting_score: 0,
      expression_engagement: 0,
      head_movement_variance: 0
    };

    try {
      const analysis = await apiFetch<InterviewAnswerAnalysis>("/api/mock-interview/analyze-answer", {
        method: "POST",
        body: JSON.stringify({
          question: currentQuestion,
          transcript: speech.transcript,
          dream_job_title: profile.dream_job_title,
          mode: session.mode,
          voice_metrics: voiceMetrics,
          face_metrics: faceMetrics
        })
      });

      const nextAnswers = [...answerAnalyses, analysis];
      setAnswerAnalyses(nextAnswers);
      setLatestAnalysis(analysis);
      setLiveTranscript(analysis.transcript);

      const nextIndex = questionIndex + 1;
      if (nextIndex < session.questions.length) {
        setQuestionIndex(nextIndex);
        setPhase("asking");
        speakQuestion(session.questions[nextIndex]);
      } else {
        const report = await apiFetch<InterviewSessionReport>("/api/mock-interview/session-report", {
          method: "POST",
          body: JSON.stringify({
            dream_job_title: profile.dream_job_title,
            mode: session.mode,
            answers: nextAnswers
          })
        });
        setSessionReport(report);
        saveInterviewSessionReport(report);
        setPhase("complete");
        window.speechSynthesis?.cancel();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Answer analysis failed.");
      setPhase("review");
    }
  };

  const resetStudio = () => {
    stopMedia();
    setPhase("idle");
    setSession(null);
    setQuestionIndex(0);
    setLiveTranscript("");
    setAnswerAnalyses([]);
    setLatestAnalysis(null);
    setSessionReport(null);
    setError(null);
  };

  const toggleCamera = () => {
    const stream = mediaStreamRef.current;
    if (!stream) {
      return;
    }
    const track = stream.getVideoTracks()[0];
    if (!track) {
      return;
    }
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const phaseLabel: Record<SessionPhase, string> = {
    idle: "Ready to start",
    setup: "Preparing session",
    ready: "Media connected",
    asking: "Interviewer asking",
    recording: "Recording your answer",
    analyzing: "Analyzing voice & face",
    review: "Review answer",
    complete: "Session complete"
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <Panel className="overflow-hidden p-0">
          <div className="relative aspect-video bg-black/60">
            <video
              ref={videoRef}
              className={cn("h-full w-full object-cover", !cameraOn && "opacity-20 blur-sm")}
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-cyan-100">
                {phaseLabel[phase]}
              </span>
              {phase === "recording" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-xs text-rose-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-rose-300" />
                  REC
                </span>
              ) : null}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Live interviewer</p>
                <p className="mt-1 max-w-2xl text-lg font-semibold leading-snug">
                  {currentQuestion ?? "Start a session to receive live questions based on your skill gaps."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={toggleCamera} disabled={!mediaReady}>
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader
            title="Interview mode"
            description="Questions are generated from your weakest skills. Each answer is scored on voice, face presence, and content."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {interviewModes.map(({ label, mode: itemMode, icon: Icon }) => (
              <Button
                key={itemMode}
                variant={mode === itemMode ? "premium" : "outline"}
                disabled={phase !== "idle" && phase !== "ready" && phase !== "asking"}
                onClick={() => setMode(itemMode)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {phase === "idle" ? (
              <>
                <Button variant="outline" onClick={() => void enableMedia()}>
                  <Camera className="h-4 w-4" />
                  Enable camera & mic
                </Button>
                <Button variant="premium" disabled={careerLoading} onClick={() => void startSession()}>
                  {careerLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Start live session
                </Button>
              </>
            ) : null}

            {phase === "asking" ? (
              <>
                <Button variant="premium" onClick={startRecording}>
                  <Mic className="h-4 w-4" />
                  Start answer
                </Button>
                <Button variant="outline" onClick={() => currentQuestion && speakQuestion(currentQuestion)}>
                  <Volume2 className="h-4 w-4" />
                  Repeat question
                </Button>
              </>
            ) : null}

            {phase === "recording" ? (
              <Button variant="premium" onClick={() => void submitAnswer()}>
                <Square className="h-4 w-4" />
                Stop & analyze
              </Button>
            ) : null}

            {phase === "analyzing" ? (
              <Button variant="premium" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing performance
              </Button>
            ) : null}

            {(phase === "complete" || phase === "review") && (
              <Button variant="outline" onClick={resetStudio}>
                <RotateCcw className="h-4 w-4" />
                New session
              </Button>
            )}
          </div>

          {questionsTotal > 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Question {Math.min(questionIndex + 1, questionsTotal)} of {questionsTotal}
              {weakSkills.length ? ` · Focus skills: ${weakSkills.join(", ")}` : ""}
            </p>
          ) : null}

          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
        </Panel>

        <Panel className="p-5">
          <h3 className="font-semibold">Live transcript</h3>
          <p className="mt-3 min-h-28 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-muted-foreground">
            {liveTranscript || "Your spoken answer appears here in real time while recording."}
          </p>
          {latestAnalysis ? (
            <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <p>{latestAnalysis.voice_summary}</p>
              <p>{latestAnalysis.face_summary}</p>
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {sessionReport ? (
            <motion.div key="report" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <Panel className="flex flex-col items-center p-6 text-center">
                <ProgressRing value={sessionReport.overall_score} label="Overall" />
                <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{sessionReport.summary}</p>
              </Panel>
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="Communication" value={sessionReport.communication_score} suffix="%" tone="blue" icon={Mic} />
                <MetricCard label="Confidence" value={sessionReport.confidence_score} suffix="%" tone="violet" icon={Sparkles} />
                <MetricCard label="Technical" value={sessionReport.technical_score} suffix="%" tone="cyan" icon={Eye} />
                <MetricCard label="Presence" value={sessionReport.presence_score} suffix="%" tone="green" icon={Camera} />
              </div>
              <Panel className="p-5">
                <h3 className="font-semibold">Session highlights</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {sessionReport.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5 font-semibold">Focus next</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {sessionReport.focus_areas.map((item) => (
                    <li key={item} className="flex gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>
          ) : latestAnalysis ? (
            <motion.div key="answer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Panel className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Answer analysis</h3>
                  <span className="text-sm text-cyan-200">{latestAnalysis.speaking_pace_label} pace</span>
                </div>
                <div className="mt-5 space-y-4">
                  <ScoreBar label="Communication" score={latestAnalysis.communication_score} />
                  <ScoreBar label="Confidence" score={latestAnalysis.confidence_score} />
                  <ScoreBar label="Technical depth" score={latestAnalysis.technical_score} />
                  <ScoreBar label="Overall" score={latestAnalysis.overall_score} />
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Strengths</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {latestAnalysis.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Improve</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {latestAnalysis.improvements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {phase === "asking" && questionsTotal > questionIndex + 1 ? (
                  <Button className="mt-5 w-full" variant="premium" onClick={startRecording}>
                    <Mic className="h-4 w-4" />
                    Answer next question
                  </Button>
                ) : null}
              </Panel>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Panel className="p-5">
                <h3 className="font-semibold">How live analysis works</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-2">
                    <Mic className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Voice: pace, fillers, pauses, volume stability, and clarity.
                  </li>
                  <li className="flex gap-2">
                    <Camera className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Face: visibility, eye-contact proxy, lighting, and posture stability.
                  </li>
                  <li className="flex gap-2">
                    <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Questions are read aloud; answer on camera like a real video interview.
                  </li>
                </ul>
                {!dashboard ? (
                  <p className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                    Run a profile sync on Dashboard first for stronger weak-skill questions.
                  </p>
                ) : null}
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>

        {answerAnalyses.length > 0 ? (
          <Panel className="p-5">
            <h3 className="font-semibold">Completed answers ({answerAnalyses.length})</h3>
            <div className="mt-4 space-y-3">
              {answerAnalyses.map((answer, index) => (
                <button
                  key={`${answer.question}-${index}`}
                  type="button"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-cyan-300/30"
                  onClick={() => setLatestAnalysis(answer)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium line-clamp-1">{answer.question}</p>
                    <span className="text-xs text-cyan-200">{Math.round(answer.overall_score)}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{answer.transcript}</p>
                </button>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
