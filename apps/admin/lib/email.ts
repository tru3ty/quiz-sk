import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "onboarding@resend.dev";

interface BookingEmailData {
  userName: string;
  userEmail: string;
  teamName: string;
  people: number;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventAddress: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  await resend.emails.send({
    from: FROM,
    to: data.userEmail,
    subject: `Бронь подтверждена — ${data.eventTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0420; color: #f4f2ff; padding: 32px; border-radius: 16px;">
        <h1 style="font-family: monospace; color: #00e5ff; margin: 0 0 24px;">STARQUIZ</h1>
        <p style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">Привет, ${data.userName}! 👋</p>
        <p style="color: rgba(244,242,255,0.7); margin: 0 0 24px;">Твоя бронь подтверждена. Ждём тебя!</p>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px;"><strong>${data.eventTitle}</strong></p>
          <p style="margin: 0 0 6px; color: rgba(244,242,255,0.7);">📅 ${data.eventDate}, ${data.eventTime}</p>
          ${data.eventAddress ? `<p style="margin: 0 0 6px; color: rgba(244,242,255,0.7);">📍 ${data.eventAddress}</p>` : ""}
          <p style="margin: 0 0 6px; color: rgba(244,242,255,0.7);">👥 Команда: ${data.teamName}</p>
          <p style="margin: 0; color: rgba(244,242,255,0.7);">🎟 Мест: ${data.people}</p>
        </div>
        <p style="color: rgba(244,242,255,0.4); font-size: 13px; margin: 0;">До встречи на игре!</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(adminEmail: string, data: BookingEmailData) {
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Новая бронь — ${data.eventTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="font-family: monospace;">Новая бронь</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px 0; color: #666;">Мероприятие</td><td style="padding: 8px 0;"><strong>${data.eventTitle}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Дата</td><td style="padding: 8px 0;">${data.eventDate}, ${data.eventTime}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Игрок</td><td style="padding: 8px 0;">${data.userName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.userEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Команда</td><td style="padding: 8px 0;">${data.teamName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Мест</td><td style="padding: 8px 0;">${data.people}</td></tr>
        </table>
      </div>
    `,
  });
}
