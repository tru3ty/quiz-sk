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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-[360px] flex flex-col gap-4">
        <h1 className="font-mono tracking-[0.1em] m-0 text-xl text-[#00e5ff]">STARQUIZ ADMIN</h1>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          className="input"
        />
        {error && <p className="text-[#ff5570] m-0 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Вход..." : "Войти →"}
        </button>
      </form>
    </div>
  );
}
