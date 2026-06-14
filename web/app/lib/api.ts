// Endereco do backend Flask. Em demo local o frontend (:3000) fala direto com
// o backend (:5000) -- por isso chamamos a URL absoluta (e o Flask libera CORS).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

export type Status = {
  container_up: boolean;
  cookie_present: boolean;
  level: string | null;
};

// Comandos do Makefile expostos na interface (a "visualizacao dos comandos").
export type Command = {
  target: string;
  label: string;
  cmd: string;
  desc: string;
  kind: "setup" | "attack" | "danger";
};

export const COMMANDS: Command[] = [
  { target: "up", label: "Subir DVWA", cmd: "make up", kind: "setup", desc: "Sobe o container do DVWA e espera ficar pronto." },
  { target: "setup", label: "Configurar", cmd: "make setup", kind: "setup", desc: "Cria o banco, faz login e salva o cookie de sessao." },
  { target: "scan", label: "Scan", cmd: "make scan", kind: "attack", desc: "Detecta a injecao SQL e lista os bancos." },
  { target: "dump", label: "Dump", cmd: "make dump", kind: "attack", desc: "Extrai a tabela dvwa.users (usuarios e hashes)." },
  { target: "crack", label: "Crack", cmd: "make crack", kind: "attack", desc: "Extrai os usuarios e quebra os hashes (dicionario)." },
  { target: "demo", label: "Demo completo", cmd: "make demo", kind: "attack", desc: "Fluxo ponta a ponta: sobe, configura, ataca e extrai." },
  { target: "down", label: "Down", cmd: "make down", kind: "danger", desc: "Para e remove o container do DVWA." },
  { target: "clean", label: "Clean", cmd: "make clean", kind: "danger", desc: "Para o container e remove os artefatos gerados." },
];

export const LEVELS = ["low", "medium", "high", "impossible"] as const;
export type Level = (typeof LEVELS)[number];

export async function fetchStatus(): Promise<Status> {
  const res = await fetch(`${API_BASE}/api/status`, { cache: "no-store" });
  if (!res.ok) throw new Error("falha ao obter status");
  return res.json();
}

export async function setLevel(level: Level): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/level/${level}`);
  return res.json();
}
