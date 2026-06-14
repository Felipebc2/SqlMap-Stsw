# 01 — Introdução ao SQLMap

## O que é SQL Injection (SQLi)

SQL Injection é uma falha em que dados controlados pelo usuário são concatenados
diretamente em uma consulta SQL, permitindo ao atacante **alterar a lógica da query**.
Exemplo clássico de código vulnerável:

```php
// Entrada do usuário inserida sem tratamento
$query = "SELECT * FROM users WHERE id = '" . $_GET['id'] . "'";
```

Se o atacante enviar `id=1' OR '1'='1`, a consulta retorna todos os usuários. A partir
daí é possível extrair dados, burlar autenticação ou até executar comandos no servidor.

### Tipos principais de SQLi

| Tipo | Como funciona |
|------|---------------|
| **In-band / Error-based** | O banco retorna mensagens de erro que vazam dados |
| **In-band / UNION-based** | Usa `UNION SELECT` para anexar dados de outras tabelas |
| **Blind / Boolean-based** | Sem retorno direto; infere dados por respostas verdadeiro/falso |
| **Blind / Time-based** | Infere dados pelo tempo de resposta (`SLEEP`, `WAITFOR DELAY`) |
| **Stacked queries** | Executa múltiplas instruções (`; DROP TABLE ...`) |
| **Out-of-band** | Exfiltra dados por outro canal (DNS/HTTP) |

## O que é o SQLMap

O **SQLMap** é uma ferramenta de código aberto, escrita em Python, que **automatiza** a
detecção e a exploração de vulnerabilidades de SQL injection. Em vez de testar payloads
manualmente, você aponta o SQLMap para um alvo e ele identifica o ponto vulnerável,
descobre o tipo de banco e extrai informações.

Repositório oficial: <https://github.com/sqlmapproject/sqlmap>

## Principais utilidades

- **Detecção automática** de SQLi em parâmetros GET, POST, cookies, cabeçalhos, etc.
- **Fingerprint do DBMS**: identifica o banco (MySQL, PostgreSQL, MSSQL, Oracle, SQLite…)
  e sua versão.
- **Enumeração**: lista bancos de dados, tabelas, colunas e usuários.
- **Dump de dados**: extrai o conteúdo das tabelas (inclusive quebra de hashes de senha).
- **Acesso ao sistema operacional**: em condições adequadas, abre um shell no servidor
  (`--os-shell`) ou no próprio SGBD (`--sql-shell`).
- **Leitura/escrita de arquivos** no servidor de banco.
- **Bypass de WAF/IDS** com scripts de *tamper*.

## Técnicas de injeção suportadas

O SQLMap suporta as seis técnicas representadas pela flag `--technique` (letras `BEUSTQ`):

| Letra | Técnica |
|-------|---------|
| `B` | Boolean-based blind |
| `E` | Error-based |
| `U` | UNION query-based |
| `S` | Stacked queries |
| `T` | Time-based blind |
| `Q` | Inline queries |

## Por que isso importa em Segurança e Teste

SQL injection está historicamente entre as falhas mais críticas do **OWASP Top 10**
(categoria *Injection*). Conhecer ferramentas como o SQLMap ajuda tanto no **teste de
segurança** (encontrar a falha antes do atacante) quanto na **defesa** (entender o ataque
para escrever código resistente — ver mitigação no [roteiro](05-roteiro-apresentacao.md)).

---

➡️ Próximo: [02 — Instalação](02-instalacao.md)
