import Link from "next/link";

export default function SideNav() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white p-4">
      {/* Title */}
      <div className="mb-8 text-xl font-semibold text-black">
        Reportes NIC Labs
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-zinc-100"
        >
          Inicio
        </Link>

        <Link
          href="/dashboard/reports"
          className="rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-zinc-100"
        >
          Reportes
        </Link>
      </nav>
    </aside>
  );
}
