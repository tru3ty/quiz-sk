"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn.email({ email, password });
    if (error) {
      setError("Неверный email или пароль");
      setLoading(false);
    } else {
      router.push("/events");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontFamily: "monospace", letterSpacing: "0.1em", margin: 0 }}>STARQUIZ ADMIN</h1>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          style={inputStyle}
        />
        {error && <p style={{ color: "#ff5570", margin: 0, fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Вход..." : "Войти →"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  color: "#f4f2ff", fontSize: 15, outline: "none",
};

const btnStyle: React.CSSProperties = {
  padding: "13px", background: "#00e5ff", color: "#0a0420",
  border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer",
};
