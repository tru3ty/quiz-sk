import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";
import { db, events, bookings, venues, eq } from "@starquiz/db";

export const runtime = "edge";

const app = new Hono().basePath("/api");

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

// Bookings
app.get("/bookings", async (c) => {
  const rows = await db.select().from(bookings).orderBy(bookings.createdAt);
  return c.json(rows);
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
