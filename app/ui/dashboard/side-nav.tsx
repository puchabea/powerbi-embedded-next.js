"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {Home, BarChart3, Users} from "lucide-react";

export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const links = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },

    // 👇 solo admins ven Usuarios
    ...(isAdmin
      ? [{ name: "Usuarios", href: "/dashboard/admin", icon: Users }]
      : []),
  ];

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
