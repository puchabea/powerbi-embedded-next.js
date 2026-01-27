import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import ReportViewer from "@/app/ui/report-viewer";
import Breadcrumbs from "@/app/ui/breadcrumbs";

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

  if (!report) return <div className="p-6">Reporte no encontrado.</div>;

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Reportes", href: "/dashboard/reports" },
          { label: report.name },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{report.name}</h1>
        <Link
          href={`/dashboard/reports/${reportId}/edit`}
          className="
            inline-flex items-center rounded-lg border border-zinc-300
            px-4 py-2 text-sm font-medium text-zinc-900 bg-white
            hover:brightness-95 transition-colors duration-200
          "
        >
          Editar
        </Link>
      </div>

      <div className="flex justify-center">
        <ReportViewer
          title={report.name}
          src={report.embedUrl}
          width={report.width}
          height={report.height}
        />
      </div>
    </div>
  );
}
