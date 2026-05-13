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
    onChange(s.subtitle ? `${s.title.text}, ${s.subtitle.text}` : s.title.text);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="input"
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#1a1a2e] border border-white/[0.12] rounded-lg m-0 p-1 list-none z-[100] shadow-xl">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => select(s)}
              className="px-3.5 py-2.5 cursor-pointer rounded-md text-sm text-[#f4f2ff] hover:bg-[#00e5ff]/[0.08] transition-colors"
            >
              <div className="font-medium">{s.title.text}</div>
              {s.subtitle && (
                <div className="text-xs text-white/50 mt-0.5">{s.subtitle.text}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
