import SideNav from "@/app/ui/dashboard/side-nav";
import TopNav from "@/app/ui/dashboard/top-nav";
import { inter } from "@/app/ui/fonts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <div className={`min-h-screen bg-zinc-50 text-black ${inter.className} flex flex-col`}>
    <TopNav />

    <div className="flex flex-1 min-h-0 items-stretch">
      <SideNav />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  </div>
  );
}
