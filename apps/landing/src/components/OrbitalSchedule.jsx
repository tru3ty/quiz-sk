import { useState } from "react";
import { themeColor } from "../data/events.js";
import SectionHeader from "./SectionHeader.jsx";
import ScheduleCard from "./ScheduleCard.jsx";

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
}

const MONTH_NAMES = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function buildGrid(events, year, month) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // пн=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const ev = events.find(e => e.date === d && e.month === month && e.year === year);
    cells.push({ day: d, ev });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return cells;
}

export default function OrbitalSchedule({ events, loading, onBook }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const grid = buildGrid(events, viewYear, viewMonth);
  const monthEvents = events
    .filter(e => e.month === viewMonth && e.year === viewYear)
    .sort((a, b) => a.date - b.date);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  return (
    <section id="schedule" className="px-6 sm:px-10 lg:px-14 py-20 sm:py-24 max-w-[1280px] mx-auto relative z-[2]">
      <SectionHeader
        kicker="// schedule"
        title="Расписание"
        subtitle="Выбирай дату — и записывайся прямо из календаря."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-9 items-start">
        {/* Calendar */}
        <div
          className="p-4 sm:p-6 bg-(--color-orb-surface) border border-(--color-orb-border) rounded-[28px]"
          style={{ backdropFilter: "blur(14px)" }}
        >
          <div className="flex justify-between items-center mb-4 sm:mb-[18px]">
            <div className="font-unbounded font-bold text-lg sm:text-[22px]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-9 h-9 rounded-full border border-(--color-orb-border) bg-transparent text-(--color-orb-text) cursor-pointer text-base">‹</button>
              <button onClick={nextMonth} className="w-9 h-9 rounded-full border border-(--color-orb-border) bg-transparent text-(--color-orb-text) cursor-pointer text-base">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 font-jbmono text-[10px] sm:text-[11px] text-(--color-orb-sub) mb-2 uppercase tracking-[0.16em]">
            {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((d) => (
              <div key={d} className="py-1 px-0.5 sm:px-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {grid.map((c, i) => {
              if (c.blank) return <div key={i} className="aspect-square" />;
              const ev = c.ev;
              const sold = ev && ev.seats === 0;
              const color = ev ? themeColor(ev.theme) : null;
              return (
                <button
                  key={i}
                  onClick={() => ev && onBook(ev)}
                  disabled={!ev}
                  className="aspect-square rounded-xl sm:rounded-[14px] border flex flex-col justify-between p-1 sm:p-2 font-jbmono transition-all duration-[180ms] disabled:cursor-default"
                  style={{
                    border: ev ? `1px solid ${color}88` : "1px solid transparent",
                    background: ev ? `linear-gradient(160deg, ${color}22, transparent)` : "transparent",
                    color: "#f4f2ff",
                    cursor: ev ? "pointer" : "default",
                    opacity: ev ? 1 : 0.55,
                  }}
                  onMouseEnter={(e) => { if (ev) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={(e) => { if (ev) e.currentTarget.style.background = ev ? `linear-gradient(160deg, ${color}22, transparent)` : "transparent"; }}
                >
                  <span className="text-[11px] sm:text-[13px] font-semibold text-left">
                    {String(c.day).padStart(2, "0")}
                  </span>
                  {ev && (
                    <span className="text-[8px] sm:text-[10px] text-left leading-tight opacity-95">
                      <span className="block font-semibold" style={{ color }}>{ev.time}</span>
                      <span className="block opacity-85">{sold ? "—" : `${ev.seats} мест`}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-(--color-orb-border) flex gap-4 flex-wrap font-jbmono text-[11px] text-(--color-orb-sub)">
            <Legend color="#00e5ff" label="Есть места" />
            <Legend color="#ff5570" label="Sold out" />
          </div>
        </div>

        {/* Upcoming list */}
        <div>
          <div className="font-jbmono text-[11px] tracking-[0.2em] text-(--color-orb-sub) uppercase mb-3.5">
            // ближайшие квизы
          </div>
          {loading ? (
            <div className="font-jbmono text-(--color-orb-sub) text-sm">загрузка...</div>
          ) : monthEvents.length === 0 ? (
            <div className="font-jbmono text-(--color-orb-sub) text-sm">// мероприятий нет</div>
          ) : (
            <div className="grid gap-3.5">
              {monthEvents.slice(0, 4).map((ev) => (
                <ScheduleCard key={ev.id} ev={ev} onBook={() => onBook(ev)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

