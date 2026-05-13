import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";
import { db, events, bookings, venues, eventTemplates, contacts, eq } from "@starquiz/db";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", cors({
  origin: (origin) => origin ?? "*",
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Auth — Better Auth handles all /api/auth/* routes
app.on(["GET", "POST"], "/auth/**", (c) => auth.handler(c.req.raw));

// Events
app.get("/events", async (c) => {
  const rows = await db.select().from(events).orderBy(events.date);
  return c.json(rows);
});

app.post("/events", async (c) => {
  const body = await c.req.json();
  const [row] = await db.insert(events).values(body).returning();
  return c.json(row, 201);
});

app.patch("/events/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const [row] = await db.update(events).set(body).where(eq(events.id, id)).returning();
  return c.json(row);
});

app.delete("/events/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await db.delete(events).where(eq(events.id, id));
  return c.json({ ok: true });
});

// Venues
app.get("/venues", async (c) => {
  const rows = await db.select().from(venues);
  return c.json(rows);
});

app.post("/venues", async (c) => {
  const body = await c.req.json();
  const existing = await db.select().from(venues).where(eq(venues.address, body.address));
  if (existing.length > 0) return c.json(existing[0]);
  const [row] = await db.insert(venues).values(body).returning();
  return c.json(row, 201);
});

// Templates
app.get("/templates", async (c) => {
  const rows = await db.select().from(eventTemplates);
  return c.json(rows);
});

app.post("/templates", async (c) => {
  const body = await c.req.json();
  const [row] = await db.insert(eventTemplates).values(body).returning();
  return c.json(row, 201);
});

app.patch("/templates/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const [row] = await db.update(eventTemplates).set(body).where(eq(eventTemplates.id, id)).returning();
  return c.json(row);
});

app.delete("/templates/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await db.delete(eventTemplates).where(eq(eventTemplates.id, id));
  return c.json({ ok: true });
});

// Contacts / settings
app.get("/contacts", async (c) => {
  const rows = await db.select().from(contacts);
  return c.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});

app.post("/contacts", async (c) => {
  const body: Record<string, string> = await c.req.json();
  for (const [key, value] of Object.entries(body)) {
    const existing = await db.select().from(contacts).where(eq(contacts.key, key));
    if (existing.length > 0) {
      await db.update(contacts).set({ value }).where(eq(contacts.key, key));
    } else {
      await db.insert(contacts).values({ key, value });
    }
  }
  return c.json({ ok: true });
});

// Bookings
app.get("/bookings", async (c) => {
  const rows = await db.select().from(bookings).orderBy(bookings.createdAt);
  return c.json(rows);
});

app.post("/bookings", async (c) => {
  const body = await c.req.json();
  const [booking] = await db.insert(bookings).values(body).returning();

  // Триггерим уведомления асинхронно
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
  const event = await db.select().from(events).where(eq(events.id, body.eventId));
  if (event[0] && body.email) {
    const ev = event[0];
    const date = new Date(ev.date * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    fetch(`${baseUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: body.name,
        userEmail: body.email,
        teamName: body.teamName,
        people: body.people,
        eventTitle: ev.title,
        eventDate: date,
        eventTime: ev.time,
        eventAddress: "",
      }),
    }).catch(() => {});
  }

  return c.json(booking, 201);
});

app.get("/bookings/event/:eventId", async (c) => {
  const eventId = Number(c.req.param("eventId"));
  const rows = await db.select().from(bookings).where(eq(bookings.eventId, eventId));
  return c.json(rows);
});

app.patch("/bookings/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const [row] = await db.update(bookings).set(body).where(eq(bookings.id, id)).returning();
  return c.json(row);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
