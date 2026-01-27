import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/admin";
import { Prisma } from "@prisma/client";

type Role = "ADMIN" | "USER";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const roleParam = (url.searchParams.get("role") ?? "ALL").toUpperCase();
  const activeParam = (url.searchParams.get("active") ?? "ALL").toUpperCase();

  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? "10")));
  const skip = (page - 1) * pageSize;

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  if (roleParam !== "ALL") {
    const role = roleParam as Role;
    if (role === "ADMIN" || role === "USER") where.role = role;
  }

  if (activeParam !== "ALL") {
    where.isActive = activeParam === "TRUE";
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    total,
    users,
  });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim() || null;
  const password = String(body?.password ?? "");
  const roleParam = String(body?.role ?? "USER").toUpperCase();
  const isActive = body?.isActive === false ? false : true;

  // Validations
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email es obligatorio" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password debe tener al menos 8 caracteres" },
      { status: 400 }
    );
  }
  if (roleParam !== "ADMIN" && roleParam !== "USER") {
    return NextResponse.json({ ok: false, error: "Role inválido" }, { status: 400 });
  }
  // evita duplicados
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "Ese email ya existe" }, { status: 409 });
  }
  // hashea contraseña
  const passwordHash = await bcrypt.hash(password, 12);
  // creamos en la db
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: roleParam as Role,
      isActive,
    },
    select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
