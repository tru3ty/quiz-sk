"use client";

import { useState, useEffect } from "react";
import AddressSuggest from "./AddressSuggest";

interface Template {
  id: number;
  title: string;
  theme: string;
  time: string;
  total: number;
  host: string;
  tags: string[];
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const STATUSES = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликовано" },
  { value: "cancelled", label: "Отменено" },
];

const DAYS_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function getDayName(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return DAYS_RU[d.getDay()];
}

export default function EventForm({ onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [address, setAddress] = useState("");
  const [venueName, setVenueName] = useState("");
  const [fields, setFields] = useState({
    title: "",
    theme: "",
    date: "",
    time: "19:00",
    total: "30",
    host: "",
    tags: "",
    status: "draft" as "draft" | "published" | "cancelled",
  });

  useEffect(() => {
    fetch("/api/templates").then(r => r.json()).then(setTemplates);
  }, []);

  function set(k: keyof typeof fields, v: string) {
    setFields(f => ({ ...f, [k]: v }));
  }

  function applyTemplate(id: string) {
    if (!id) return;
    const t = templates.find(t => t.id === Number(id));
    if (!t) return;
    setFields(f => ({
      ...f,
      title: t.title,
      theme: t.theme,
      time: t.time,
      total: String(t.total),
      host: t.host,
      tags: t.tags.join(", "),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let venueId: number | null = null;
      if (address.trim()) {
        const vRes = await fetch("/api/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: venueName || address, address }),
        });
        venueId = (await vRes.json()).id;
      }

      const dateTs = fields.date ? Math.floor(new Date(fields.date).getTime() / 1000) : 0;
      const day = getDayName(fields.date);

      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fields.title,
          theme: fields.theme,
          date: dateTs,
          day,
          time: fields.time,
          seats: 0,
          total: Number(fields.total),
          venueId,
          host: fields.host,
          tags: fields.tags ? fields.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          status: fields.status,
        }),
      });

      onSaved();
    } catch {
      setError("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  }

  const dayHint = getDayName(fields.date);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: 32, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontFamily: "monospace", fontSize: 18 }}>// новое мероприятие</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(244,242,255,0.5)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {templates.length > 0 && (
            <Field label="Шаблон">
              <select style={inputStyle} defaultValue="" onChange={e => applyTemplate(e.target.value)}>
                <option value="">— выбрать шаблон —</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </Field>
          )}

          <Field label="Название" required>
            <input style={inputStyle} required value={fields.title} onChange={e => set("title", e.target.value)} placeholder="StarQuiz: Весенний сезон" />
          </Field>

          <Field label="Тема">
            <input style={inputStyle} value={fields.theme} onChange={e => set("theme", e.target.value)} placeholder="Поп-культура, 90-е..." />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={`Дата${dayHint ? ` — ${dayHint}` : ""}`} required>
              <input style={inputStyle} type="date" required value={fields.date} onChange={e => set("date", e.target.value)} />
            </Field>
            <Field label="Время">
              <input style={inputStyle} type="time" value={fields.time} onChange={e => set("time", e.target.value)} />
            </Field>
          </div>

          <Field label="Всего мест" required>
            <input style={inputStyle} type="number" required min={1} value={fields.total} onChange={e => set("total", e.target.value)} />
          </Field>

          <Field label="Адрес площадки">
            <AddressSuggest value={address} onChange={setAddress} placeholder="Начни вводить адрес..." />
          </Field>

          <Field label="Название площадки">
            <input style={inputStyle} value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="Бар Gagarin, Лофт 42..." />
          </Field>

          <Field label="Ведущий">
            <input style={inputStyle} value={fields.host} onChange={e => set("host", e.target.value)} placeholder="Имя ведущего" />
          </Field>

          <Field label="Теги (через запятую)">
            <input style={inputStyle} value={fields.tags} onChange={e => set("tags", e.target.value)} placeholder="квиз, музыка, 90-е" />
          </Field>

          <Field label="Статус">
            <select style={inputStyle} value={fields.status} onChange={e => set("status", e.target.value as typeof fields.status)}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>

          {error && <p style={{ color: "#ff5570", margin: 0, fontSize: 14 }}>{error}</p>}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", color: "rgba(244,242,255,0.7)", flex: 1 }}>
              Отмена
            </button>
            <button type="submit" disabled={loading} style={{ ...btnStyle, flex: 2 }}>
              {loading ? "Сохранение..." : "Создать →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "rgba(244,242,255,0.5)", fontFamily: "monospace" }}>
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, color: "#f4f2ff", fontSize: 14, outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "12px", background: "#00e5ff", color: "#0a0420",
  border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
};
