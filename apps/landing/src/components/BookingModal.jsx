import { useState, useEffect } from "react";
import { peopleWord } from "../data/events.js";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex justify-between items-baseline text-[11px] tracking-[0.16em] uppercase font-jbmono mb-2 text-[rgba(255,255,255,0.55)]">
        <span>{label}</span>
        {hint && <span className="normal-case tracking-normal text-[11px] opacity-70">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export default function BookingModal({ event, onClose, apiBase }) {
  const [name, setName]     = useState("");
  const [team, setTeam]     = useState("");
  const [people, setPeople] = useState(4);
  const [phone, setPhone]   = useState("");
  const [email, setEmail]   = useState("");
  const [done, setDone]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!event) return null;

  const fullSold = event.seats === 0;

  const inputCls =
    "w-full px-3.5 py-3 bg-[rgba(255,255,255,0.04)] border border-(--color-orb-border) rounded-xl text-(--color-orb-text) text-[15px] font-inter transition-[border-color,box-shadow] duration-120 placeholder-[rgba(244,242,255,0.4)] focus:outline-none focus:border-(--color-orb-accent) focus:shadow-[0_0_0_3px_rgba(0,229,255,0.2)]";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          name,
          teamName: team,
          people,
          phone,
          email,
          status: "pending",
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Ошибка при отправке. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const dateStr = `${String(event.date).padStart(2, "0")}.${String((event.month ?? 4) + 1).padStart(2, "0")}`;

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(8,2,24,0.8)",
        backdropFilter: "blur(8px)",
        animation: "sqFadeIn 220ms ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[min(560px,92%)] border border-(--color-orb-border) rounded-3xl p-6 sm:p-8 text-(--color-orb-text)"
        style={{
          background: "rgba(20,10,42,0.95)",
          animation: "sqRise 280ms cubic-bezier(.2,.8,.2,1)",
          boxShadow: "0 30px 80px rgba(0,229,255,0.13), inset 0 0 0 1px rgba(0,229,255,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3.5 right-3.5 w-9 h-9 bg-transparent border border-(--color-orb-border) rounded-full text-(--color-orb-text) cursor-pointer text-base leading-none"
        >
          ×
        </button>

        {!done ? (
          <>
            <div className="font-jbmono text-[11px] tracking-[0.2em] text-(--color-orb-accent) uppercase">
              Запись на квиз
            </div>
            <h2 className="font-unbounded text-[26px] sm:text-[30px] leading-tight mt-2.5 mb-1 font-bold tracking-tight">
              {event.title}
            </h2>
            <div className="text-(--color-orb-sub) text-sm mb-5 font-jbmono">
              {dateStr} · {event.day} · {event.time}
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3.5">
              <Field label="Капитан экипажа" hint="как тебя представить">
                <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Юра Гагарин" />
              </Field>
              <Field label="Название команды" hint="придумай — будем выкрикивать">
                <input className={inputCls} required value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Чёрные дыры" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Сколько вас" hint="2–8 человек">
                  <div className="flex gap-1.5 flex-wrap">
                    {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPeople(n)}
                        className="w-[38px] h-[38px] rounded-xl border font-semibold cursor-pointer font-jbmono transition-all duration-120"
                        style={{
                          border: `1px solid ${people === n ? "#00e5ff" : "rgba(255,255,255,0.12)"}`,
                          background: people === n ? "#00e5ff" : "transparent",
                          color: people === n ? "#0a0420" : "#f4f2ff",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Телефон" hint="чтобы предупредить">
                  <input className={inputCls} required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 ___ ___ __ __" />
                </Field>
              </div>
              <Field label="Email" hint="для подтверждения">
                <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </Field>

              <div className="flex justify-between items-center mt-1.5 pt-3.5 border-t border-dashed border-(--color-orb-border) font-jbmono text-xs text-(--color-orb-sub)">
                <span>{fullSold ? "ЛИСТ ОЖИДАНИЯ" : `Свободно ${event.seats} из ${event.total}`}</span>
                <span>
                  {people} × 800 ₽ = <span className="text-(--color-orb-text)">{people * 800} ₽</span>
                </span>
              </div>

              {error && <p style={{ color: "#ff5570", fontSize: 13, margin: 0 }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-1.5 py-4 border-0 rounded-full font-bold text-[15px] cursor-pointer tracking-[0.02em] disabled:opacity-60"
                style={{
                  background: "linear-gradient(90deg, #00e5ff, #ff2ec4)",
                  color: "#0a0420",
                  boxShadow: "0 12px 30px rgba(0,229,255,0.33)",
                }}
              >
                {loading ? "Отправка..." : fullSold ? "Встать в лист ожидания" : "Зарезервировать столик →"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-2.5 text-center">
            <div
              className="w-[78px] h-[78px] mx-auto mb-4 rounded-full border border-(--color-orb-accent) flex items-center justify-center"
              style={{ background: "radial-gradient(circle, #00e5ff 0%, rgba(0,229,255,0) 70%)" }}
            >
              <span
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-jbmono text-[28px]"
                style={{ background: "#00e5ff", color: "#0a0420" }}
              >
                ✓
              </span>
            </div>
            <div className="font-jbmono text-[11px] tracking-[0.2em] text-(--color-orb-accent) uppercase mb-1.5">
              СИГНАЛ ПРИНЯТ
            </div>
            <h2 className="font-unbounded text-[26px] m-0 mb-2 font-bold">
              Места забронированы
            </h2>
            <p className="text-(--color-orb-sub) text-sm mx-auto max-w-[360px]">
              Команда <b className="text-(--color-orb-text)">«{team || "Без названия"}»</b> · {people} {peopleWord(people)} · {dateStr} в {event.time}.
              Подтверждение отправлено на {email}.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-3 bg-transparent text-(--color-orb-text) border border-(--color-orb-border) rounded-full cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
