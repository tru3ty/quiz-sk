const ITEMS = ["7 раундов", "★", "командой 2–8", "★", "1 час игры", "★", "бар включён", "★", "приз победителю", "★", "вход 800 ₽", "★"];
const ROW = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

export default function OrbitalTicker() {
  return (
    <div className="border-t border-b border-[--color-orb-border] bg-[--color-orb-surface] overflow-hidden relative z-[2]">
      <div
        className="flex gap-9 py-4 whitespace-nowrap w-max font-[family-name:--font-unbounded] text-xl sm:text-[22px] font-bold tracking-tight"
        style={{ animation: "orbTickerScroll 40s linear infinite" }}
      >
        {ROW.map((t, i) => (
          <span key={i} className={t === "★" ? "text-[--color-orb-accent]" : "text-[--color-orb-text]"}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
