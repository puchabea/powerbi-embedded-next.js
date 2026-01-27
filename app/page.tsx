"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inter } from "@/app/ui/fonts";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError(null);

    // Validación frontend
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT – Brand panel */}
      <div className="relative hidden lg:flex items-center bg-sky-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/30" />
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white/20" />
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 px-16 max-w-xl">
          <h1 className={`text-4xl font-semibold mb-4 ${inter.className}`}>
            Reportes NIC Labs
          </h1>

          <p className="text-sky-100 text-xl leading-relaxed">
            Plataforma interna para visualizar y administrar reportes de forma
            simple, segura y centralizada.
          </p>
        </div>
      </div>

      {/* RIGHT – Login */}
      <div className="flex items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 p-10 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Bienvenido!
            </h2>
            <p className="mt-1 text-base text-zinc-500">
              Por favor ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-base font-medium text-zinc-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@gmail.com"
                className={[
                  "mt-2 w-full rounded-xl border px-4 py-3.5 text-base",
                  "text-zinc-900 placeholder-zinc-400 outline-none",
                  "focus:border-sky-600",
                  submitted && !email.trim()
                    ? "border-red-500 ring-2 ring-red-200 focus:border-red-500 focus:ring-red-200"
                    : "border-zinc-200",
                ].join(" ")}
              />

              {submitted && !email.trim() && (
                <p className="mt-2 text-sm text-red-600">
                  Ingresa tu correo.
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-base font-medium text-zinc-700">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={[
                  "mt-2 w-full rounded-xl border px-4 py-3.5 text-base",
                  "text-zinc-900 placeholder-zinc-400 outline-none",
                  "focus:border-sky-600",
                  submitted && !password.trim()
                    ? "border-red-500 ring-2 ring-red-200 focus:border-red-500 focus:ring-red-200"
                    : "border-zinc-200",
                ].join(" ")}
              />

              {submitted && !password.trim() && (
                <p className="mt-2 text-sm text-red-600">
                  Ingresa tu contraseña.
                </p>
              )}
            </div>

            {/* ERROR BACKEND */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="block w-full rounded-xl bg-sky-600 py-3.5 text-center text-base font-medium
                         text-white hover:bg-sky-700 transition disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Login Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
