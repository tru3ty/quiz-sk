// Variant 1 — "Orbital": Y2K neon, orbital hero, glow, magnetic CTA
const { useState: useStateO, useEffect: useEffectO, useRef: useRefO, useMemo: useMemoO } = React;

function OrbitalLanding({ paletteKey = "neon", onBook }) {
  const palette = ORBITAL_PALETTES[paletteKey] || ORBITAL_PALETTES.neon;
  const grid = window.SQ_buildMonthGrid();

  return (
    <div style={{
      width: "100%", minHeight: "100%",
      background: palette.bg,
      color: palette.text,
      fontFamily: "'Inter', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <OrbitalGlobalCSS palette={palette} />
      <OrbitalNoise />

      <OrbitalNav palette={palette} />
      <OrbitalHero palette={palette} onBook={() => onBook(window.SQ_EVENTS.find(e => e.seats > 0))} />
      <OrbitalTicker palette={palette} />
      <OrbitalSchedule palette={palette} grid={grid} onBook={onBook} />
      <OrbitalRules palette={palette} />
      <OrbitalContacts palette={palette} />
      <OrbitalFooter palette={palette} />
    </div>
  );
}

const ORBITAL_PALETTES = {
  neon: {
    bg: "radial-gradient(ellipse at 20% 0%, #2b0a52 0%, #0a0420 45%, #050010 100%)",
    text: "#f4f2ff",
    sub: "rgba(244,242,255,0.6)",
    accent: "#00E5FF",
    accent2: "#FF2EC4",
    accent3: "#B388FF",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.12)",
    modalBg: "rgba(8,2,24,0.8)",
    modalCard: "rgba(20,10,42,0.95)",
  },
  deep: {
    bg: "radial-gradient(ellipse at 80% 0%, #0d2c4d 0%, #060a1c 50%, #03050d 100%)",
    text: "#e8efff",
    sub: "rgba(232,239,255,0.55)",
    accent: "#7DD3FC",
    accent2: "#A78BFA",
    accent3: "#F0ABFC",
    surface: "rgba(255,255,255,0.03)",
    surfaceStrong: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    modalBg: "rgba(3,5,13,0.85)",
    modalCard: "rgba(10,18,38,0.96)",
  },
  light: {
    bg: "radial-gradient(ellipse at 30% 0%, #f5e9ff 0%, #ece4ff 40%, #d9d2ff 100%)",
    text: "#1a0a3e",
    sub: "rgba(26,10,62,0.6)",
    accent: "#5B21B6",
    accent2: "#DB2777",
    accent3: "#0891B2",
    surface: "rgba(255,255,255,0.55)",
    surfaceStrong: "rgba(255,255,255,0.8)",
    border: "rgba(26,10,62,0.12)",
    modalBg: "rgba(245,233,255,0.85)",
    modalCard: "rgba(255,255,255,0.97)",
  },
};

function OrbitalGlobalCSS({ palette }) {
  return (
    <style>{`
      @keyframes orbSpin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
      @keyframes orbSpinR { from { transform: rotate(360deg) } to { transform: rotate(0) } }
      @keyframes orbFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
      @keyframes orbTwinkle { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
      @keyframes orbTickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      @keyframes orbGlowPulse { 0%,100% { filter: blur(40px); opacity: .6 } 50% { filter: blur(50px); opacity: .85 } }
      @keyframes orbStripe { from { background-position: 0 0 } to { background-position: 40px 0 } }
      .orb-cta {
        transition: transform 150ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms ease;
      }
      .orb-cta:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 16px 60px ${palette.accent}55, 0 0 0 1px ${palette.accent}; }
      .orb-card {
        transition: transform 200ms cubic-bezier(.2,.8,.2,1), border-color 200ms ease, background 200ms ease;
      }
      .orb-card:hover {
        transform: translateY(-3px);
        border-color: ${palette.accent};
        background: ${palette.surfaceStrong};
      }
      .orb-day-cell { transition: all 180ms ease; cursor: pointer; }
      .orb-day-cell:hover { background: ${palette.surfaceStrong}; }
      .orb-link { color: ${palette.text}; text-decoration: none; transition: color 150ms ease; }
      .orb-link:hover { color: ${palette.accent}; }
    `}</style>
  );
}

function OrbitalNoise() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <filter id="orbNoise">
        <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
      </filter>
    </svg>
  );
}

function OrbitalNav({ palette }) {
  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "26px 56px",
      position: "relative", zIndex: 5,
    }}>
      <a href="#" className="orb-link" style={{
        display: "flex", alignItems: "center", gap: 12,
        fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
        fontSize: 22, letterSpacing: "-0.02em",
      }}>
        <OrbitalLogo palette={palette} />
        <span>STARQUIZ</span>
      </a>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Расписание", "Правила", "Контакты"].map(x => (
          <a key={x} href="#" className="orb-link" style={{ fontSize: 14, fontWeight: 500 }}>{x}</a>
        ))}
        <button className="orb-cta" style={{
          padding: "11px 20px",
          border: `1px solid ${palette.border}`,
          background: palette.surface,
          color: palette.text,
          borderRadius: 999, cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}>
          tg / @starquiz
        </button>
      </div>
    </nav>
  );
}

function OrbitalLogo({ palette }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="orbLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.accent} />
          <stop offset="100%" stopColor={palette.accent2} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="6" fill="url(#orbLogo)" />
      <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="url(#orbLogo)" strokeWidth="1.4" transform="rotate(-25 16 16)" />
    </svg>
  );
}

function OrbitalHero({ palette, onBook }) {
  const stars = useMemoO(() => Array.from({ length: 80 }).map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 1.5 + 0.4,
    d: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  })), []);

  return (
    <section style={{
      position: "relative",
      padding: "60px 56px 100px",
      minHeight: 700,
    }}>
      {/* stars layer */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {stars.map((s, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.s, height: s.s,
            borderRadius: 999,
            background: palette.text,
            opacity: 0.6,
            animation: `orbTwinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* nebula glow */}
      <div style={{
        position: "absolute", left: "55%", top: "-100px",
        width: 700, height: 700, borderRadius: 999,
        background: `radial-gradient(circle, ${palette.accent2}55 0%, ${palette.accent}33 30%, transparent 60%)`,
        animation: "orbGlowPulse 6s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "center",
        position: "relative", zIndex: 2,
        maxWidth: 1280, margin: "0 auto",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 14px",
            border: `1px solid ${palette.border}`,
            borderRadius: 999,
            background: palette.surface,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: palette.sub,
            marginBottom: 28,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 999,
              background: palette.accent,
              boxShadow: `0 0 8px ${palette.accent}`,
              animation: "orbTwinkle 1.4s ease-in-out infinite",
            }} />
            <span>SEASON_07 · ОНЛАЙН ЗАПИСЬ</span>
          </div>

          <h1 style={{
            fontFamily: "'Unbounded', 'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: "0 0 24px",
          }}>
            <span style={{ display: "block" }}>Квизы,</span>
            <span style={{
              display: "block",
              background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2}, ${palette.accent3})`,
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent",
              fontStyle: "italic",
            }}>после которых</span>
            <span style={{ display: "block" }}>остаются звёзды.</span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.5, color: palette.sub, maxWidth: 480, margin: "0 0 36px" }}>
            Каждую среду и субботу — 7 раундов вопросов, бар, друзья и шанс
            попасть в зал славы. Никакой подготовки. Только космос.
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <button className="orb-cta" onClick={onBook} style={{
              padding: "18px 30px",
              border: "none",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
              color: "#0a0420",
              fontWeight: 700, fontSize: 16, cursor: "pointer",
              boxShadow: `0 12px 40px ${palette.accent}66`,
              letterSpacing: "0.01em",
            }}>
              Записаться на ближайший →
            </button>
            <a href="#schedule" className="orb-link" style={{
              fontSize: 14, fontWeight: 500,
              padding: "18px 22px",
              border: `1px solid ${palette.border}`,
              borderRadius: 999,
              background: palette.surface,
            }}>
              Все даты месяца
            </a>
          </div>

          <div style={{
            marginTop: 50,
            display: "flex", gap: 32,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {[
              { n: "9", l: "квизов в мае" },
              { n: "560+", l: "игроков сезона" },
              { n: "3", l: "бара-партнёра" },
            ].map(x => (
              <div key={x.l}>
                <div style={{ fontSize: 28, color: palette.accent, fontWeight: 700 }}>{x.n}</div>
                <div style={{ fontSize: 11, color: palette.sub, textTransform: "uppercase", letterSpacing: "0.18em" }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orbital composition */}
        <OrbitalSystem palette={palette} />
      </div>
    </section>
  );
}

function OrbitalSystem({ palette }) {
  return (
    <div style={{
      position: "relative",
      width: "100%", aspectRatio: "1 / 1",
      maxWidth: 540,
      margin: "0 auto",
    }}>
      {/* outer rings */}
      {[
        { size: 100, dur: "60s", dir: "normal",  dash: "2 8" },
        { size: 78,  dur: "45s", dir: "reverse", dash: "1 12" },
        { size: 58,  dur: "30s", dir: "normal",  dash: "4 4" },
      ].map((r, i) => (
        <div key={i} style={{
          position: "absolute", inset: `${(100 - r.size) / 2}%`,
          borderRadius: 999,
          border: `1px dashed ${palette.border}`,
          animation: `${r.dir === "reverse" ? "orbSpinR" : "orbSpin"} ${r.dur} linear infinite`,
        }}>
          {/* moon on ring */}
          <span style={{
            position: "absolute", top: -8, left: "50%",
            width: 16, height: 16, borderRadius: 999,
            background: i === 0 ? palette.accent : i === 1 ? palette.accent2 : palette.accent3,
            boxShadow: `0 0 16px ${i === 0 ? palette.accent : i === 1 ? palette.accent2 : palette.accent3}`,
            transform: "translateX(-50%)",
          }} />
        </div>
      ))}

      {/* center planet */}
      <div style={{
        position: "absolute", inset: "30%",
        borderRadius: 999,
        background: `
          radial-gradient(circle at 30% 30%, ${palette.accent} 0%, ${palette.accent2} 40%, #2a0857 70%, #0a0420 100%)
        `,
        boxShadow: `
          inset -20px -20px 60px rgba(0,0,0,0.6),
          inset 20px 20px 40px ${palette.accent}33,
          0 0 80px ${palette.accent2}55
        `,
        animation: "orbFloat 6s ease-in-out infinite",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 999,
          filter: "url(#orbNoise)", mixBlendMode: "overlay", opacity: 0.4,
        }} />
      </div>

      {/* HUD ticker around center */}
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, animation: "orbSpin 120s linear infinite" }}>
        <defs>
          <path id="orbHudPath" d="M 50 50 m -45 0 a 45 45 0 1 1 90 0 a 45 45 0 1 1 -90 0" fill="none" />
        </defs>
        <text fill={palette.sub} fontSize="2.6" fontFamily="JetBrains Mono">
          <textPath href="#orbHudPath">
            STARQUIZ · MAY · 09 · SAT · 20:00 · BAR NEBULA · TEAMS 2-8 · 7 ROUNDS · NO INTERNET · SIGNAL ACQUIRED · 
          </textPath>
        </text>
      </svg>

      {/* tag chip */}
      <div style={{
        position: "absolute", bottom: "-10px", right: "0%",
        padding: "10px 16px",
        background: palette.surfaceStrong,
        border: `1px solid ${palette.accent}`,
        borderRadius: 999,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: palette.text,
        boxShadow: `0 0 30px ${palette.accent}33`,
      }}>
        <span style={{ color: palette.accent }}>● LIVE</span> &nbsp;next quiz · сб 20:00
      </div>
    </div>
  );
}

function OrbitalTicker({ palette }) {
  const items = ["7 раундов", "★", "командой 2–8", "★", "1 час игры", "★", "бар включён", "★", "приз победителю", "★", "вход 800 ₽", "★"];
  const row = [...items, ...items, ...items, ...items];
  return (
    <div style={{
      borderTop: `1px solid ${palette.border}`,
      borderBottom: `1px solid ${palette.border}`,
      background: palette.surface,
      overflow: "hidden",
      position: "relative", zIndex: 2,
    }}>
      <div style={{
        display: "flex", gap: 36,
        padding: "16px 0",
        whiteSpace: "nowrap",
        animation: "orbTickerScroll 40s linear infinite",
        width: "max-content",
        fontFamily: "'Unbounded', sans-serif",
        fontSize: 22, fontWeight: 700,
        letterSpacing: "-0.02em",
      }}>
        {row.map((t, i) => (
          <span key={i} style={{ color: t === "★" ? palette.accent : palette.text }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function OrbitalSchedule({ palette, grid, onBook }) {
  const themeColor = (theme) => ({
    "общий": palette.accent,
    "поп-культ": palette.accent2,
    "музыка": "#FACC15",
    "кино": palette.accent3,
    "гик": "#34D399",
    "аниме": "#F472B6",
    "интернет": palette.accent,
    "история": "#FCA5A5",
    "микс": palette.accent2,
  }[theme] || palette.accent);

  return (
    <section id="schedule" style={{ padding: "100px 56px", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
      <SectionHeader palette={palette}
        kicker="// schedule"
        title="Карта мая"
        subtitle="Выбирай дату — и записывайся прямо из календаря." />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: 36,
        alignItems: "start",
      }}>
        {/* Calendar */}
        <div style={{
          padding: 26,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 28,
          backdropFilter: "blur(14px)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 18,
          }}>
            <div style={{
              fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 22,
            }}>{window.SQ_MONTH}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["‹", "›"].map(a => (
                <button key={a} style={{
                  width: 36, height: 36, borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  background: "transparent", color: palette.text,
                  cursor: "pointer", fontSize: 16,
                }}>{a}</button>
              ))}
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: palette.sub,
            marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.16em",
          }}>
            {["пн","вт","ср","чт","пт","сб","вс"].map(d => (
              <div key={d} style={{ padding: "6px 8px" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {grid.map((c, i) => {
              if (c.blank) return <div key={i} style={{ aspectRatio: "1/1" }} />;
              const ev = c.ev;
              const sold = ev && ev.seats === 0;
              return (
                <button
                  key={i}
                  onClick={() => ev && onBook(ev)}
                  disabled={!ev}
                  className="orb-day-cell"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: 14,
                    border: `1px solid ${ev ? themeColor(ev.theme) + "88" : "transparent"}`,
                    background: ev ? `linear-gradient(160deg, ${themeColor(ev.theme)}22, transparent)` : "transparent",
                    color: palette.text,
                    cursor: ev ? "pointer" : "default",
                    padding: 8,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    fontFamily: "inherit",
                    position: "relative",
                    opacity: ev ? 1 : 0.55,
                  }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, textAlign: "left" }}>
                    {String(c.day).padStart(2,"0")}
                  </span>
                  {ev && (
                    <span style={{
                      fontSize: 10, textAlign: "left", lineHeight: 1.15,
                      color: palette.text, opacity: 0.95,
                    }}>
                      <span style={{ display: "block", fontWeight: 600, color: themeColor(ev.theme) }}>{ev.time}</span>
                      <span style={{ display: "block", opacity: 0.85 }}>
                        {sold ? "—" : `${ev.seats} мест`}
                      </span>
                    </span>
                  )}
                  {ev && sold && (
                    <span style={{
                      position: "absolute", top: 6, right: 6,
                      width: 6, height: 6, borderRadius: 999, background: "#FF5570",
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: 18, paddingTop: 16, borderTop: `1px dashed ${palette.border}`,
            display: "flex", gap: 16, flexWrap: "wrap",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: palette.sub,
          }}>
            <Legend dot={palette.accent} label="Среда · 19:30" />
            <Legend dot={palette.accent2} label="Суббота · 20:00" />
            <Legend dot="#FF5570" label="Sold out" />
          </div>
        </div>

        {/* Upcoming list */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.2em", color: palette.sub, textTransform: "uppercase",
            marginBottom: 14,
          }}>
            // ближайшие 4 квиза
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {window.SQ_EVENTS.slice(0, 4).map(ev => (
              <ScheduleCard key={ev.date} ev={ev} palette={palette} themeColor={themeColor(ev.theme)} onBook={() => onBook(ev)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ dot, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
      {label}
    </span>
  );
}

function ScheduleCard({ ev, palette, themeColor, onBook }) {
  const sold = ev.seats === 0;
  return (
    <div className="orb-card" style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 18,
      padding: "18px 20px",
      background: palette.surface,
      border: `1px solid ${palette.border}`,
      borderRadius: 18,
    }}>
      <div style={{
        textAlign: "center",
        fontFamily: "'Unbounded', sans-serif",
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: themeColor }}>
          {String(ev.date).padStart(2, "0")}
        </div>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: palette.sub, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 4 }}>
          {ev.day} · {ev.time}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Unbounded', sans-serif", letterSpacing: "-0.01em" }}>
          {ev.title}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: palette.sub, fontFamily: "'JetBrains Mono', monospace" }}>
            ▣ {ev.host}
          </span>
          {ev.tags.map(t => (
            <span key={t} style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 999,
              border: `1px solid ${themeColor}`,
              color: themeColor,
              fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.12em",
            }}>{t}</span>
          ))}
        </div>
      </div>
      <button onClick={onBook} disabled={sold} className="orb-cta" style={{
        padding: "12px 18px",
        background: sold ? "transparent" : palette.text,
        color: sold ? palette.sub : "#0a0420",
        border: sold ? `1px solid ${palette.border}` : "none",
        borderRadius: 999, cursor: sold ? "default" : "pointer",
        fontWeight: 700, fontSize: 13,
        whiteSpace: "nowrap",
      }}>
        {sold ? "Sold out" : "Записаться"}
      </button>
    </div>
  );
}

function SectionHeader({ palette, kicker, title, subtitle }) {
  return (
    <div style={{ marginBottom: 36, maxWidth: 760 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        letterSpacing: "0.2em", color: palette.accent, textTransform: "uppercase",
        marginBottom: 14,
      }}>{kicker}</div>
      <h2 style={{
        fontFamily: "'Unbounded', sans-serif", fontWeight: 900,
        fontSize: 56, lineHeight: 0.98, letterSpacing: "-0.03em",
        margin: "0 0 14px",
      }}>{title}</h2>
      {subtitle && <p style={{ color: palette.sub, fontSize: 17, lineHeight: 1.5, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function OrbitalRules({ palette }) {
  return (
    <section style={{ padding: "60px 56px 100px", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
      <SectionHeader palette={palette} kicker="// flight plan" title="Как проходит квиз" subtitle="Один час игры, один час бара. Технология полёта простая." />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
      }}>
        {window.SQ_RULES.map((r, i) => (
          <div key={r.n} className="orb-card" style={{
            padding: 24,
            border: `1px solid ${palette.border}`,
            background: palette.surface,
            borderRadius: 22, minHeight: 220,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30, width: 120, height: 120,
              borderRadius: 999,
              background: `radial-gradient(circle, ${palette.accent}22, transparent 70%)`,
            }} />
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              letterSpacing: "0.2em", color: palette.accent,
            }}>{r.n}</div>
            <div>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>
                {r.t}
              </div>
              <div style={{ fontSize: 14, color: palette.sub, lineHeight: 1.5 }}>{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OrbitalContacts({ palette }) {
  return (
    <section style={{ padding: "0 56px 100px", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
      <div style={{
        position: "relative",
        padding: "60px 56px",
        borderRadius: 32,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${palette.accent}33, ${palette.accent2}33)`,
        border: `1px solid ${palette.border}`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 80% 50%, transparent 0%, #0a0420 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <SectionHeader palette={palette} kicker="// сигналы" title="Свяжись с базой" />
            <p style={{ color: palette.sub, fontSize: 16, maxWidth: 460, lineHeight: 1.55 }}>
              Закрытый чат для постоянных экипажей, корпоративные квизы под ключ, дни рождения с собственными раундами — пишите.
            </p>
          </div>
          <div style={{ display: "grid", gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>
            {[
              ["telegram", window.SQ_CONTACTS.tg],
              ["instagram", window.SQ_CONTACTS.ig],
              ["vk", window.SQ_CONTACTS.vk],
              ["mail", window.SQ_CONTACTS.mail],
              ["phone", window.SQ_CONTACTS.phone],
            ].map(([k, v]) => (
              <a key={k} href="#" className="orb-link" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 18px",
                border: `1px solid ${palette.border}`,
                background: palette.surface,
                borderRadius: 14,
              }}>
                <span style={{ color: palette.sub, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 11 }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitalFooter({ palette }) {
  return (
    <footer style={{
      padding: "30px 56px",
      borderTop: `1px solid ${palette.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: palette.sub,
      position: "relative", zIndex: 2,
    }}>
      <span>© 2026 STARQUIZ — все звёзды на местах.</span>
      <span>v.07.05.2026 // BUILD 042</span>
    </footer>
  );
}

window.OrbitalLanding = OrbitalLanding;
