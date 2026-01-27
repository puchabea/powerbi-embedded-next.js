"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {Home, BarChart3, Users} from "lucide-react";

const links = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4">
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

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex items-center gap-3",
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-zinc-100",
                isActive
                  ? "bg-zinc-100 font-semibold"
                  : "text-black",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
