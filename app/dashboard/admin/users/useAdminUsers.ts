"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActiveFilter, Role, RoleFilter, UserRow } from "./types";

export function useAdminUsers(pageSize = 10) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [active, setActive] = useState<ActiveFilter>("ALL");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  async function load() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (role !== "ALL") params.set("role", role);
    if (active !== "ALL") params.set("active", active === "TRUE" ? "true" : "false");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
    const json = await res.json().catch(() => null);

    setLoading(false);

    if (!res.ok || !json?.ok) {
      setError(json?.error ?? "Error cargando usuarios");
      return;
    }

    setUsers(json.users);
    setTotal(json.total);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, role, active, page]);

  async function patchUser(id: string, data: Partial<{ role: Role; isActive: boolean }>) {
    setError(null);

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      setError(json?.error ?? "No se pudo actualizar");
      return;
    }

    await load();
  }

  async function createUser(input: {
    email: string;
    name: string;
    password: string;
    role: Role;
    isActive: boolean;
  }) {
    setError(null);

    const res = await fetch(`/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        name: input.name,
        password: input.password,
        role: input.role,
        isActive: input.isActive,
      }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      setError(json?.error ?? "No se pudo crear usuario");
      return false;
    }

    setPage(1);
    await load();
    return true;
  }

  return {
    // filtros + paginación
    q, setQ,
    role, setRole,
    active, setActive,
    page, setPage,
    pageSize,
    total, totalPages,

    // data
    users,
    loading,
    error,
    setError,

    // acciones
    load,
    patchUser,
    createUser,
  };
}
