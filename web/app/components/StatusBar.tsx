"use client";

import type { Status } from "../lib/api";

type Props = { status: Status | null };

// Barra de status: estado do container, do cookie e o nivel atual do DVWA.
export default function StatusBar({ status }: Props) {
  const up = status?.container_up ?? false;
  const cookie = status?.cookie_present ?? false;
  const level = status?.level ?? "—";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-green-500/20 bg-black/40 px-4 py-3 font-mono text-sm">
      <span className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            up ? "bg-green-400 shadow-[0_0_8px_#39ff14]" : "bg-red-500"
          }`}
        />
        container: <strong className="text-green-300">{up ? "no ar" : "parado"}</strong>
      </span>
      <span>
        cookie: <strong className="text-green-300">{cookie ? "✓" : "✗"}</strong>
      </span>
      <span>
        nivel: <strong className="text-green-300">{level}</strong>
      </span>
    </div>
  );
}
