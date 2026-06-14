"use client";

import { useEffect, useRef } from "react";

type Props = {
  lines: string[];
  onClear: () => void;
};

// Painel estilo console: fundo preto, texto verde monoespacado, auto-scroll.
export default function Terminal({ lines, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines]);

  return (
    <div className="flex flex-col rounded-lg border border-green-500/30 bg-black shadow-[0_0_25px_rgba(57,255,20,0.15)]">
      <div className="flex items-center justify-between border-b border-green-500/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-green-500/60">sqlmap-demo — console</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-green-500/60 transition hover:text-green-400"
        >
          limpar
        </button>
      </div>
      <pre className="h-[60vh] overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[13px] leading-relaxed text-green-400">
        {lines.length === 0 ? (
          <span className="text-green-500/40">
            {"// a saida dos comandos aparece aqui ao vivo..."}
          </span>
        ) : (
          lines.join("\n")
        )}
        <div ref={endRef} />
      </pre>
    </div>
  );
}
