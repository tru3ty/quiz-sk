"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then(r => r.json())
      .then(data => {
        setAdminEmail(data.admin_notify_email ?? "");
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notify_email: adminEmail }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <h1 style={{ margin: "0 0 28px", fontFamily: "monospace", fontSize: 22 }}>// settings</h1>

      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: 24, maxWidth: 480,
      }}>
        <h2 style={{ margin: "0 0 20px", fontFamily: "monospace", fontSize: 15, color: "rgba(244,242,255,0.7)" }}>
          // уведомления
        </h2>
        {loading ? (
          <p style={{ color: "rgba(244,242,255,0.4)", fontFamily: "monospace" }}>загрузка...</p>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "rgba(244,242,255,0.5)", fontFamily: "monospace" }}>
                email для уведомлений о новых бронях
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                style={inputStyle}
              />
            </div>
            <button type="submit" style={btnStyle}>
              {saved ? "✓ сохранено" : "сохранить →"}
            </button>
          </form>
        )}
      </div>
    </>
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
  fontFamily: "monospace", alignSelf: "flex-start",
};
