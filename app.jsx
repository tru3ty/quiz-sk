// App: Orbital landing + booking modal
const { useState: useStateRoot } = React;

const MODAL_PALETTE = {
  accent: "#00E5FF", accent2: "#FF2EC4",
  modalBg: "rgba(8,2,24,0.85)", modalCard: "#140A2A",
  border: "rgba(255,255,255,0.12)", text: "#f4f2ff", sub: "rgba(244,242,255,0.6)",
};

function App() {
  const [booking, setBooking] = useStateRoot(null);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <OrbitalLanding paletteKey="neon" onBook={(ev) => ev && setBooking(ev)} />
      {booking && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <SQBookingModal
            event={booking}
            palette={MODAL_PALETTE}
            variant="orb"
            onClose={() => setBooking(null)}
          />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
