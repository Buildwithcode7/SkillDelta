import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";

const tones = {
  blue: "from-blue-500/20 to-cyan-400/10 text-blue-200",
  violet: "from-violet-500/20 to-fuchsia-400/10 text-violet-200",
  amber: "from-amber-500/20 to-orange-400/10 text-amber-200",
  green: "from-emerald-500/20 to-lime-400/10 text-emerald-200",
  cyan: "from-cyan-500/20 to-sky-400/10 text-cyan-200",
  rose: "from-rose-500/20 to-pink-400/10 text-rose-200"
};

export function MetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "blue",
  caption
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  caption?: string;
}) {
  return (
    <Panel className="p-5">
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-3 text-3xl font-semibold tracking-normal">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{caption ?? "Updated from current profile signals"}</p>
        </div>
        <div className={cn("rounded-md bg-gradient-to-br p-3", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Panel>
  );
}
