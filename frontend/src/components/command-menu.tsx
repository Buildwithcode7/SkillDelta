"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { navItems } from "@/lib/sample-data";

const actions = [
  { label: "Analyze my skills", href: "/analysis" },
  { label: "Generate roadmap", href: "/roadmap" },
  { label: "Start mock interview", href: "/mock-interview" },
  { label: "Improve resume", href: "/resume-analyzer" },
  { label: "Create project idea", href: "/project-generator" },
  { label: "Open Career Twin", href: "/career-twin" }
];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = useMemo(() => [...navItems, ...actions], []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || event.key === "/") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-md" onClick={() => setOpen(false)}>
      <Command
        className="glass w-full max-w-2xl overflow-hidden rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder="Search SkillDelta or run an action..."
            className="h-14 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Command.List className="max-h-96 overflow-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">No command found.</Command.Empty>
          <Command.Group heading="Navigation" className="text-xs text-muted-foreground">
            {items.map((item) => (
              <Command.Item
                key={`${item.label}-${item.href}`}
                value={item.label}
                className="flex cursor-pointer items-center justify-between rounded-md px-3 py-3 text-sm text-foreground aria-selected:bg-white/10"
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.href}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
