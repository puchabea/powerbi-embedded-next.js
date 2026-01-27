import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import AdminUsersPanel from "./users-panel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administración</h1>
        <p className="text-sm text-zinc-600">Panel de usuarios</p>
      </div>

      <AdminUsersPanel />
    </div>
  );
}
