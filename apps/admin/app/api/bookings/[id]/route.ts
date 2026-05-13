import { db, bookings, eq } from "@starquiz/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db.update(bookings).set(body).where(eq(bookings.id, Number(id))).returning();
  return Response.json(row);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(bookings).where(eq(bookings.id, Number(id)));
  return Response.json({ ok: true });
}
