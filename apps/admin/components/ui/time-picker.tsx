"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hh, mm] = value ? value.split(":") : ["19", "00"];

  const hourRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && hourRef.current) {
      const el = hourRef.current.querySelector(`[data-hour="${hh}"]`) as HTMLElement;
      el?.scrollIntoView({ block: "center" });
    }
  }, [open, hh]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-3.5 text-sm outline-none cursor-pointer transition-colors",
            "hover:border-white/20 focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20",
            className,
          )}
        >
          <ClockIcon className="h-4 w-4 shrink-0 opacity-50" />
          <span className="font-mono">{value || "19:00"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-2">
        <div className="flex gap-1">
          <div ref={hourRef} className="flex flex-col gap-0.5 overflow-y-auto max-h-48 flex-1 scrollbar-thin">
            {HOURS.map((h) => (
              <button
                key={h}
                data-hour={h}
                type="button"
                onClick={() => onChange(`${h}:${mm}`)}
                className={cn(
                  "w-full text-center font-mono text-sm py-1 rounded-md cursor-pointer transition-colors",
                  h === hh
                    ? "bg-[#00e5ff] text-[#0a0420] font-bold"
                    : "text-white/70 hover:bg-[#00e5ff]/10 hover:text-[#00e5ff]",
                )}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="w-px bg-white/[0.08]" />
          <div className="flex flex-col gap-0.5 flex-1">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { onChange(`${hh}:${m}`); setOpen(false); }}
                className={cn(
                  "w-full text-center font-mono text-sm py-1 rounded-md cursor-pointer transition-colors",
                  m === mm
                    ? "bg-[#00e5ff] text-[#0a0420] font-bold"
                    : "text-white/70 hover:bg-[#00e5ff]/10 hover:text-[#00e5ff]",
                )}
              >
                :{m}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
