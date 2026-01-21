import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

type Awaitable<T> = T | Promise<T>;

export default async function ReportDetailPage({
  params,
}: {
  params: Awaitable<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return <div className="p-6">Reporte no encontrado.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{report.name}</h1>
        <Link
          href={`/dashboard/reports/${reportId}/edit`}
            className="
              inline-flex items-center
              rounded-lg border border-zinc-300
              px-4 py-2 text-sm font-medium text-zinc-900
              bg-white
              hover:brightness-95
              transition-colors duration-200
            "
        >
          Editar
        </Link>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div className="rounded-xl border bg-white p-3 overflow-x-auto max-w-5xl w-full">
          <iframe
            title={report.name}
            src={report.embedUrl}
            width={report.width}
            height={report.height}
            className="mx-auto rounded-lg"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}