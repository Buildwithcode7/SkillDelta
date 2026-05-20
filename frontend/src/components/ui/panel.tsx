import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass spotlight-card rounded-lg", className)} {...props}>
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-normal text-foreground md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
