import SideNav from "@/app/ui/dashboard/side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-black">
      <div className="flex h-screen">
        <SideNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
