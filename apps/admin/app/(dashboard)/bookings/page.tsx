"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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

const STATUS_STYLES = {
  pending:   "bg-white/[0.06] text-white/50",
  confirmed: "bg-[#00e5ff]/10 text-[#00e5ff]",
  cancelled: "bg-[#ff5570]/10 text-[#ff5570]",
};

const STATUS_LABELS = { pending: "ожидание", confirmed: "подтверждено", cancelled: "отменено" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Record<number, Event>>({});
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPeople, setEditPeople] = useState(1);
  const [filterEvent, setFilterEvent] = useState<string>("all");

  async function load() {
    setLoading(true);
    const [bRes, eRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/events")]);
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
  const filtered = filterEvent !== "all"
    ? bookings.filter(b => b.eventId === Number(filterEvent))
    : bookings;

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  }

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h1 className="m-0 font-mono text-[22px]">// bookings</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-white/40 font-mono">всего: {filtered.length}</span>
          {eventIds.length > 1 && (
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="все мероприятия" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">все мероприятия</SelectItem>
                {eventIds.map(id => (
                  <SelectItem key={id} value={String(id)}>
                    {events[id]?.title ?? `#${id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-white/40 font-mono">загрузка...</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/40 font-mono">// броней пока нет</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(b => {
            const ev = events[b.eventId];
            return (
              <div key={b.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {ev && (
                      <div className="text-[11px] font-mono text-[#00e5ff] mb-1.5">
                        {ev.title} · {formatDate(ev.date)}, {ev.time}
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                      <span className="font-semibold text-[15px]">{b.name}</span>
                      <span className="text-[13px] text-white/50">«{b.teamName}»</span>
                      <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-mono", STATUS_STYLES[b.status])}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    <div className="text-[13px] text-white/50 flex gap-3.5 flex-wrap">
                      {editId === b.id ? (
                        <span className="flex items-center gap-1.5">
                          <span>👥</span>
                          <input
                            type="number" min={1} max={8}
                            value={editPeople}
                            onChange={e => setEditPeople(Number(e.target.value))}
                            className="w-12 px-1.5 py-0.5 bg-white/[0.08] border border-white/20 rounded-md text-[#f4f2ff] text-[13px] outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleSavePeople(b.id)} className="px-2 py-0.5 bg-[#00e5ff] text-[#0a0420] rounded-md text-xs cursor-pointer border-none">✓</button>
                          <button onClick={() => setEditId(null)} className="px-2 py-0.5 bg-transparent text-white/50 border border-white/[0.12] rounded-md text-xs cursor-pointer">✕</button>
                        </span>
                      ) : (
                        <span
                          onClick={() => { setEditId(b.id); setEditPeople(b.people); }}
                          className="cursor-pointer border-b border-dashed border-white/20 hover:text-white/70 transition-colors"
                          title="Нажми чтобы изменить"
                        >
                          👥 {b.people} чел.
                        </span>
                      )}
                      <span>📞 {b.phone}</span>
                      {b.email && <span>✉ {b.email}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatus(b.id, "confirmed")}
                        className="w-8 h-8 bg-[#00e5ff]/10 text-[#00e5ff] border-none rounded-lg text-sm cursor-pointer hover:bg-[#00e5ff]/20 transition-colors flex items-center justify-center"
                      >✓</button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatus(b.id, "cancelled")}
                        className="w-8 h-8 bg-white/[0.06] text-white/60 border-none rounded-lg text-sm cursor-pointer hover:bg-white/[0.1] transition-colors flex items-center justify-center"
                      >✗</button>
                    )}
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="w-8 h-8 bg-[#ff5570]/10 text-[#ff5570] border-none rounded-lg text-sm cursor-pointer hover:bg-[#ff5570]/20 transition-colors flex items-center justify-center"
                    >🗑</button>
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
