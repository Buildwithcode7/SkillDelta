"use client";

import { motion } from "framer-motion";
import { clamp } from "@/lib/utils";

export function ProgressRing({
  value,
  label,
  size = 126
}: {
  value: number;
  label?: string;
  size?: number;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ height: size, width: size }}>
      <svg height={size} width={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.22)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring-gradient)"
          strokeLinecap="round"
          strokeWidth={stroke}
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#5b8dff" />
            <stop offset="0.55" stopColor="#a855f7" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold">{Math.round(progress)}%</div>
        {label ? <div className="mt-1 text-xs text-muted-foreground">{label}</div> : null}
      </div>
    </div>
  );
}
