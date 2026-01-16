import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default function TestPruebaReportPage() {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Reportes", href: "/dashboard/reports" },
          { label: "Reporte de prueba" },
        ]}
      />

      <div>
        {/* Botón volver */}
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          Reporte de prueba
        </h1>

        <p className="max-w-2xl text-zinc-600">
          Este es un reporte de prueba.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <iframe
          title="TestPractica"
          src="https://app.powerbi.com/reportEmbed?reportId=cda61bd6-9a4a-47e2-a3c5-0f732e3cab5d&autoAuth=true&ctid=0e9a5cdb-5be4-445d-8df0-9c29d46c83cd"
          className="h-[650px] w-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
