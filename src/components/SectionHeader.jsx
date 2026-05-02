export default function SectionHeader({ kicker, title, subtitle }) {
  return (
    <div className="mb-9 max-w-[760px]">
      <div className="font-[family-name:--font-mono] text-xs tracking-[0.2em] text-[--color-orb-accent] uppercase mb-3.5">
        {kicker}
      </div>
      <h2 className="font-[family-name:--font-unbounded] font-black leading-[0.98] tracking-[-0.03em] m-0 mb-3.5 text-[clamp(36px,6vw,56px)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[--color-orb-sub] text-base sm:text-[17px] leading-relaxed m-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}
