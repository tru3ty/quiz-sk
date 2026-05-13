import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { db, contacts, eq } from "@starquiz/db";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    // Письмо пользователю
    if (data.userEmail) {
      await sendBookingConfirmation(data);
    }

    // Письмо админу если настроен email
    const [row] = await db.select().from(contacts).where(eq(contacts.key, "admin_notify_email"));
    if (row?.value) {
      await sendAdminNotification(row.value, data);
    }
  } catch (e) {
    console.error("Email send error:", e);
  }

  return Response.json({ ok: true });
}
