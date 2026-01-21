import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <Link
          href="/dashboard/reports/new"
          className="
            inline-flex items-center
            rounded-lg bg-black px-4 py-2 text-sm font-medium text-white
            hover:brightness-130
            transition-colors duration-200
          "
        >
          Agregar reporte
        </Link>
      </div>

      <p className="mt-2 max-w-2xl text-zinc-600">
        Aquí irán los reportes.
      </p>
    
      <ul className="list-disc pl-6 space-y-1">
        {reports.map((r) => (
          <li key={r.id}>
            <Link
              href={`/dashboard/reports/${r.id}`}
              className="text-zinc-900 hover:underline"
            >
              {r.name}
            </Link>
          </li>
        ))}

        {reports.length === 0 && (
          <li className="list-none text-sm text-zinc-500">No hay reportes aún.</li>
        )}
      </ul>
    </div>
  );
}
