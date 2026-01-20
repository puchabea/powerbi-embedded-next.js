import { prisma } from "@/app/lib/prisma";

type Awaitable<T> = T | Promise<T>;

export default async function ReportDetailPage({
  params,
}: {
  params: Awaitable<{ reportId: string }>;
}) {
  const { reportId } = await params;

  if (!reportId) {
    return <div className="p-6">Falta el id en la URL.</div>;
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) return <div className="p-6">Reporte no encontrado.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{report.name}</h1>

      <div className="rounded-xl border bg-white p-3">
        <iframe
          title={report.name}
          src={report.embedUrl}
          width={`${report.width}%`}
          height={report.height}
          className="w-full rounded-lg"
          allowFullScreen
        />
      </div>
    </div>
  );
}
