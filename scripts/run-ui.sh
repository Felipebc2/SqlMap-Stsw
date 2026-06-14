#!/usr/bin/env bash
#
# Sobe a interface web da demo: backend Flask (porta 5000) + frontend Next.js
# (porta 3000). Os dois sao derrubados juntos quando voce aperta Ctrl+C.
#
# Uso: bash scripts/run-ui.sh   (ou: make ui)
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Instala as dependencias do frontend na primeira execucao.
if [ ! -d web/node_modules ]; then
	echo "[*] Instalando dependencias do frontend (primeira vez) ..."
	npm --prefix web install
fi

# Sobe o backend Flask em segundo plano.
echo "[*] Subindo o backend Flask em http://localhost:5000 ..."
python3 backend/app.py &
BACKEND_PID=$!

# Garante que o backend morre junto com este script (Ctrl+C, erro, ou saida).
cleanup() {
	echo
	echo "[*] Encerrando o backend (PID $BACKEND_PID) ..."
	kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "[+] Abra a interface em: http://localhost:3000"
echo "[*] Subindo o frontend Next.js (Ctrl+C para encerrar tudo) ..."

# Frontend em primeiro plano; ao sair, o trap derruba o backend.
npm --prefix web run dev
