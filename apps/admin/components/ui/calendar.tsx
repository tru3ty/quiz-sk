"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root:            cn("w-fit", d.root),
        months:          cn("flex flex-col gap-4", d.months),
        month:           cn("flex w-full flex-col gap-4", d.month),
        nav:             cn("absolute inset-x-0 top-3 flex items-center justify-between px-3 pointer-events-none", d.nav),
        button_previous: cn("pointer-events-auto h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.12] bg-transparent text-white/60 hover:border-[#00e5ff]/50 hover:text-[#00e5ff] transition-colors cursor-pointer", d.button_previous),
        button_next:     cn("pointer-events-auto h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.12] bg-transparent text-white/60 hover:border-[#00e5ff]/50 hover:text-[#00e5ff] transition-colors cursor-pointer", d.button_next),
        month_caption:   cn("flex h-7 w-full items-center justify-center", d.month_caption),
        caption_label:   cn("text-sm font-medium text-[#f4f2ff] select-none", d.caption_label),
        weekdays:        cn("flex", d.weekdays),
        weekday:         cn("w-9 h-9 text-[0.75rem] font-mono text-white/40 text-center select-none flex items-center justify-center", d.weekday),
        weeks:           cn("mt-1", d.weeks),
        week:            cn("flex w-full", d.week),
        day:             cn("w-9 h-9 p-0 text-center", d.day),
        day_button:      cn("w-9 h-9 flex items-center justify-center rounded-xl text-sm font-mono text-[#f4f2ff] hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] transition-colors cursor-pointer bg-transparent border-0", d.day_button),
        selected:        "!bg-[#00e5ff] !text-[#0a0420] !rounded-xl font-bold",
        today:           "border border-[#00e5ff]/50 rounded-xl text-[#00e5ff]",
        outside:         cn("text-white/20", d.outside),
        disabled:        cn("text-white/20 cursor-not-allowed", d.disabled),
        hidden:          cn("invisible", d.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeftIcon className="h-4 w-4" />
            : <ChevronRightIcon className="h-4 w-4" />,
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-mono transition-colors cursor-pointer bg-transparent border-0",
        "text-[#f4f2ff] hover:bg-[#00e5ff]/10 hover:text-[#00e5ff]",
        modifiers.selected && "bg-[#00e5ff]! text-[#0a0420]! font-bold",
        modifiers.today && !modifiers.selected && "border border-[#00e5ff]/50 text-[#00e5ff]",
        modifiers.outside && "text-white/20",
        modifiers.disabled && "text-white/20 cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
}

export { Calendar }
