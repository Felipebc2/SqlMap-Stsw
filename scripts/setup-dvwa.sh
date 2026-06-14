#!/usr/bin/env bash
#
# Configura o DVWA para a demo do SQLMap:
#   1. faz login como admin/password
#   2. cria/reseta o banco de dados
#   3. define o nivel de seguranca como "low"
#   4. valida o acesso e salva o cookie de sessao num arquivo
#
# Uso: bash scripts/setup-dvwa.sh [PORTA] [ARQUIVO_COOKIE]
#
set -euo pipefail

PORT="${1:-80}"
COOKIE_FILE="${2:-.dvwa-cookie}"
BASE="http://localhost:${PORT}"
JAR="$(mktemp)"
trap 'rm -f "$JAR"' EXIT

# Extrai o user_token (CSRF) do HTML recebido via stdin
token() { grep -oE "user_token' value='[a-f0-9]{32}" | grep -oE "[a-f0-9]{32}" | head -1; }

# O banco precisa existir ANTES do login (numa container nova ele ainda nao existe).
echo "[*] Criando/resetando o banco de dados ..."
T=$(curl -s -c "$JAR" "$BASE/setup.php" | token)
curl -s -L -b "$JAR" -c "$JAR" \
	--data "create_db=Create+%2F+Reset+Database&user_token=$T" \
	"$BASE/setup.php" -o /dev/null

echo "[*] Fazendo login em $BASE ..."
T=$(curl -s -b "$JAR" -c "$JAR" "$BASE/login.php" | token)
curl -s -L -b "$JAR" -c "$JAR" \
	--data "username=admin&password=password&Login=Login&user_token=$T" \
	"$BASE/login.php" -o /dev/null

echo "[*] Definindo nivel de seguranca: low ..."
T=$(curl -s -b "$JAR" -c "$JAR" "$BASE/security.php" | token)
curl -s -b "$JAR" -c "$JAR" \
	--data "security=low&seclev_submit=Submit&user_token=$T" \
	"$BASE/security.php" -o /dev/null

PHPSESSID=$(grep PHPSESSID "$JAR" | awk '{print $7}')
COOKIE="security=low; PHPSESSID=${PHPSESSID}"

echo "[*] Validando acesso a pagina vulneravel ..."
STATUS=$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: $COOKIE" \
	"$BASE/vulnerabilities/sqli/?id=1&Submit=Submit")
if [ "$STATUS" != "200" ]; then
	echo "[!] ERRO: sessao nao autenticada (HTTP $STATUS). O DVWA esta no ar?" >&2
	exit 1
fi

echo "$COOKIE" > "$COOKIE_FILE"
echo "[+] OK. Cookie salvo em '$COOKIE_FILE':"
echo "    $COOKIE"
