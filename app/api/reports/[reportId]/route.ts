import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth"; // lee la sesión en el servidor
import { authOptions } from "@/auth";

type Awaitable<T> = T | Promise<T>;

export async function PATCH(
  req: Request,
  ctx: { params: Awaitable<{ reportId: string }> }
) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { reportId } = await ctx.params;

  if (!reportId) {
    return NextResponse.json({ ok: false, error: "Falta reportId" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);

  const name = body?.name?.trim();
  const embedUrl = body?.embedUrl?.trim();

  const width = Number(String(body?.width ?? "").replace(",", "."));
  const height = Number(String(body?.height ?? "").replace(",", "."));

  if (!name || !embedUrl) {
    return NextResponse.json(
      { ok: false, error: "name y embedUrl son obligatorios" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(width) || width < 200 || width > 4000) {
    return NextResponse.json(
      { ok: false, error: "width debe ser px entre 200 y 4000" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(height) || height < 200 || height > 4000) {
    return NextResponse.json(
      { ok: false, error: "height debe ser px entre 200 y 4000" },
      { status: 400 }
    );
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: { name, embedUrl, width, height },
  });

  return NextResponse.json({ ok: true, report });
}

export async function DELETE(
  req: Request,
  ctx: { params: Awaitable<{ reportId: string }> }
) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { reportId } = await ctx.params;

  if (!reportId) {
    return NextResponse.json(
      { ok: false, error: "Falta reportId" },
      { status: 400 }
    );
  }

  await prisma.report.delete({
    where: { id: reportId },
  });

  return NextResponse.json({ ok: true });
}
