import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { ok: false as const, session: null };

  const isAdmin = session.user.role === "ADMIN";
  return { ok: isAdmin, session };
}
