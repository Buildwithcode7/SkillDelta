"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${latest.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.15, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}
