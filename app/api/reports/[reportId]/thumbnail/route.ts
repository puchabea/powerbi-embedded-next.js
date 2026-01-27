// app/api/reports/[reportId]/thumbnail/route.ts
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const runtime = "nodejs";

type Awaitable<T> = T | Promise<T>;

export async function GET(
  _: Request,
  ctx: { params: Awaitable<{ reportId: string }> }
) {
  const { reportId } = await ctx.params;

  const r = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      thumbnailData: true,
      thumbnailType: true,
    },
  });

  if (!r || !r.thumbnailData || !r.thumbnailType) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(r.thumbnailData, {
    headers: { "Content-Type": r.thumbnailType },
  });
}

export async function PATCH(
  req: Request,
  ctx: { params: Awaitable<{ reportId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await ctx.params;

  const form = await req.formData();
  const file = form.get("thumbnail");

  if (!(file instanceof File)) {
    return Response.json(
      { ok: false, error: "thumbnail es obligatorio" },
      { status: 400 }
    );
  }

  // (opcional) validar que sea imagen
  if (!file.type?.startsWith("image/")) {
    return Response.json(
      { ok: false, error: "El archivo debe ser una imagen" },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "image/jpeg";

  await prisma.report.update({
    where: { id: reportId },
    data: {
      thumbnailData: bytes,
      thumbnailType: contentType,
    },
  });

  return Response.json({ ok: true });
}