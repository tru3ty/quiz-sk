import { SQ_RULES } from "../data/events.js";
import SectionHeader from "./SectionHeader.jsx";

export default function OrbitalRules() {
  return (
    <section className="px-6 sm:px-10 lg:px-14 pb-20 sm:pb-24 max-w-[1280px] mx-auto relative z-[2]">
      <SectionHeader
        kicker="// flight plan"
        title="Как проходит квиз"
        subtitle="Один час игры, один час бара. Технология полёта простая."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SQ_RULES.map((r) => (
          <div
            key={r.n}
            className="relative p-6 border border-(--color-orb-border) bg-(--color-orb-surface) rounded-[22px] min-h-[220px] flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-(--color-orb-accent) hover:bg-(--color-orb-surface-strong)"
          >
            <div
              className="absolute -top-7 -right-7 w-[120px] h-[120px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,229,255,0.13), transparent 70%)" }}
            />
            <div className="font-jbmono text-xs tracking-[0.2em] text-(--color-orb-accent)">
              {r.n}
            </div>
            <div>
              <div className="font-unbounded text-[22px] font-bold mb-2.5 tracking-[-0.01em]">
                {r.t}
              </div>
              <div className="text-sm text-(--color-orb-sub) leading-relaxed">{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
