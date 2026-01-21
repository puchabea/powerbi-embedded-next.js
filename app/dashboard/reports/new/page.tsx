"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewReportPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [width, setWidth] = useState<string>("1140");
  const [height, setHeight] = useState<string>("541");

  const [touchedName, setTouchedName] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);

  const nameInvalid = touchedName && !name.trim();
  const urlInvalid = touchedUrl && !embedUrl.trim();

  // Common input styles
  const baseInput = "w-full rounded-lg border px-3 py-2 outline";
  const normal = "border-zinc-300 focus:border-blue-500";
  const error = "border-red-500 focus:border-blue-500"; 

  // Common button styles
  const buttonBase =
  "rounded-lg px-4 py-2 transition-all duration-200 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

  // Handle form submission
  async function handleSubmit() {

    setTouchedName(true);
    setTouchedUrl(true);

    if (!name.trim() || !embedUrl.trim()) return;

    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, embedUrl, width, height }),
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
        <div className="space-y-1">
          <input
            className={`${baseInput} ${nameInvalid ? error : normal}`}
            placeholder="Nombre del reporte"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouchedName(true)}
          />
          {nameInvalid && (
            <p className="text-sm text-red-500">
              El nombre es obligatorio.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <input
            className={`${baseInput} ${urlInvalid ? error : normal}`}
            placeholder="Embed URL de Power BI"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            onBlur={() => setTouchedUrl(true)}
          />
          {urlInvalid && (
            <p className="text-sm text-red-500">
              La URL es obligatoria.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-zinc-600">Width (px)</label>
          <input
            inputMode="decimal"
            className={`${baseInput} ${normal}`}
            placeholder="ej: 1140"
            value={width}
            onChange={(e) => {
              const v = e.target.value.replace(",", ".");
              if (v === "" || /^\d*\.?\d*$/.test(v)) setWidth(v);
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-600">Height (px)</label>
          <input
            inputMode="decimal"
            className={`${baseInput} ${normal}`}
            placeholder="ej: 541.25"
            value={height}
            onChange={(e) => {
              const v = e.target.value.replace(",", ".");
              if (v === "" || /^\d*\.?\d*$/.test(v)) setHeight(v);
            }}
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${buttonBase} bg-black text-white`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button
          onClick={() => router.back()}
          className={`${buttonBase} border border-zinc-300 bg-white text-black`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
