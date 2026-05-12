"use client";

import { useState, useRef, useEffect } from "react";

interface Suggestion {
  title: { text: string };
  subtitle?: { text: string };
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AddressSuggest({ value, onChange, placeholder = "Адрес" }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    onChange(q);
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
    timer.current = setTimeout(() => fetchSuggestions(q), 300);
  }

  async function fetchSuggestions(q: string) {
    try {
      const res = await fetch(
        `https://suggest-maps.yandex.ru/v1/suggest?apikey=ffce8662-3295-4924-8342-c4aec5f67dee&text=${encodeURIComponent(q)}&lang=ru&results=5&types=geo`
      );
      const data = await res.json();
      setSuggestions(data.results ?? []);
      setOpen(true);
    } catch {
      setSuggestions([]);
    }
  }

  function select(s: Suggestion) {
    const full = s.subtitle ? `${s.title.text}, ${s.subtitle.text}` : s.title.text;
    onChange(full);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        style={inputStyle}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8, margin: 0, padding: "4px 0", listStyle: "none",
          zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {suggestions.map((s, i) => (
            <li key={i} onMouseDown={() => select(s)} style={{
              padding: "10px 14px", cursor: "pointer", fontSize: 14,
              color: "#f4f2ff", transition: "background 0.1s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,229,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontWeight: 500 }}>{s.title.text}</div>
              {s.subtitle && <div style={{ fontSize: 12, color: "rgba(244,242,255,0.5)", marginTop: 2 }}>{s.subtitle.text}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, color: "#f4f2ff", fontSize: 14, outline: "none",
  boxSizing: "border-box",
};
