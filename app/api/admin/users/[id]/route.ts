import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/admin";
import { Prisma } from "@prisma/client";

type Role = "ADMIN" | "USER";

function parseRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toUpperCase();
  if (v === "ADMIN" || v === "USER") return v as Role;
  return null;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);

  const role = parseRole(body?.role);
  const isActive = typeof body?.isActive === "boolean" ? body.isActive : null;

  // si mandaron role pero era inválido
  if (body?.role !== undefined && role === null) {
    return NextResponse.json({ ok: false, error: "Role inválido" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, isActive: true },
  });

  if (!target) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  // Regla: no dejar el sistema sin admins
  const isChangingAdminToNonAdmin =
    target.role === "ADMIN" && role !== null && role !== "ADMIN";
  const isDeactivatingAdmin = target.role === "ADMIN" && isActive === false;

  if (isChangingAdminToNonAdmin || isDeactivatingAdmin) {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN", isActive: true },
    });

    if (adminCount <= 1 && target.isActive === true) {
      return NextResponse.json(
        { ok: false, error: "No puedes dejar el sistema sin admins activos." },
        { status: 400 }
      );
    }
  }

  const data: Prisma.UserUpdateInput = {};
  if (role !== null) data.role = role;
  if (isActive !== null) data.isActive = isActive;

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}
