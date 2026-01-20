import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name = body?.name?.trim();
  const embedUrl = body?.embedUrl?.trim();

  const width = Number(body?.width ?? 100);
  const height = Number(body?.height ?? 800);

  if (!name || !embedUrl) {
    return NextResponse.json(
      { ok: false, error: "name y embedUrl son obligatorios" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(width) || width < 10 || width > 100) {
    return NextResponse.json(
      { ok: false, error: "width debe ser un % entre 10 y 100" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(height) || height < 200 || height > 2000) {
    return NextResponse.json(
      { ok: false, error: "height debe ser px entre 200 y 2000" },
      { status: 400 }
    );
  }

  const report = await prisma.report.create({
    data: { name, embedUrl, width, height },
  });

  return NextResponse.json({ ok: true, report }, { status: 201 });
}
