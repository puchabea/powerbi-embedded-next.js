"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = {
  title: string;
  src: string;
  width: number;
  height: number;
};

export default function ReportViewer({ title, src, width, height }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [isFs, setIsFs] = useState(false);

  async function enterFs() {
    const el = boxRef.current;
    if (!el) return;
    await el.requestFullscreen?.(); // haz fullscreen este div
  }

  async function exitFs() { // sal del fullscreen
    await document.exitFullscreen?.();
  }

  useEffect(() => {
    const onFsChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div className="w-full max-w-5xl">
      <div
        ref={boxRef}
        className={`
          relative rounded-xl border bg-white p-3 overflow-x-auto
          min-h-[50vh]
          ${isFs ? "h-dvh w-full p-0 border-0 rounded-none bg-black" : ""}
        `}
      >
        {isFs && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={exitFs}
              className="inline-flex items-center gap-2 rounded-lg bg-black/80
                         px-3 py-2 text-sm font-medium text-white
                         hover:bg-black transition"
            >
              <Minimize2 className="h-4 w-4" />
              Salir
            </button>
          </div>
        )}

        {/* Iframe */}
        <iframe
          title={title}
          src={src}
          width={isFs ? undefined : width}
          height={isFs ? undefined : height}
          className={`
            mx-auto rounded-lg
            ${isFs ? "w-full h-full rounded-none" : ""}
          `}
          style={
            isFs
              ? undefined
              : {
                  width: `${width}px`,
                  height: `${height}px`,
                }
          }
          allowFullScreen
        />
      </div>

      {!isFs && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={enterFs}
            className="inline-flex items-center gap-2 rounded-lg bg-black/80
                       px-3 py-2 text-sm font-medium text-white
                       hover:bg-black transition"
          >
            <Maximize2 className="h-4 w-4" />
            Pantalla completa
          </button>
        </div>
      )}
    </div>
  );
}
