"use client";

import { useEffect, useState } from "react";
import EventForm from "@/components/EventForm";
import { cn } from "@/lib/utils";

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

const STATUS_STYLES = {
  draft:     "bg-white/[0.06] text-white/50",
  published: "bg-[#00e5ff]/10 text-[#00e5ff]",
  cancelled: "bg-[#ff5570]/10 text-[#ff5570]",
};

const STATUS_LABELS = { draft: "черновик", published: "опубликовано", cancelled: "отменено" };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/events");
    setEvents(await res.json());
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
      <div className="flex justify-between items-center mb-7">
        <h1 className="m-0 font-mono text-[22px]">// events</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + новое мероприятие
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 font-mono">загрузка...</p>
      ) : events.length === 0 ? (
        <p className="text-white/40 font-mono">// мероприятий пока нет</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map(ev => (
            <div key={ev.id} className="card flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-semibold text-[15px]">{ev.title}</span>
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-mono", STATUS_STYLES[ev.status])}>
                    {STATUS_LABELS[ev.status]}
                  </span>
                </div>
                <div className="text-[13px] text-white/50 flex gap-4 flex-wrap">
                  {ev.theme && <span>{ev.theme}</span>}
                  <span>{ev.day}, {ev.time}</span>
                  <span>{ev.seats}/{ev.total} мест</span>
                  {ev.host && <span>ведущий: {ev.host}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteEvent(ev.id)}
                className="bg-transparent border border-[#ff5570]/30 text-[#ff5570] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:bg-[#ff5570]/10 transition-colors"
              >
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
