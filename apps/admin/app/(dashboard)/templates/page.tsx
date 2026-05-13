"use client";

import { useEffect, useState } from "react";

interface Template {
  id: number;
  title: string;
  theme: string;
  total: number;
  tags: string[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fields, setFields] = useState({ title: "", theme: "", total: "30", tags: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/templates");
    setTemplates(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function set(k: keyof typeof fields, v: string) {
    setFields(f => ({ ...f, [k]: v }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fields.title,
        theme: fields.theme,
        total: Number(fields.total),
        tags: fields.tags ? fields.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      }),
    });
    setFields({ title: "", theme: "", total: "30", tags: "" });
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function deleteTemplate(id: number) {
    if (!confirm("Удалить шаблон?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h1 className="m-0 font-mono text-[22px]">// templates</h1>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          {showForm ? "✕ закрыть" : "+ новый шаблон"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-7 flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Название *">
              <input className="input" required value={fields.title} onChange={e => set("title", e.target.value)} placeholder="StarQuiz Classic" />
            </Field>
            <Field label="Тема">
              <input className="input" value={fields.theme} onChange={e => set("theme", e.target.value)} placeholder="Поп-культура..." />
            </Field>
          </div>
          <Field label="Мест">
            <input className="input" type="number" min={1} value={fields.total} onChange={e => set("total", e.target.value)} />
          </Field>
          <Field label="Теги (через запятую)">
            <input className="input" value={fields.tags} onChange={e => set("tags", e.target.value)} placeholder="квиз, музыка" />
          </Field>
          <button type="submit" disabled={saving} className="btn-primary self-end">
            {saving ? "Сохранение..." : "Создать шаблон →"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/40 font-mono">загрузка...</p>
      ) : templates.length === 0 ? (
        <p className="text-white/40 font-mono">// шаблонов пока нет</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {templates.map(t => (
            <div key={t.id} className="card flex items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold text-[15px] mb-1">{t.title}</div>
                <div className="text-[13px] text-white/50 flex gap-3.5 flex-wrap">
                  {t.theme && <span>{t.theme}</span>}
                  <span>{t.total} мест</span>
                  {t.tags.length > 0 && <span>{t.tags.join(", ")}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteTemplate(t.id)}
                className="bg-transparent border border-[#ff5570]/30 text-[#ff5570] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:bg-[#ff5570]/10 transition-colors"
              >
                удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/50 font-mono">{label}</label>
      {children}
    </div>
  );
}
