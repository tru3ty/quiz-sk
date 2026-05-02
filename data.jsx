// Shared data + helpers for both concepts
const MONTH_LABEL = "Май 2026";

// quiz events scattered across the month
const SQ_EVENTS = [
  { date: 2,  day: "сб", time: "20:00", title: "Космос с нуля",       theme: "общий",    seats: 12, total: 60, host: "Bar Nebula",     tags: ["новички"] },
  { date: 6,  day: "ср", time: "19:30", title: "Сериалы 00-х",        theme: "поп-культ",seats: 4,  total: 56, host: "Cosmos Pub",     tags: ["хит"] },
  { date: 9,  day: "сб", time: "20:00", title: "Музыкальный буран",   theme: "музыка",   seats: 22, total: 64, host: "Bar Nebula",     tags: [] },
  { date: 13, day: "ср", time: "19:30", title: "Кино и космос",       theme: "кино",     seats: 0,  total: 60, host: "Orbita Bar",     tags: ["sold out"] },
  { date: 16, day: "сб", time: "20:00", title: "Гик-лиха",            theme: "гик",      seats: 18, total: 56, host: "Cosmos Pub",     tags: ["18+"] },
  { date: 20, day: "ср", time: "19:30", title: "Аниме-галактика",     theme: "аниме",    seats: 9,  total: 48, host: "Bar Nebula",     tags: ["новинка"] },
  { date: 23, day: "сб", time: "20:00", title: "Мемы и интернет",     theme: "интернет", seats: 31, total: 64, host: "Orbita Bar",     tags: [] },
  { date: 27, day: "ср", time: "19:30", title: "История СССР",        theme: "история",  seats: 14, total: 60, host: "Cosmos Pub",     tags: ["вечер вопросов"] },
  { date: 30, day: "сб", time: "20:00", title: "Финал сезона",        theme: "микс",     seats: 6,  total: 80, host: "Bar Nebula",     tags: ["финал","18+"] },
];

// Build a 6×7 month grid for May 2026 (1 May = Friday)
function buildMonthGrid() {
  const firstDow = 4; // 0=Mon..6=Sun, May 1, 2026 is Friday
  const daysInMonth = 31;
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const ev = SQ_EVENTS.find(e => e.date === d);
    cells.push({ day: d, ev });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return cells;
}

const SQ_RULES = [
  { n: "01", t: "Собирай экипаж", d: "Команда от 2 до 8 человек. Можно прийти одному — пристыкуем к другим." },
  { n: "02", t: "7 раундов",      d: "Логика, музыка, картинки, блиц. От разогрева до чёрной дыры финала." },
  { n: "03", t: "Без интернета",  d: "Телефоны кладём на стол экраном вниз. Ловим только сигналы из пространства." },
  { n: "04", t: "Победа",         d: "Бар, мерч и место в залe славы. Ничья решается дуэлью на скорость." },
];

const SQ_CONTACTS = {
  tg: "@starquiz",
  ig: "@starquiz.bar",
  vk: "vk.com/starquiz",
  mail: "hi@starquiz.space",
  phone: "+7 (999) 042-12-08",
};

window.SQ_EVENTS = SQ_EVENTS;
window.SQ_RULES = SQ_RULES;
window.SQ_CONTACTS = SQ_CONTACTS;
window.SQ_MONTH = MONTH_LABEL;
window.SQ_buildMonthGrid = buildMonthGrid;
