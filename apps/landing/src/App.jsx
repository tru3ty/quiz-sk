import { useState } from "react";
import { SQ_EVENTS } from "./data/events.js";
import OrbitalNoise from "./components/OrbitalNoise.jsx";
import OrbitalNav from "./components/OrbitalNav.jsx";
import OrbitalHero from "./components/OrbitalHero.jsx";
import OrbitalTicker from "./components/OrbitalTicker.jsx";
import OrbitalSchedule from "./components/OrbitalSchedule.jsx";
import OrbitalRules from "./components/OrbitalRules.jsx";
import OrbitalContacts from "./components/OrbitalContacts.jsx";
import OrbitalFooter from "./components/OrbitalFooter.jsx";
import BookingModal from "./components/BookingModal.jsx";

export default function App() {
  const [booking, setBooking] = useState(null);

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
      <OrbitalHero onBook={() => setBooking(SQ_EVENTS.find((e) => e.seats > 0))} />
      <OrbitalTicker />
      <OrbitalSchedule onBook={(ev) => ev && setBooking(ev)} />
      <OrbitalRules />
      <OrbitalContacts />
      <OrbitalFooter />

      {booking && (
        <div className="fixed inset-0 z-[100]">
          <BookingModal event={booking} onClose={() => setBooking(null)} />
        </div>
      )}
    </div>
  );
}
