from __future__ import annotations

import json
import re
from statistics import mean
from typing import Any

from app.core.config import get_settings
from app.schemas import (
    FaceMetricsIn,
    InterviewAnswerAnalysisOut,
    InterviewSessionReportOut,
    VoiceMetricsIn,
)


FILLER_WORDS = {
    "um",
    "uh",
    "like",
    "you know",
    "basically",
    "actually",
    "sort of",
    "kind of",
    "i mean",
    "so yeah",
}


class InterviewAnalysisService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def analyze_answer(
        self,
        *,
        question: str,
        transcript: str,
        dream_job_title: str,
        mode: str,
        voice: VoiceMetricsIn,
        face: FaceMetricsIn,
    ) -> InterviewAnswerAnalysisOut:
        if self.settings.openai_api_key and transcript.strip():
            generated = await self._try_openai_json(
                system=(
                    "You are an expert interview coach. Analyze the candidate's live answer using "
                    "transcript, voice metrics, and face metrics. Return strict JSON matching InterviewAnswerAnalysisOut."
                ),
                user={
                    "question": question,
                    "transcript": transcript,
                    "dream_job_title": dream_job_title,
                    "mode": mode,
                    "voice_metrics": voice.model_dump(),
                    "face_metrics": face.model_dump(),
                },
                schema_name="InterviewAnswerAnalysisOut",
            )
            if generated:
                try:
                    return InterviewAnswerAnalysisOut.model_validate(generated)
                except Exception:
                    pass

        return self._heuristic_answer_analysis(
            question=question,
            transcript=transcript,
            dream_job_title=dream_job_title,
            mode=mode,
            voice=voice,
            face=face,
        )

    async def analyze_session(
        self,
        *,
        dream_job_title: str,
        mode: str,
        answers: list[InterviewAnswerAnalysisOut],
    ) -> InterviewSessionReportOut:
        if self.settings.openai_api_key and answers:
            generated = await self._try_openai_json(
                system=(
                    "You synthesize a mock interview session report from per-question analyses. "
                    "Return strict JSON matching InterviewSessionReportOut."
                ),
                user={
                    "dream_job_title": dream_job_title,
                    "mode": mode,
                    "answers": [answer.model_dump() for answer in answers],
                },
                schema_name="InterviewSessionReportOut",
            )
            if generated:
                try:
                    return InterviewSessionReportOut.model_validate(generated)
                except Exception:
                    pass

        return self._heuristic_session_report(dream_job_title=dream_job_title, mode=mode, answers=answers)

    def _heuristic_answer_analysis(
        self,
        *,
        question: str,
        transcript: str,
        dream_job_title: str,
        mode: str,
        voice: VoiceMetricsIn,
        face: FaceMetricsIn,
    ) -> InterviewAnswerAnalysisOut:
        text = transcript.strip()
        words = re.findall(r"[a-zA-Z']+", text.lower())
        word_count = len(words)
        lower = text.lower()

        filler_hits = sum(lower.count(filler) for filler in FILLER_WORDS)
        structure_markers = sum(
            marker in lower
            for marker in ["because", "result", "impact", "tradeoff", "example", "architecture", "metric"]
        )
        star_structure = sum(marker in lower for marker in ["situation", "task", "action", "result"])

        communication = self._clamp(
            42
            + min(28, word_count * 0.45)
            + structure_markers * 4
            + star_structure * 5
            - filler_hits * 3
            - max(0, voice.filler_count - filler_hits) * 2
            + voice.clarity_score * 0.25
            - max(0, voice.words_per_minute - 175) * 0.15
            - max(0, 120 - voice.words_per_minute) * 0.1
        )

        confidence = self._clamp(
            38
            + voice.volume_stability * 0.35
            + voice.energy_score * 0.3
            - voice.long_pause_count * 4
            - filler_hits * 2.5
            + face.posture_stability * 0.2
            + min(18, face.face_visible_percent * 0.18)
        )

        technical = self._clamp(
            40
            + structure_markers * 6
            + min(22, word_count * 0.35)
            + (12 if mode.lower() in {"coding", "technical", "system design"} and any(
                token in lower for token in ["api", "database", "test", "deploy", "scale", "latency", "cache"]
            ) else 0)
            - max(0, 90 - voice.clarity_score) * 0.2
        )

        eye_contact = self._clamp(face.eye_contact_score)
        presence = self._clamp(
            face.face_visible_percent * 0.45
            + face.lighting_score * 0.25
            + face.posture_stability * 0.3
        )

        overall = round(mean([communication, confidence, technical, eye_contact, presence]), 1)

        strengths: list[str] = []
        improvements: list[str] = []

        if word_count >= 80:
            strengths.append("You gave enough depth to evaluate reasoning, not just keywords.")
        if voice.words_per_minute >= 125 and voice.words_per_minute <= 170:
            strengths.append("Speaking pace stayed in a clear, interview-friendly range.")
        if face.eye_contact_score >= 70:
            strengths.append("You maintained strong camera presence and eye-line stability.")
        if structure_markers >= 2:
            strengths.append("You used outcome-oriented language that hiring managers can score quickly.")

        if not text:
            improvements.append("No transcript was captured. Check microphone permissions and speak for at least 20 seconds.")
        if filler_hits >= 4 or voice.filler_count >= 4:
            improvements.append("Reduce filler words and pause intentionally before key points.")
        if face.eye_contact_score < 60:
            improvements.append("Look toward the camera lens and keep your face centered in frame.")
        if voice.words_per_minute > 185:
            improvements.append("Slow down slightly so technical details land with the interviewer.")
        if voice.words_per_minute < 105 and word_count > 0:
            improvements.append("Increase pace slightly so the answer feels decisive rather than hesitant.")
        if structure_markers < 2:
            improvements.append(f"Structure answers for {dream_job_title} using context, action, tradeoff, and measurable result.")
        if star_structure < 1 and "behavior" in mode.lower():
            improvements.append("For behavioral mode, use STAR: situation, task, action, result.")

        if not strengths:
            strengths.append("You completed a live recorded answer, which is the hardest interview habit to build.")
        if not improvements:
            improvements.append("Push one level deeper with metrics, failure modes, and a crisp closing sentence.")

        feedback = [
            f"Communication {communication:.0f}% — {'clear structure' if structure_markers >= 2 else 'needs stronger structure'}.",
            f"Confidence {confidence:.0f}% — {'steady delivery' if voice.volume_stability >= 65 else 'delivery felt uneven'}.",
            f"Technical depth {technical:.0f}% — aligned to {mode} mode for {dream_job_title}.",
            f"Presence {presence:.0f}% with {eye_contact:.0f}% eye-contact proxy from live video.",
        ]

        return InterviewAnswerAnalysisOut(
            question=question,
            transcript=text or "(no speech detected)",
            communication_score=communication,
            confidence_score=confidence,
            technical_score=technical,
            overall_score=overall,
            voice_summary=self._voice_summary(voice),
            face_summary=self._face_summary(face),
            strengths=strengths[:4],
            improvements=improvements[:5],
            feedback=feedback,
            filler_words_detected=filler_hits + voice.filler_count,
            words_spoken=word_count,
            speaking_pace_label=self._pace_label(voice.words_per_minute),
        )

    def _heuristic_session_report(
        self,
        *,
        dream_job_title: str,
        mode: str,
        answers: list[InterviewAnswerAnalysisOut],
    ) -> InterviewSessionReportOut:
        if not answers:
            return InterviewSessionReportOut(
                mode=mode,
                dream_job_title=dream_job_title,
                questions_answered=0,
                communication_score=0,
                confidence_score=0,
                technical_score=0,
                presence_score=0,
                overall_score=0,
                summary="No answers were analyzed. Record at least one live response.",
                highlights=[],
                focus_areas=["Enable camera and microphone, then answer each question aloud."],
                next_steps=["Restart the session and speak for 30–90 seconds per question."],
            )

        communication = round(mean(answer.communication_score for answer in answers), 1)
        confidence = round(mean(answer.confidence_score for answer in answers), 1)
        technical = round(mean(answer.technical_score for answer in answers), 1)
        presence = round(mean((answer.overall_score + answer.confidence_score) / 2 for answer in answers), 1)
        overall = round(mean(answer.overall_score for answer in answers), 1)

        highlights = sorted(
            {item for answer in answers for item in answer.strengths},
            key=len,
        )[:4]
        focus_areas = sorted(
            {item for answer in answers for item in answer.improvements},
            key=len,
        )[:5]

        summary = (
            f"You completed {len(answers)} live {mode} questions for {dream_job_title}. "
            f"Overall performance scored {overall:.0f}% with communication at {communication:.0f}% "
            f"and technical depth at {technical:.0f}%."
        )

        next_steps = [
            "Re-record your weakest answer and cut filler words in half.",
            "Add one quantified outcome and one tradeoff to every technical story.",
            "Practice 60-second answers with camera-centered eye contact before the next session.",
        ]

        return InterviewSessionReportOut(
            mode=mode,
            dream_job_title=dream_job_title,
            questions_answered=len(answers),
            communication_score=communication,
            confidence_score=confidence,
            technical_score=technical,
            presence_score=presence,
            overall_score=overall,
            summary=summary,
            highlights=highlights,
            focus_areas=focus_areas,
            next_steps=next_steps,
            per_question=answers,
        )

    def _voice_summary(self, voice: VoiceMetricsIn) -> str:
        return (
            f"Pace {voice.words_per_minute} WPM, {voice.filler_count} fillers, "
            f"{voice.long_pause_count} long pauses, clarity {voice.clarity_score:.0f}%."
        )

    def _face_summary(self, face: FaceMetricsIn) -> str:
        return (
            f"Face visible {face.face_visible_percent:.0f}%, eye contact proxy {face.eye_contact_score:.0f}%, "
            f"lighting {face.lighting_score:.0f}%, posture stability {face.posture_stability:.0f}%."
        )

    def _pace_label(self, wpm: float) -> str:
        if wpm <= 0:
            return "No speech"
        if wpm < 105:
            return "Slow"
        if wpm <= 175:
            return "Ideal"
        return "Fast"

    def _clamp(self, value: float) -> float:
        return round(max(0.0, min(100.0, value)), 1)

    async def _try_openai_json(self, system: str, user: dict[str, Any], schema_name: str) -> dict[str, Any]:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=self.settings.openai_api_key)
            response = await client.responses.create(
                model=self.settings.openai_model,
                input=[
                    {"role": "system", "content": f"{system} Schema name: {schema_name}."},
                    {"role": "user", "content": json.dumps(user)},
                ],
                text={"format": {"type": "json_object"}},
            )
            return json.loads(response.output_text)
        except Exception:
            return {}


interview_analysis_service = InterviewAnalysisService()
