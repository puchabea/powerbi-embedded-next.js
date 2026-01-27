import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/dashboard");
  return <>{children}</>;
}
