import { db, bookings, events, contacts, eq } from "@starquiz/db";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const rows = await db.select().from(bookings).orderBy(bookings.createdAt);
  return Response.json(rows, { headers: CORS });
}

export async function POST(req: Request) {
  const body = await req.json();
  const [booking] = await db.insert(bookings).values(body).returning();

  const [ev] = await db.select().from(events).where(eq(events.id, body.eventId));
  if (ev && body.email) {
    const date = new Date(ev.date * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    const emailData = {
      userName: body.name,
      userEmail: body.email,
      teamName: body.teamName,
      people: body.people,
      eventTitle: ev.title,
      eventDate: date,
      eventTime: ev.time,
      eventAddress: "",
    };
    try { await sendBookingConfirmation(emailData); } catch (e) { console.error("User email:", e); }
    try {
      const [adminRow] = await db.select().from(contacts).where(eq(contacts.key, "admin_notify_email"));
      if (adminRow?.value) await sendAdminNotification(adminRow.value, emailData);
    } catch (e) { console.error("Admin email:", e); }
  }

  return Response.json(booking, { status: 201, headers: CORS });
}
