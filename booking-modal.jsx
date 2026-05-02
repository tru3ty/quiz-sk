// Booking modal — used by both concepts
const { useState, useEffect } = React;

function BookingModal({ event, palette, variant, onClose }) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [people, setPeople] = useState(4);
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!event) return null;

  const accent  = palette?.accent  || "#00E5FF";
  const accent2 = palette?.accent2 || "#FF2EC4";
  const bg      = palette?.modalBg || "rgba(10, 5, 25, 0.92)";
  const card    = palette?.modalCard || "rgba(20, 12, 42, 0.95)";
  const border  = palette?.border || "rgba(255,255,255,0.12)";
  const text    = palette?.text || "#f2f2ff";
  const sub     = palette?.sub || "rgba(255,255,255,0.6)";
  const fontDisplay = variant === "mc" ? "'JetBrains Mono', monospace" : "'Unbounded', 'Space Grotesk', sans-serif";

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  const fullSold = event.seats === 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0,
        background: bg,
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50,
        animation: "sqFadeIn 220ms ease-out",
      }}
    >
      <style>{`
        @keyframes sqFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sqRise { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .sq-input::placeholder { color: ${sub}; }
        .sq-input:focus { outline: none; border-color: ${accent}; box-shadow: 0 0 0 3px ${accent}33; }
        .sq-pill { transition: transform 120ms ease, background 120ms ease, color 120ms ease; }
        .sq-pill:hover { transform: translateY(-1px); }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 92%)",
          background: card,
          border: `1px solid ${border}`,
          borderRadius: variant === "mc" ? 4 : 24,
          padding: 32,
          color: text,
          position: "relative",
          animation: "sqRise 280ms cubic-bezier(.2,.8,.2,1)",
          boxShadow: `0 30px 80px ${accent}22, 0 0 0 1px ${accent}33 inset`,
        }}
      >
        {/* close */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 36, height: 36,
            background: "transparent",
            border: `1px solid ${border}`,
            borderRadius: variant === "mc" ? 4 : 999,
            color: text, cursor: "pointer", fontSize: 16, lineHeight: 1,
          }}
        >×</button>

        {!done ? (
          <>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: accent, textTransform: "uppercase" }}>
              {variant === "mc" ? "[ MISSION-BRIEFING ]" : "Запись на квиз"}
            </div>
            <h2 style={{
              fontFamily: fontDisplay,
              fontSize: 30, lineHeight: 1.05, margin: "10px 0 4px",
              fontWeight: 700, letterSpacing: variant === "mc" ? "0.02em" : "-0.01em",
            }}>
              {event.title}
            </h2>
            <div style={{ color: sub, fontSize: 14, marginBottom: 22, fontFamily: "'JetBrains Mono', monospace" }}>
              {String(event.date).padStart(2,"0")}.05 · {event.day} · {event.time} · {event.host}
            </div>

            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <Field label="Капитан экипажа" hint="как тебя представить">
                <input className="sq-input" required value={name} onChange={e=>setName(e.target.value)}
                  placeholder="Юра Гагарин"
                  style={inputStyle(border, text, variant)} />
              </Field>
              <Field label="Название команды" hint="придумай — будем выкрикивать на награждении">
                <input className="sq-input" required value={team} onChange={e=>setTeam(e.target.value)}
                  placeholder="Чёрные дыры"
                  style={inputStyle(border, text, variant)} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Сколько вас" hint="2–8 человек">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[2,3,4,5,6,7,8].map(n => (
                      <button key={n} type="button" onClick={()=>setPeople(n)}
                        className="sq-pill"
                        style={{
                          width: 38, height: 38, borderRadius: variant === "mc" ? 4 : 12,
                          border: `1px solid ${people === n ? accent : border}`,
                          background: people === n ? accent : "transparent",
                          color: people === n ? "#0a0420" : text,
                          fontWeight: 600, cursor: "pointer",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>{n}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Телефон" hint="чтобы предупредить, если что">
                  <input className="sq-input" required value={phone} onChange={e=>setPhone(e.target.value)}
                    placeholder="+7 ___ ___ __ __"
                    style={inputStyle(border, text, variant)} />
                </Field>
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginTop: 6, paddingTop: 14, borderTop: `1px dashed ${border}`,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: sub,
              }}>
                <span>{fullSold ? "ЛИСТ ОЖИДАНИЯ" : `Свободно ${event.seats} из ${event.total}`}</span>
                <span>{people} × 800 ₽ = <span style={{ color: text }}>{people * 800} ₽</span></span>
              </div>

              <button type="submit" style={{
                marginTop: 6,
                padding: "16px 22px",
                border: "none",
                borderRadius: variant === "mc" ? 4 : 999,
                background: variant === "mc"
                  ? accent
                  : `linear-gradient(90deg, ${accent}, ${accent2})`,
                color: "#0a0420",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: variant === "mc" ? "0.16em" : "0.02em",
                textTransform: variant === "mc" ? "uppercase" : "none",
                cursor: "pointer",
                fontFamily: variant === "mc" ? "'JetBrains Mono', monospace" : "inherit",
                boxShadow: `0 12px 30px ${accent}55`,
              }}>
                {fullSold ? "Встать в лист ожидания" : "Зарезервировать столик →"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: "10px 0", textAlign: "center" }}>
            <div style={{
              width: 78, height: 78, margin: "0 auto 18px",
              borderRadius: 999,
              background: `radial-gradient(circle, ${accent} 0%, ${accent}00 70%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${accent}`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 28, color: "#0a0420",
            }}>
              <span style={{ background: accent, width: 38, height: 38, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: accent, textTransform: "uppercase", marginBottom: 6 }}>
              СИГНАЛ ПРИНЯТ
            </div>
            <h2 style={{ fontFamily: fontDisplay, fontSize: 26, margin: "0 0 8px", fontWeight: 700 }}>
              Места забронированы
            </h2>
            <p style={{ color: sub, fontSize: 14, margin: "0 auto", maxWidth: 360 }}>
              Команда <b style={{ color: text }}>«{team || "Без названия"}»</b> · {people} {peopleWord(people)} · {String(event.date).padStart(2,"0")}.05 в {event.time}.
              Подтверждение прилетит в Telegram через минуту.
            </p>
            <button onClick={onClose} style={{
              marginTop: 22, padding: "12px 22px",
              background: "transparent", color: text,
              border: `1px solid ${border}`,
              borderRadius: variant === "mc" ? 4 : 999, cursor: "pointer",
              fontFamily: "inherit",
            }}>Закрыть</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 8, color: "rgba(255,255,255,0.55)",
      }}>
        <span>{label}</span>
        {hint && <span style={{ textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.7 }}>{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function inputStyle(border, text, variant) {
  return {
    width: "100%",
    padding: "13px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${border}`,
    borderRadius: variant === "mc" ? 4 : 12,
    color: text,
    fontSize: 15,
    fontFamily: "inherit",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  };
}

function peopleWord(n) {
  if (n === 1) return "человек";
  if (n >= 2 && n <= 4) return "человека";
  return "человек";
}

window.SQBookingModal = BookingModal;
window.SQpeopleWord = peopleWord;
