function OrbitalLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
      <defs>
        <linearGradient id="orbLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#ff2ec4" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="6" fill="url(#orbLogo)" />
      <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="url(#orbLogo)" strokeWidth="1.4" transform="rotate(-25 16 16)" />
    </svg>
  );
}

export default function OrbitalNav() {
  return (
    <nav className="flex justify-between items-center px-6 sm:px-10 lg:px-14 py-5 sm:py-6 relative z-10">
      <a
        href="#"
        className="flex items-center gap-3 font-[family-name:--font-unbounded] font-black text-lg sm:text-[22px] tracking-tight text-[--color-orb-text] no-underline transition-colors duration-150 hover:text-[--color-orb-accent]"
      >
        <OrbitalLogo />
        <span>STARQUIZ</span>
      </a>

      <div className="flex gap-4 sm:gap-9 items-center">
        {["Расписание", "Правила", "Контакты"].map((x) => (
          <a
            key={x}
            href="#"
            className="hidden sm:block text-sm font-medium text-[--color-orb-text] no-underline transition-colors duration-150 hover:text-[--color-orb-accent]"
          >
            {x}
          </a>
        ))}
        <button className="px-4 sm:px-5 py-2.5 border border-[--color-orb-border] bg-[--color-orb-surface] text-[--color-orb-text] rounded-full cursor-pointer text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_60px_color-mix(in_srgb,var(--color-orb-accent)_33%,transparent),0_0_0_1px_var(--color-orb-accent)]">
          tg&nbsp;/&nbsp;@starquiz
        </button>
      </div>
    </nav>
  );
}
