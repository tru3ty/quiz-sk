import { SQ_CONTACTS } from "../data/events.js";
import SectionHeader from "./SectionHeader.jsx";

const LINKS = [
  ["telegram", SQ_CONTACTS.tg],
  ["instagram", SQ_CONTACTS.ig],
  ["vk",        SQ_CONTACTS.vk],
  ["mail",      SQ_CONTACTS.mail],
  ["phone",     SQ_CONTACTS.phone],
];

export default function OrbitalContacts() {
  return (
    <section className="px-6 sm:px-10 lg:px-14 pb-20 sm:pb-24 max-w-[1280px] mx-auto relative z-[2]">
      <div
        className="relative p-8 sm:p-14 rounded-[32px] overflow-hidden border border-(--color-orb-border)"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(255,46,196,0.2))",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 50%, transparent 0%, #0a0420 70%)" }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <SectionHeader kicker="// сигналы" title="Свяжись с базой" />
            <p className="text-(--color-orb-sub) text-sm sm:text-base max-w-[460px] leading-relaxed">
              Закрытый чат для постоянных экипажей, корпоративные квизы под ключ,
              дни рождения с собственными раундами — пишите.
            </p>
          </div>

          <div className="grid gap-2.5 font-jbmono text-sm">
            {LINKS.map(([k, v]) => (
              <a
                key={k}
                href="#"
                className="flex justify-between items-center px-4 py-3.5 border border-(--color-orb-border) bg-(--color-orb-surface) rounded-[14px] no-underline transition-colors duration-150 hover:text-(--color-orb-accent)"
              >
                <span className="text-(--color-orb-sub) uppercase tracking-[0.16em] text-[11px]">{k}</span>
                <span className="font-semibold text-(--color-orb-text)">{v}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
