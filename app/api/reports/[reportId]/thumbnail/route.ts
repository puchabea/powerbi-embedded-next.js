import { prisma } from "@/app/lib/prisma";

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

  if (!r) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(r.thumbnailData, {
    headers: { "Content-Type": r.thumbnailType },
  });
}
