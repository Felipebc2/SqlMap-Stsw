"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import Terminal from "./components/Terminal";
import {
  API_BASE,
  COMMANDS,
  LEVELS,
  fetchStatus,
  setLevel as apiSetLevel,
  type Command,
  type Level,
  type Status,
} from "./lib/api";

const KIND_STYLES: Record<Command["kind"], string> = {
  setup: "border-sky-500/40 hover:border-sky-400 hover:bg-sky-500/10",
  attack: "border-green-500/40 hover:border-green-400 hover:bg-green-500/10",
  danger: "border-red-500/40 hover:border-red-400 hover:bg-red-500/10",
};

export default function Home() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const append = useCallback((line: string) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await fetchStatus());
    } catch {
      setStatus(null);
    }
  }, []);

  // Status inicial + polling leve enquanto a pagina esta aberta.
  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, 5000);
    return () => {
      clearInterval(id);
      esRef.current?.close();
    };
  }, [refreshStatus]);

  const runCommand = useCallback(
    (target: string) => {
      if (running) return;
      setRunning(target);
      append(`\n$ make ${target}`);

      const es = new EventSource(`${API_BASE}/api/run/${target}`);
      esRef.current = es;

      es.onmessage = (e) => append(e.data);
      es.addEventListener("end", (e) => {
        const code = (e as MessageEvent).data;
        append(`[fim — exit ${code}]`);
        es.close();
        esRef.current = null;
        setRunning(null);
        refreshStatus();
      });
      es.onerror = () => {
        es.close();
        esRef.current = null;
        setRunning(null);
        refreshStatus();
      };
    },
    [running, append, refreshStatus],
  );

  const changeLevel = useCallback(
    async (level: Level) => {
      if (running) return;
      append(`\n$ make level LEVEL=${level}`);
      try {
        const res = await apiSetLevel(level);
        append(res.message || (res.ok ? "ok" : "falha"));
      } catch {
        append("[erro] backend indisponivel");
      }
      refreshStatus();
    },
    [running, append, refreshStatus],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-8 font-mono">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-green-400">
          <span className="text-green-600">$</span> SQLMap Demo Console
        </h1>
        <p className="mt-1 text-sm text-green-500/60">
          Interface da demo de SQL injection (DVWA + SQLMap). Cada botao dispara um
          comando <code className="text-green-400">make</code> e transmite a saida ao vivo.
        </p>
      </header>

      <StatusBar status={status} />

      {/* Comandos */}
      <section>
        <h2 className="mb-2 text-xs uppercase tracking-widest text-green-500/50">
          Comandos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COMMANDS.map((c) => (
            <button
              key={c.target}
              onClick={() => runCommand(c.target)}
              disabled={running !== null}
              title={c.desc}
              className={`flex flex-col items-start gap-1 rounded-lg border bg-black/40 px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${KIND_STYLES[c.kind]}`}
            >
              <span className="text-sm font-semibold text-green-200">
                {running === c.target ? "▶ rodando…" : c.label}
              </span>
              <code className="text-xs text-green-500/60">{c.cmd}</code>
            </button>
          ))}
        </div>
      </section>

      {/* Dificuldade */}
      <section>
        <h2 className="mb-2 text-xs uppercase tracking-widest text-green-500/50">
          Dificuldade do DVWA
        </h2>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lvl) => {
            const active = status?.level === lvl;
            return (
              <button
                key={lvl}
                onClick={() => changeLevel(lvl)}
                disabled={running !== null}
                className={`rounded-md border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  active
                    ? "border-green-400 bg-green-500/20 text-green-200 shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                    : "border-green-500/30 text-green-400 hover:border-green-400 hover:bg-green-500/10"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </section>

      {/* Terminal */}
      <section className="flex-1">
        <Terminal lines={lines} onClear={() => setLines([])} />
      </section>
    </main>
  );
}
