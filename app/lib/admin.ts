import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { ok: false as const, session: null };
  }

  const role = session.user?.role;
  const isActive = session.user?.isActive;

  if (isActive === false) {
    return { ok: false as const, session };
  }

  if (role !== "ADMIN") {
    return { ok: false as const, session };
  }

  return { ok: true as const, session };
}
