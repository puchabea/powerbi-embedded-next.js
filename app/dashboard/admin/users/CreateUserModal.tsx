"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { parseRole, type Role } from "./types";

export default function CreateUserModal({
  open,
  onClose,
  onCreate,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    email: string;
    name: string;
    password: string;
    role: Role;
    isActive: boolean;
  }) => Promise<boolean>;
  busy?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [isActive, setIsActive] = useState(true);

  function reset() {
    setEmail("");
    setName("");
    setPassword("");
    setRole("USER");
    setIsActive(true);
  }

  // Cerrar con ESC (esto sí es “externo” y está perfecto en effect)
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        reset();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleCreate() {
    const ok = await onCreate({ email, name, password, role, isActive });
    if (ok) {
      reset();
      onClose();
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  const canSubmit = email.trim().length > 0 && password.trim().length >= 8;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/40" onClick={handleClose} aria-label="Cerrar modal" />

      <div className="relative z-61 w-[92vw] max-w-lg rounded-2xl border bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Crear usuario</h2>
          </div>

          <button onClick={handleClose} className="rounded-lg p-2 hover:bg-zinc-100 transition" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <input
            name="new-user-email"
            autoComplete="new-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@niclabs.cl"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Nombre (opcional)
            </label>
            <input
            name="new-user-name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Password (mín 8)
            </label>
            <input
            name="new-user-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
            />

          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(parseRole(e.target.value))}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Activo
              </label>
            </div>
          </div>
        </div>


        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSubmit || Boolean(busy)}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition disabled:opacity-60"
          >
            {busy ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
