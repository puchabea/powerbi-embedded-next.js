"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Shield } from "lucide-react";
import { jakarta } from "@/app/ui/fonts";

export default function TopNav() {
  const { data: session } = useSession();

  const userName = session?.user?.name ?? session?.user?.email ?? "Usuario";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="h-14 w-full bg-sky-600">
        <div className="mx-auto flex h-full w-full items-center justify-between px-4">
          {/* Left */}
          <div className="flex items-center gap-3 text-white">
            <div className={`text-xl font-semibold ${jakarta.className}`}>
              Reportes NIC Labs
            </div>

            {/* no se que tan necesario es esto */}
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className="ml-2 inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col leading-tight text-white">
              <span className="text-sm font-medium">{userName}</span>
              {isAdmin && (
                <span className="text-[11px] font-semibold text-sky-100">
                  ADMIN
                </span>
              )}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5
                         text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
