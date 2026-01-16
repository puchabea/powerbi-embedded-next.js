"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { jakarta } from "@/app/ui/fonts";


export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top blue bar */}
      <div className="h-14 w-full bg-sky-600">
        <div className="mx-auto flex h-full w-full items-center justify-between px-4">

          {/* Left: Brand */}
          <div className="flex items-center gap-3 text-white">
            <div className={`text-xl font-semibold ${jakarta.className}`}>
                Reportes NIC Labs
            </div>

          </div> 

        {/* User + Logout */}
          <div className="flex items-center gap-6">
            {/* User de prueba*/}
            <div className="text-sm font-medium text-white">
              Beatriz Oyarzo
            </div>
            
            {/* Logout */}
            <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 
             text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
            <LogOut size={16} />
            Salir
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
