"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";

type ReportDTO = {
  id: string;
  name: string;
  embedUrl: string;
  width: number;
  height: number;
};

export default function EditReportForm({
  initialReport,
}: {
  initialReport: ReportDTO;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [touchedName, setTouchedName] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState(initialReport.name);
  const [embedUrl, setEmbedUrl] = useState(initialReport.embedUrl);

  const [width, setWidth] = useState<string>(String(initialReport.width));
  const [height, setHeight] = useState<string>(String(initialReport.height));

  const nameInvalid = touchedName && !name.trim();
  const urlInvalid = touchedUrl && !embedUrl.trim();

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [touchedThumb, setTouchedThumb] = useState(false);
  const thumbInvalid = touchedThumb && !thumbnail;

  const baseInput = "w-full rounded-lg border px-3 py-2 outline";
  const normal = "border-zinc-300 focus:border-blue-500";
  const error = "border-red-500 focus:border-blue-500";

  const buttonBase =
    "rounded-lg px-4 py-2 transition-all duration-200 ease-out " +
    "hover:-translate-y-0.5 active:translate-y-0 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const dangerButton = `${buttonBase} bg-red-600 text-white hover:bg-red-700`;

  async function handleSave() {
    setTouchedName(true);
    setTouchedUrl(true);
    setErrorMsg(null);

    if (!name.trim() || !embedUrl.trim()) return;

    setLoading(true);

    // 1) Guardar texto/medidas
    const res = await fetch(`/api/reports/${initialReport.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, embedUrl, width, height }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setErrorMsg(data?.error ?? "Error al guardar");
      setLoading(false);
      return;
    }

    // 2) Si eligió nueva foto, subirla
    if (thumbnail) {
      const fd = new FormData();
      fd.append("thumbnail", thumbnail);

      const up = await fetch(`/api/reports/${initialReport.id}/thumbnail`, {
        method: "PATCH",
        body: fd,
      });

      if (!up.ok) {
        const j = await up.json().catch(() => null);
        setErrorMsg(j?.error ?? "Error al actualizar la foto");
        setLoading(false);
        return;
      }
    }

    router.push(`/dashboard/reports/${initialReport.id}`);
    router.refresh();
  }

  async function handleDelete() {
    const ok = confirm(
      "¿Estás seguro de que quieres borrar este reporte?\nEsta acción no se puede deshacer."
    );

    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/reports/${initialReport.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setErrorMsg("Error al borrar el reporte");
      setLoading(false);
      return;
    }

    router.push("/dashboard/reports");
    router.refresh();
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Editar reporte</h1>

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
            <p className="text-sm text-red-500">El nombre es obligatorio.</p>
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
            <p className="text-sm text-red-500">La URL es obligatoria.</p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm text-zinc-600">Width (px)</label>
            <input
              inputMode="decimal"
              className={`${baseInput} ${normal}`}
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
              value={height}
              onChange={(e) => {
                const v = e.target.value.replace(",", ".");
                if (v === "" || /^\d*\.?\d*$/.test(v)) setHeight(v);
              }}
            />
          </div>
        </div>

        {/* Foto (sin preview) */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-600">Foto</label>

          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setThumbnail(e.target.files?.[0] ?? null);
              setTouchedThumb(true);
            }}
          />

          <label
            htmlFor="thumbnail"
            className={`
              flex cursor-pointer items-center justify-center gap-2
              rounded-lg border px-4 py-3 text-sm font-medium
              transition-all duration-200
              hover:bg-zinc-50 hover:-translate-y-0.5
              ${thumbInvalid ? "border-red-500 text-red-600" : "border-zinc-300 text-zinc-700"}
            `}
          >
            <Upload className="h-4 w-4" />
            {thumbnail ? "Cambiar foto" : "Editar foto"}
          </label>

          {thumbnail && (
            <p className="text-xs text-zinc-500 truncate">{thumbnail.name}</p>
          )}

          {thumbInvalid && (
            <p className="text-sm text-red-500">Selecciona una foto.</p>
          )}
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`${buttonBase} bg-black text-white`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={loading}
            className={`${buttonBase} border border-zinc-300 bg-white text-black`}
          >
            Cancelar
          </button>

          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`${dangerButton} ml-auto`}
            >
              Borrar reporte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
