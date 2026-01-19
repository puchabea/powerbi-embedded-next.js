"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewReportPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, embedUrl }),
    });

    if (res.ok) {
      router.push("/dashboard/reports");
      router.refresh();
    } else {
      alert("Error al crear reporte");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Agregar reporte</h1>

      <div className="space-y-3">
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Nombre del reporte"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Embed URL de Power BI"
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading || !name || !embedUrl}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
