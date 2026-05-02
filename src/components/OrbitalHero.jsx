import { useMemo } from "react";
import { SQ_EVENTS } from "../data/events.js";
import OrbitalSystem from "./OrbitalSystem.jsx";

const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: (Math.sin(i * 137.508) * 0.5 + 0.5) * 100,
  y: (Math.cos(i * 97.3) * 0.5 + 0.5) * 100,
  s: (i % 3) * 0.5 + 0.4,
  d: (i % 5) * 0.8 + 2,
  delay: (i % 7) * 0.6,
}));

export default function OrbitalHero({ onBook }) {
  return (
    <section className="relative px-6 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-20 sm:pb-24 min-h-[600px] sm:min-h-[700px]">
      {/* stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[--color-orb-text] opacity-60"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              animation: `orbTwinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* nebula glow */}
      <div
        className="absolute top-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          left: "55%",
          background: "radial-gradient(circle, rgba(255,46,196,0.33) 0%, rgba(0,229,255,0.2) 30%, transparent 60%)",
          animation: "orbGlowPulse 6s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-10 items-center">
        {/* text column */}
        <div>
          {/* badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 border border-[--color-orb-border] rounded-full bg-[--color-orb-surface] font-[family-name:--font-mono] text-xs text-[--color-orb-sub] mb-7">
            <span
              className="w-2 h-2 rounded-full bg-[--color-orb-accent]"
              style={{
                boxShadow: "0 0 8px #00e5ff",
                animation: "orbTwinkle 1.4s ease-in-out infinite",
              }}
            />
            <span>SEASON_07 · ОНЛАЙН ЗАПИСЬ</span>
          </div>

          <h1 className="font-[family-name:--font-unbounded] font-black leading-[0.95] tracking-[-0.04em] m-0 mb-6 text-[clamp(52px,10vw,92px)]">
            <span className="block">Квизы,</span>
            <span
              className="block italic"
              style={{
                background: "linear-gradient(90deg, #00e5ff, #ff2ec4, #b388ff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              после которых
            </span>
            <span className="block">остаются звёзды.</span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[--color-orb-sub] max-w-[480px] mb-9">
            Каждую среду и субботу — 7 раундов вопросов, бар, друзья и шанс
            попасть в зал славы. Никакой подготовки. Только космос.
          </p>

          <div className="flex gap-3.5 items-center flex-wrap">
            <button
              onClick={onBook}
              className="px-6 sm:px-7 py-4 sm:py-[18px] border-0 rounded-full font-bold text-sm sm:text-base cursor-pointer tracking-[0.01em] transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(90deg, #00e5ff, #ff2ec4)",
                color: "#0a0420",
                boxShadow: "0 12px 40px rgba(0,229,255,0.4)",
              }}
            >
              Записаться на ближайший →
            </button>
            <a
              href="#schedule"
              className="text-sm font-medium px-5 sm:px-[22px] py-4 sm:py-[18px] border border-[--color-orb-border] rounded-full bg-[--color-orb-surface] text-[--color-orb-text] no-underline transition-colors duration-150 hover:text-[--color-orb-accent]"
            >
              Все даты месяца
            </a>
          </div>

          {/* stats */}
          <div className="mt-10 sm:mt-12 flex gap-6 sm:gap-8 font-[family-name:--font-mono]">
            {[
              { n: "9",    l: "квизов в мае" },
              { n: "560+", l: "игроков сезона" },
              { n: "3",    l: "бара-партнёра" },
            ].map((x) => (
              <div key={x.l}>
                <div className="text-2xl sm:text-[28px] text-[--color-orb-accent] font-bold">{x.n}</div>
                <div className="text-[10px] sm:text-[11px] text-[--color-orb-sub] uppercase tracking-[0.18em] mt-0.5">{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* orbital */}
        <div className="w-full max-w-[400px] sm:max-w-[540px] mx-auto lg:mx-0 lg:ml-auto mt-8 lg:mt-0">
          <OrbitalSystem />
        </div>
      </div>
    </section>
  );
}
