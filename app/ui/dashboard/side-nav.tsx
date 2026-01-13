"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { name: "Inicio", href: "/dashboard" },
  { name: "Reportes", href: "/dashboard/reports" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white p-4">
      {/* Image */}
      <div className="mb-4 flex justify-center">
        <Image
          src="/logo.svg"
          alt="NIC Labs logo"
          width={120}
          height={120}
          priority
        />
      </div>
      
      {/* Title box */}
      <div className="mb-4 bg-sky-200 px-4 py-3">
        <div className="text-xl font-semibold text-sky-900">
          Reportes NIC Labs
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-zinc-100",
                isActive
                  ? "bg-zinc-100 font-semibold"
                  : "text-black",
              ].join(" ")}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
