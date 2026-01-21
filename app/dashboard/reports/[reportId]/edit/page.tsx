import { prisma } from "@/app/lib/prisma";
import EditReportForm from "./report-editor";

type Awaitable<T> = T | Promise<T>;

export default async function EditReportPage({
  params,
}: {
  params: Awaitable<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await prisma.report.findUnique({ where: { id: reportId } });

  if (!report) return <div className="p-6">Reporte no encontrado.</div>;

  return (
    <EditReportForm
      initialReport={{
        id: report.id,
        name: report.name,
        embedUrl: report.embedUrl,
        width: report.width,
        height: report.height,
      }}
    />
  );
}
