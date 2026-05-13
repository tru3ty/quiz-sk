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
      <h1 className="m-0 mb-7 font-mono text-[22px]">// settings</h1>

      <div className="card max-w-[480px]">
        <h2 className="m-0 mb-5 font-mono text-[15px] text-white/70">// уведомления</h2>
        {loading ? (
          <p className="text-white/40 font-mono">загрузка...</p>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50 font-mono">
                email для уведомлений о новых бронях
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary self-start">
              {saved ? "✓ сохранено" : "сохранить →"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
