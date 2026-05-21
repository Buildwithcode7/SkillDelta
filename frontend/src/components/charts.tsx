"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useLiveCareer } from "@/lib/live-career";

const tooltipStyle = {
  background: "rgba(7, 12, 28, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "8px",
  color: "#fff"
};

function ChartEmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-56 items-center justify-center rounded-md border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ReadinessAreaChart() {
  const { dashboard } = useLiveCareer();
  const readinessHistory = dashboard?.readiness_history ?? [];
  if (!readinessHistory.length) {
    return <ChartEmptyState label="Run a live sync to chart readiness momentum." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={readinessHistory} margin={{ left: -16, right: 12, top: 12 }}>
        <defs>
          <linearGradient id="readiness" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#5b8dff" stopOpacity={0.42} />
            <stop offset="95%" stopColor="#5b8dff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="readiness" stroke="#5b8dff" fill="url(#readiness)" strokeWidth={3} />
        <Line type="monotone" dataKey="resume" stroke="#22d3ee" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillRadarChart() {
  const { dashboard } = useLiveCareer();
  const skillRadar = dashboard?.skill_radar ?? [];
  if (!skillRadar.length) {
    return <ChartEmptyState label="Connect profile evidence to build a skill radar." />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={skillRadar}>
        <PolarGrid stroke="rgba(148,163,184,0.18)" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
        <Radar name="Current" dataKey="current" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.22} />
        <Radar name="Target" dataKey="target" stroke="#a855f7" fill="#a855f7" fillOpacity={0.16} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function GitHubBarChart() {
  const { dashboard } = useLiveCareer();
  const githubActivity = dashboard?.github_activity ?? [];
  if (!githubActivity.length || !dashboard?.github) {
    return <ChartEmptyState label="Add a GitHub username to pull live public activity." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={githubActivity} margin={{ left: -16, right: 12, top: 12 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="commits" radius={[6, 6, 0, 0]} fill="#5b8dff" />
        <Bar dataKey="reviews" radius={[6, 6, 0, 0]} fill="#22d3ee" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SalaryProjectionChart() {
  const { dashboard } = useLiveCareer();
  const salaryProjection = dashboard?.salary_projection ?? [];
  if (!salaryProjection.length) {
    return <ChartEmptyState label="Run a live sync to calculate salary projection." />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salaryProjection} margin={{ left: -12, right: 12, top: 12 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => `$${value}L`} />
        <Line type="monotone" dataKey="low" stroke="#38bdf8" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="median" stroke="#a855f7" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="high" stroke="#34d399" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
