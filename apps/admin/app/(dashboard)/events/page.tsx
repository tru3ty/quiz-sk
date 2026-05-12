"use client";

import { useEffect, useState } from "react";
import EventForm from "@/components/EventForm";

interface Event {
  id: number;
  title: string;
  theme: string;
  date: number;
  day: string;
  time: string;
  seats: number;
  total: number;
  host: string;
  tags: string[];
  status: "draft" | "published" | "cancelled";
}

const STATUS_COLORS = {
  draft: { bg: "rgba(255,255,255,0.06)", color: "rgba(244,242,255,0.5)" },
  published: { bg: "rgba(0,229,255,0.1)", color: "#00e5ff" },
  cancelled: { bg: "rgba(255,85,112,0.1)", color: "#ff5570" },
};

const STATUS_LABELS = { draft: "черновик", published: "опубликовано", cancelled: "отменено" };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteEvent(id: number) {
    if (!confirm("Удалить мероприятие?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontFamily: "monospace", fontSize: 22 }}>// events</h1>
        <button onClick={() => setShowForm(true)} style={btnStyle}>
          + новое мероприятие
        </button>
      </div>

      {loading ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>загрузка...</p>
      ) : events.length === 0 ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>// мероприятий пока нет</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map(ev => (
            <div key={ev.id} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</span>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 20, fontFamily: "monospace",
                    ...STATUS_COLORS[ev.status],
                  }}>
                    {STATUS_LABELS[ev.status]}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(244,242,255,0.5)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {ev.theme && <span>{ev.theme}</span>}
                  <span>{ev.day}, {ev.time}</span>
                  <span>{ev.seats}/{ev.total} мест</span>
                  {ev.host && <span>ведущий: {ev.host}</span>}
                </div>
              </div>
              <button onClick={() => deleteEvent(ev.id)} style={{
                background: "none", border: "1px solid rgba(255,85,112,0.3)", color: "#ff5570",
                borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer",
              }}>
                удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EventForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "10px 18px", background: "#00e5ff", color: "#0a0420",
  border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
  fontFamily: "monospace",
};
