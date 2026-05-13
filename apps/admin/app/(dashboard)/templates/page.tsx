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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontFamily: "monospace", fontSize: 22 }}>// templates</h1>
        <button onClick={() => setShowForm(v => !v)} style={btnStyle}>
          {showForm ? "✕ закрыть" : "+ новый шаблон"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: 24, marginBottom: 28,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Название *">
              <input style={inputStyle} required value={fields.title} onChange={e => set("title", e.target.value)} placeholder="StarQuiz Classic" />
            </Field>
            <Field label="Тема">
              <input style={inputStyle} value={fields.theme} onChange={e => set("theme", e.target.value)} placeholder="Поп-культура..." />
            </Field>
          </div>
          <Field label="Мест">
            <input style={inputStyle} type="number" min={1} value={fields.total} onChange={e => set("total", e.target.value)} />
          </Field>
          <Field label="Теги (через запятую)">
            <input style={inputStyle} value={fields.tags} onChange={e => set("tags", e.target.value)} placeholder="квиз, музыка" />
          </Field>
          <button type="submit" disabled={saving} style={{ ...btnStyle, alignSelf: "flex-end" }}>
            {saving ? "Сохранение..." : "Создать шаблон →"}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>загрузка...</p>
      ) : templates.length === 0 ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>// шаблонов пока нет</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {templates.map(t => (
            <div key={t.id} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "rgba(244,242,255,0.5)", display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {t.theme && <span>{t.theme}</span>}
                  <span>{t.total} мест</span>
                  {t.tags.length > 0 && <span>{t.tags.join(", ")}</span>}
                </div>
              </div>
              <button onClick={() => deleteTemplate(t.id)} style={{
                background: "none", border: "1px solid rgba(255,85,112,0.3)", color: "#ff5570",
                borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer",
              }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "rgba(244,242,255,0.5)", fontFamily: "monospace" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, color: "#f4f2ff", fontSize: 14, outline: "none", boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 18px", background: "#00e5ff", color: "#0a0420",
  border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
  fontFamily: "monospace",
};
