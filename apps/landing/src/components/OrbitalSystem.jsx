const RINGS = [
  { size: 100, dur: "60s",  dir: "orbSpin",  color: "#00e5ff" },
  { size: 78,  dur: "45s",  dir: "orbSpinR", color: "#ff2ec4" },
  { size: 58,  dur: "30s",  dir: "orbSpin",  color: "#b388ff" },
];

export default function OrbitalSystem() {
  return (
    <div className="relative w-full aspect-square max-w-[540px] mx-auto">
      {RINGS.map((r, i) => {
        const inset = `${(100 - r.size) / 2}%`;
        return (
          <div
            key={i}
            className="absolute rounded-full border border-dashed border-(--color-orb-border)"
            style={{
              inset,
              animation: `${r.dir} ${r.dur} linear infinite`,
            }}
          >
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{
                background: r.color,
                boxShadow: `0 0 16px ${r.color}`,
              }}
            />
          </div>
        );
      })}

      {/* center planet */}
      <div
        className="absolute inset-[30%] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #00e5ff 0%, #ff2ec4 40%, #2a0857 70%, #0a0420 100%)",
          boxShadow:
            "inset -20px -20px 60px rgba(0,0,0,0.6), inset 20px 20px 40px rgba(0,229,255,0.2), 0 0 80px rgba(255,46,196,0.33)",
          animation: "orbFloat 6s ease-in-out infinite",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{ filter: "url(#orbNoise)", mixBlendMode: "overlay" }}
        />
      </div>

      {/* HUD text ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0"
        style={{ animation: "orbSpin 120s linear infinite" }}
      >
        <defs>
          <path id="orbHudPath" d="M 50 50 m -45 0 a 45 45 0 1 1 90 0 a 45 45 0 1 1 -90 0" fill="none" />
        </defs>
        <text fill="rgba(244,242,255,0.6)" fontSize="2.6" fontFamily="JetBrains Mono">
          <textPath href="#orbHudPath">
            STARQUIZ · MAY · 09 · SAT · 20:00 · BAR NEBULA · TEAMS 2-8 · 7 ROUNDS · NO INTERNET · SIGNAL ACQUIRED ·
          </textPath>
        </text>
      </svg>

      {/* LIVE chip */}
      <div
        className="absolute -bottom-2.5 right-0 px-4 py-2.5 border border-(--color-orb-accent) rounded-full font-jbmono text-xs text-(--color-orb-text)"
        style={{
          background: "rgba(255,255,255,0.07)",
          boxShadow: "0 0 30px rgba(0,229,255,0.2)",
        }}
      >
        <span className="text-(--color-orb-accent)">● LIVE</span>&nbsp;&nbsp;next quiz · сб 20:00
      </div>
    </div>
  );
}
