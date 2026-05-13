"use client";

import { useState, useEffect } from "react";
import AddressSuggest from "./AddressSuggest";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

interface Template {
  id: number;
  title: string;
  theme: string;
  time: string;
  total: number;
  tags: string[];
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const STATUSES = [
  { value: "draft",      label: "Черновик" },
  { value: "published",  label: "Опубликовано" },
  { value: "cancelled",  label: "Отменено" },
];

const DAYS_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function getDayName(dateStr: string): string {
  if (!dateStr) return "";
  return DAYS_RU[new Date(dateStr).getDay()];
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
    const t = templates.find(t => t.id === Number(id));
    if (!t) return;
    setFields(f => ({
      ...f,
      title: t.title,
      theme: t.theme,
      time: t.time,
      total: String(t.total),
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

      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fields.title,
          theme: fields.theme,
          date: fields.date ? Math.floor(new Date(fields.date).getTime() / 1000) : 0,
          day: getDayName(fields.date),
          time: fields.time,
          seats: 0,
          total: Number(fields.total),
          venueId,
          host: "",
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
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-8 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 font-mono text-[18px]">// новое мероприятие</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-white/50 text-xl cursor-pointer hover:text-white/80 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

          {templates.length > 0 && (
            <Field label="Шаблон">
              <Select onValueChange={applyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="— выбрать шаблон —" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field label="Название" required>
            <input className="input" required value={fields.title} onChange={e => set("title", e.target.value)} placeholder="StarQuiz: Весенний сезон" />
          </Field>

          <Field label="Тема">
            <input className="input" value={fields.theme} onChange={e => set("theme", e.target.value)} placeholder="Поп-культура, 90-е..." />
          </Field>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label={`Дата${dayHint ? ` — ${dayHint}` : ""}`} required>
              <DatePicker value={fields.date} onChange={v => set("date", v)} />
            </Field>
            <Field label="Время">
              <TimePicker value={fields.time} onChange={v => set("time", v)} />
            </Field>
          </div>

          <Field label="Всего мест" required>
            <input className="input" type="number" required min={1} value={fields.total} onChange={e => set("total", e.target.value)} />
          </Field>

          <Field label="Адрес площадки">
            <AddressSuggest value={address} onChange={setAddress} placeholder="Начни вводить адрес..." />
          </Field>

          <Field label="Название площадки">
            <input className="input" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="Бар Gagarin, Лофт 42..." />
          </Field>

          <Field label="Теги (через запятую)">
            <input className="input" value={fields.tags} onChange={e => set("tags", e.target.value)} placeholder="квиз, музыка, 90-е" />
          </Field>

          <Field label="Статус">
            <Select value={fields.status} onValueChange={v => set("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {error && <p className="text-[#ff5570] m-0 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/[0.05] text-white/70 border-none rounded-xl font-bold text-sm cursor-pointer hover:bg-white/[0.08] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary disabled:opacity-60"
            >
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/50 font-mono">
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}
