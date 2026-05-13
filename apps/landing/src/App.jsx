import { useState, useEffect } from "react";
import OrbitalNoise from "./components/OrbitalNoise.jsx";
import OrbitalNav from "./components/OrbitalNav.jsx";
import OrbitalHero from "./components/OrbitalHero.jsx";
import OrbitalTicker from "./components/OrbitalTicker.jsx";
import OrbitalSchedule from "./components/OrbitalSchedule.jsx";
import OrbitalRules from "./components/OrbitalRules.jsx";
import OrbitalContacts from "./components/OrbitalContacts.jsx";
import OrbitalFooter from "./components/OrbitalFooter.jsx";
import BookingModal from "./components/BookingModal.jsx";

const API = "https://quiz-sk-admin-djep.vercel.app";

function normalizeEvent(ev) {
  const d = new Date(ev.date * 1000);
  const DAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  return {
    ...ev,
    date: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear(),
    day: DAYS[d.getDay()],
  };
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/events`)
      .then(r => r.json())
      .then(data => {
        const published = data
          .filter(e => e.status === "published")
          .map(normalizeEvent);
        setEvents(published);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const firstAvailable = events.find(e => e.seats > 0);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 0%, #2b0a52 0%, #0a0420 45%, #050010 100%)",
        color: "#f4f2ff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <OrbitalNoise />
      <OrbitalNav />
      <OrbitalHero onBook={() => firstAvailable && setBooking(firstAvailable)} />
      <OrbitalTicker />
      <OrbitalSchedule events={events} loading={loading} onBook={(ev) => ev && setBooking(ev)} />
      <OrbitalRules />
      <OrbitalContacts />
      <OrbitalFooter />

      {booking && (
        <div className="fixed inset-0 z-[100]">
          <BookingModal event={booking} apiBase={API} onClose={() => setBooking(null)} />
        </div>
      )}
    </div>
  );
}
