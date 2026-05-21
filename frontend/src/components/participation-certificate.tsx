"use client";

import { useUser } from "@clerk/nextjs";
import { Award, Download, Loader2, Printer, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { apiFetch, cleanProfile, type ParticipationCertificate } from "@/lib/api";
import {
  collectCertificateStats,
  loadParticipationCertificate,
  saveParticipationCertificate
} from "@/lib/certificate-storage";
import { useLiveCareer } from "@/lib/live-career";
import { cn } from "@/lib/utils";

const tierStyles: Record<string, string> = {
  Distinguished: "from-amber-400/30 via-yellow-300/20 to-amber-500/30 border-amber-300/40 text-amber-100",
  Proficient: "from-violet-500/25 via-blue-500/20 to-cyan-400/25 border-violet-300/40 text-violet-100",
  Achiever: "from-cyan-500/20 via-blue-500/15 to-emerald-400/20 border-cyan-300/35 text-cyan-100",
  Participating: "from-slate-500/20 via-blue-900/20 to-slate-600/20 border-white/20 text-slate-200"
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function CertificateDocument({ certificate }: { certificate: ParticipationCertificate }) {
  const tierClass = tierStyles[certificate.performance_tier] ?? tierStyles.Participating;

  return (
    <div
      id="skilldelta-certificate"
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-8 shadow-2xl print:rounded-none print:border-2 print:border-slate-800 print:bg-white print:text-slate-900 print:shadow-none",
        tierClass
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 print:hidden">
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -right-8 bottom-6 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl" />
      </div>

      <div className="relative border-b border-white/15 pb-6 text-center print:border-slate-300">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 print:border-slate-400 print:bg-slate-100">
          <Award className="h-6 w-6 print:text-slate-800" />
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground print:text-slate-500">Certificate of Participation</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight print:text-slate-900">{certificate.program_name}</h2>
        <p className="mt-2 text-sm text-muted-foreground print:text-slate-600">SkillDelta · Career Intelligence Platform</p>
      </div>

      <div className="relative mt-8 text-center">
        <p className="text-sm text-muted-foreground print:text-slate-600">This is to certify that</p>
        <p className="mt-2 font-serif text-4xl font-semibold print:text-slate-900">{certificate.recipient_name}</p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground print:text-slate-700">
          has successfully participated in career readiness activities for
        </p>
        <p className="mt-1 text-xl font-medium print:text-slate-900">{certificate.dream_job_title}</p>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
        <div
          className={cn(
            "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wider print:border-slate-400 print:bg-slate-100 print:text-slate-800",
            tierClass
          )}
        >
          {certificate.performance_tier} · {Math.round(certificate.overall_score)}%
        </div>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certificate.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center print:border-slate-200 print:bg-slate-50"
          >
            <p className="text-xs text-muted-foreground print:text-slate-500">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold print:text-slate-900">
              {Math.round(metric.value)}
              {metric.suffix}
            </p>
          </div>
        ))}
      </div>

      <ul className="relative mt-8 space-y-2 text-sm leading-6 text-muted-foreground print:text-slate-700">
        {certificate.highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-300 print:text-slate-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="relative mt-6 text-center text-xs leading-6 text-muted-foreground print:text-slate-600">{certificate.summary}</p>

      <div className="relative mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between print:border-slate-300 print:text-slate-600">
        <div>
          <p>Issued: {formatDate(certificate.issued_at)}</p>
          <p className="mt-1">Certificate ID: {certificate.certificate_id}</p>
        </div>
        <div className="text-left sm:text-right">
          <p>Verification: {certificate.verification_code}</p>
          <p className="mt-1 font-serif text-base text-foreground/80 print:text-slate-800">SkillDelta</p>
        </div>
      </div>
    </div>
  );
}

export function ParticipationCertificatePanel({ compact = false }: { compact?: boolean }) {
  const { profile, dashboard, roadmap, resumeAnalysis, progress, loading, error } = useLiveCareer();
  const { user } = useUser();
  const printRef = useRef<HTMLDivElement>(null);
  const [certificate, setCertificate] = useState<ParticipationCertificate | null>(null);
  const [generating, setGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadParticipationCertificate();
    if (stored) {
      setCertificate(stored);
    }
  }, []);

  const defaultName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    undefined;

  const generate = useCallback(async () => {
    const cleaned = cleanProfile(profile);
    if (!cleaned.dream_job_title) {
      setLocalError("Add a dream job title in your profile before generating a certificate.");
      return;
    }
    if (!dashboard) {
      setLocalError("Run a live sync on Dashboard or Skill Analysis first.");
      return;
    }

    setGenerating(true);
    setLocalError(null);
    try {
      const stats = collectCertificateStats({
        profile: cleaned,
        roadmap: roadmap ?? dashboard.roadmap,
        resumeAnalysis,
        achievements: progress?.achievements_unlocked ?? [],
        xpEarned: progress?.xp_earned ?? 0
      });
      const response = await apiFetch<ParticipationCertificate>("/api/certificate/generate", {
        method: "POST",
        body: JSON.stringify({
          recipient_name: defaultName,
          profile: cleaned,
          stats
        })
      });
      setCertificate(response);
      saveParticipationCertificate(response);
    } catch (caught) {
      setLocalError(caught instanceof Error ? caught.message : "Certificate generation failed.");
    } finally {
      setGenerating(false);
    }
  }, [profile, dashboard, roadmap, resumeAnalysis, progress, defaultName]);

  const handlePrint = () => {
    window.print();
  };

  if (compact && !certificate) {
    return (
      <Panel className="p-5">
        <SectionHeader
          eyebrow="Certificate"
          title="Participation certificate"
          description="Generate a printable certificate from your live performance data."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="premium" disabled={generating || loading || !dashboard} onClick={() => void generate()}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
            Generate certificate
          </Button>
        </div>
        {(localError || error) && <p className="mt-3 text-sm text-rose-300">{localError || error}</p>}
        {certificate ? (
          <Button asChild variant="outline" className="mt-3">
            <Link href="/certificate">View & print certificate</Link>
          </Button>
        ) : null}
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel className="p-5 print:hidden">
        <SectionHeader
          eyebrow="Certificate"
          title="Your participation certificate"
          description="Issued from readiness scores, roadmap progress, interviews, and resume evidence recorded on SkillDelta."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="premium" disabled={generating || loading} onClick={() => void generate()}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
            {certificate ? "Regenerate" : "Generate certificate"}
          </Button>
          {certificate ? (
            <>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Download className="h-4 w-4" />
                Download (PDF via print)
              </Button>
            </>
          ) : null}
        </div>
        {(localError || error) && <p className="mt-3 text-sm text-rose-300">{localError || error}</p>}
        {!dashboard && !localError && (
          <p className="mt-3 text-sm text-muted-foreground">Sync your profile first so scores reflect real evidence.</p>
        )}
      </Panel>

      {certificate ? (
        <div ref={printRef} className="certificate-print-area">
          <CertificateDocument certificate={certificate} />
        </div>
      ) : null}
    </div>
  );
}
