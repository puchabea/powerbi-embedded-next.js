import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const badRequest = (error: string) =>
    NextResponse.json({ ok: false, error }, { status: 400 });

  const form = await req.formData();

  // 1) Texto
  const name = String(form.get("name") ?? "").trim();
  const embedUrl = String(form.get("embedUrl") ?? "").trim();
  if (!name) return badRequest("El nombre es obligatorio");
  if (!embedUrl) return badRequest("La URL (embedUrl) es obligatoria");

  // 2) Números
  const width = Number(String(form.get("width") ?? "1140").replace(",", "."));
  const height = Number(String(form.get("height") ?? "541").replace(",", "."));

  const inRange = (n: number, min: number, max: number) =>
    Number.isFinite(n) && n >= min && n <= max;

  if (!inRange(width, 200, 4000)) return badRequest("width debe ser 200–4000 px");
  if (!inRange(height, 200, 4000)) return badRequest("height debe ser 200–4000 px");

  // 3) Archivo
  const file = form.get("thumbnail");
  if (!(file instanceof File)) return badRequest("La foto (thumbnail) es obligatoria");
  if (!file.type.startsWith("image/")) return badRequest("El archivo debe ser una imagen");

  const MAX = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX) return badRequest("La imagen debe pesar <= 2MB");

  // 4) Guardar
  const bytes = Buffer.from(await file.arrayBuffer());

  const report = await prisma.report.create({
    data: {
      name,
      embedUrl,
      width,
      height,
      thumbnailData: bytes,
      thumbnailType: file.type,
    },
  });

  return NextResponse.json({ ok: true, report }, { status: 201 });
}
