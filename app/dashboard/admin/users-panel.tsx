"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers } from "./users/useAdminUsers";
import { parseActiveFilter, parseRole, parseRoleFilter } from "./users/types";
import CreateUserModal from "./users/CreateUserModal";

export default function AdminUsersPanel() {
  const router = useRouter();

  const {
    q, setQ,
    role, setRole,
    active, setActive,
    page, setPage,
    totalPages,
    users,
    loading,
    error,
    setError,
    patchUser,
    createUser,
  } = useAdminUsers(10);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate(input: {
    email: string;
    name: string;
    password: string;
    role: "ADMIN" | "USER";
    isActive: boolean;
  }) {
    setCreating(true);
    const ok = await createUser(input);
    setCreating(false);

    if (ok) {
      router.refresh();
    }

    return ok;
  }

  return (
    <div className="space-y-4">
      {/* Header row: botón */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setError(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition"
        >
          <UserPlus size={16} />
          Crear usuario
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Principal más angosto */}
      <div className="rounded-2xl border bg-white p-4 max-w-5xl">
        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              type="search"
              name="admin-user-search"
              autoComplete="off"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Buscar por email o nombre..."
              className="w-full md:w-72 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            />
            <select
              value={role}
              onChange={(e) => {
                setPage(1);
                setRole(parseRoleFilter(e.target.value));
              }}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            >
              <option value="ALL">Todos los roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>

            <select
              value={active}
              onChange={(e) => {
                setPage(1);
                setActive(parseActiveFilter(e.target.value));
              }}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            >
              <option value="ALL">Todos</option>
              <option value="TRUE">Activos</option>
              <option value="FALSE">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-600">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Rol</th>
                <th className="py-2 pr-4">Activo</th>
                <th className="py-2 pr-4">Creado</th>
              </tr>
            </thead>

            <tbody className="text-zinc-900">
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.name ?? "-"}</td>
                  <td className="py-2 pr-4">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        patchUser(u.id, { role: parseRole(e.target.value) })
                      }
                      className="rounded-lg border border-zinc-200 px-2 py-1 outline-none focus:border-sky-600"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      value={u.isActive ? "TRUE" : "FALSE"}
                      onChange={(e) =>
                        patchUser(u.id, { isActive: e.target.value === "TRUE" })
                      }
                      className="rounded-lg border border-zinc-200 px-2 py-1 outline-none focus:border-sky-600"
                    >
                      <option value="TRUE">Si</option>
                      <option value="FALSE">No</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td className="py-4 text-zinc-500" colSpan={5}>
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1 text-sm
                       disabled:opacity-50 hover:bg-zinc-50 transition"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          <div className="text-sm text-zinc-600">
            Página {page} de {totalPages}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1 text-sm
                       disabled:opacity-50 hover:bg-zinc-50 transition"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <CreateUserModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
        busy={creating}
      />
    </div>
  );
}
