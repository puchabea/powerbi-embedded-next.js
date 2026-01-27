import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { FilePlus } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>

        {isAdmin && (
          <Link
            href="/dashboard/reports/new"
            className="inline-flex items-center gap-2
              rounded-lg bg-black px-4 py-2 
              text-sm font-medium text-white 
              hover:brightness-130 
              transition-colors duration-200"
          >
            <FilePlus className="h-4 w-4" />
            Agregar reporte
          </Link>
        )}
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-zinc-500">No hay reportes aún.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/reports/${r.id}`}
              className="
                group w-full max-w-sm
                overflow-hidden rounded-2xl border border-zinc-200 bg-white
                shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
              "
            > 
              {/* Imagen arriba */}
              <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
              <Image
                src={`/api/reports/${r.id}/thumbnail?v=${new Date(r.updatedAt).getTime()}`}
                alt={r.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              </div>
              <div className="p-4">
                <div className="line-clamp-1 font-medium text-zinc-900">
                  {r.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
