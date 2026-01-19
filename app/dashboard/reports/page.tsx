import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reportes
        </h1>
      </div>

      <p className="max-w-2xl text-zinc-600">
        Aquí irán los reportes.
      </p>

      <div className="space-y-4">
      <Link
        href="/dashboard/reports/new"
        className="inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
      >
        + Agregar reporte
      </Link>

      <ul className="list-disc pl-6">
        <li>
          <Link
            href="/dashboard/reports/test-prueba"
            className="text-zinc-900 hover:underline"
          >
            Reporte de prueba
          </Link>
        </li>
      </ul>
      </div>
    </div>
  );
}
