"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: number;
  eventId: number;
  name: string;
  teamName: string;
  people: number;
  phone: string;
  email: string | null;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  date: number;
  time: string;
}

const STATUS_COLORS = {
  pending:   { bg: "rgba(255,255,255,0.06)", color: "rgba(244,242,255,0.5)" },
  confirmed: { bg: "rgba(0,229,255,0.1)",    color: "#00e5ff" },
  cancelled: { bg: "rgba(255,85,112,0.1)",   color: "#ff5570" },
};

const STATUS_LABELS = { pending: "ожидание", confirmed: "подтверждено", cancelled: "отменено" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Record<number, Event>>({});
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPeople, setEditPeople] = useState(1);
  const [filterEvent, setFilterEvent] = useState<number | "">("");

  async function load() {
    setLoading(true);
    const [bRes, eRes] = await Promise.all([
      fetch("/api/bookings"),
      fetch("/api/events"),
    ]);
    const bData: Booking[] = await bRes.json();
    const eData: Event[] = await eRes.json();
    setBookings(bData);
    setEvents(Object.fromEntries(eData.map(e => [e.id, e])));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Удалить бронь?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    load();
  }

  async function handleSavePeople(id: number) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ people: editPeople }),
    });
    setEditId(null);
    load();
  }

  async function handleStatus(id: number, status: Booking["status"]) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const eventIds = [...new Set(bookings.map(b => b.eventId))];
  const filtered = filterEvent ? bookings.filter(b => b.eventId === Number(filterEvent)) : bookings;

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontFamily: "monospace", fontSize: 22 }}>// bookings</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>
            всего: {filtered.length}
          </span>
          {eventIds.length > 1 && (
            <select
              value={filterEvent}
              onChange={e => setFilterEvent(e.target.value === "" ? "" : Number(e.target.value))}
              style={selectStyle}
            >
              <option value="">все мероприятия</option>
              {eventIds.map(id => (
                <option key={id} value={id}>
                  {events[id]?.title ?? `#${id}`}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>загрузка...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>// броней пока нет</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(b => {
            const ev = events[b.eventId];
            return (
              <div key={b.id} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Мероприятие */}
                    {ev && (
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: "#00e5ff", marginBottom: 6 }}>
                        {ev.title} · {formatDate(ev.date)}, {ev.time}
                      </div>
                    )}
                    {/* Основная инфа */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{b.name}</span>
                      <span style={{ fontSize: 13, color: "rgba(244,242,255,0.5)" }}>«{b.teamName}»</span>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 20, fontFamily: "monospace",
                        ...STATUS_COLORS[b.status],
                      }}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    {/* Детали */}
                    <div style={{ fontSize: 13, color: "rgba(244,242,255,0.5)", display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {/* Редактирование кол-ва */}
                      {editId === b.id ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>👥</span>
                          <input
                            type="number" min={1} max={8}
                            value={editPeople}
                            onChange={e => setEditPeople(Number(e.target.value))}
                            style={{ width: 48, ...inlineInputStyle }}
                            autoFocus
                          />
                          <button onClick={() => handleSavePeople(b.id)} style={inlineBtnStyle("#00e5ff", "#0a0420")}>✓</button>
                          <button onClick={() => setEditId(null)} style={inlineBtnStyle("transparent", "rgba(244,242,255,0.5)", "1px solid rgba(255,255,255,0.12)")}>✕</button>
                        </span>
                      ) : (
                        <span
                          onClick={() => { setEditId(b.id); setEditPeople(b.people); }}
                          style={{ cursor: "pointer", borderBottom: "1px dashed rgba(255,255,255,0.2)" }}
                          title="Нажми чтобы изменить"
                        >
                          👥 {b.people} чел.
                        </span>
                      )}
                      <span>📞 {b.phone}</span>
                      {b.email && <span>✉ {b.email}</span>}
                    </div>
                  </div>

                  {/* Действия */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {b.status !== "confirmed" && (
                      <button onClick={() => handleStatus(b.id, "confirmed")} style={actionBtn("#00e5ff")}>
                        ✓
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button onClick={() => handleStatus(b.id, "cancelled")} style={actionBtn("rgba(255,255,255,0.15)")}>
                        ✗
                      </button>
                    )}
                    <button onClick={() => handleDelete(b.id)} style={actionBtn("rgba(255,85,112,0.15)", "#ff5570")}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "8px 12px", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
  color: "#f4f2ff", fontSize: 13, outline: "none", cursor: "pointer",
};

const inlineInputStyle: React.CSSProperties = {
  padding: "2px 6px", background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
  color: "#f4f2ff", fontSize: 13, outline: "none",
};

function inlineBtnStyle(bg: string, color = "#f4f2ff", border = "none"): React.CSSProperties {
  return { padding: "2px 8px", background: bg, color, border, borderRadius: 6, fontSize: 12, cursor: "pointer" };
}

function actionBtn(bg: string, color = "#f4f2ff"): React.CSSProperties {
  return {
    width: 32, height: 32, background: bg, color, border: "none",
    borderRadius: 8, fontSize: 14, cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
  };
}
