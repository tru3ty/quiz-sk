import { themeColor } from "../data/events.js";

export default function ScheduleCard({ ev, onBook }) {
  const color = themeColor(ev.theme);
  const sold = ev.seats === 0;
  return (
    <div
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-[18px] p-4 sm:p-5 bg-(--color-orb-surface) border border-(--color-orb-border) rounded-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:border-(--color-orb-accent) hover:bg-(--color-orb-surface-strong)"
    >
      <div className="text-center font-unbounded">
        <div className="text-2xl sm:text-[32px] font-black leading-none" style={{ color }}>
          {String(ev.date).padStart(2, "0")}
        </div>
        <div className="text-[10px] font-jbmono text-(--color-orb-sub) uppercase tracking-[0.2em] mt-1">
          {ev.day} · {ev.time}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-base sm:text-[18px] font-bold font-unbounded tracking-[-0.01em] truncate">
          {ev.title}
        </div>
        <div className="flex gap-2 mt-1.5 items-center flex-wrap">
          <span className="text-xs text-(--color-orb-sub) font-jbmono">▣ {ev.host}</span>
          {ev.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full border font-jbmono uppercase tracking-[0.12em]"
              style={{ borderColor: color, color }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onBook}
        disabled={sold}
        className="px-3 sm:px-[18px] py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-[13px] cursor-pointer transition-all duration-150 whitespace-nowrap hover:-translate-y-0.5 disabled:cursor-default disabled:hover:translate-y-0"
        style={{
          background: sold ? "transparent" : "#f4f2ff",
          color: sold ? "rgba(244,242,255,0.6)" : "#0a0420",
          border: sold ? "1px solid rgba(255,255,255,0.12)" : "none",
        }}
      >
        {sold ? "Sold out" : "Записаться"}
      </button>
    </div>
  );
}
