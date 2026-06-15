# Seminário SQLMap — Segurança e Teste de Software

Material de estudo e apresentação sobre o **[SQLMap](https://github.com/sqlmapproject/sqlmap)**,
ferramenta open source para **detecção e exploração automatizada de SQL injection** e
takeover de bancos de dados. Este repositório organiza o conteúdo teórico, um ambiente
de teste seguro (DVWA via Docker) e o roteiro da apresentação para a matéria de
**Segurança e Teste** da faculdade.

> ⚠️ **Aviso ético e legal**
> O SQLMap só deve ser usado em **sistemas próprios** ou onde você tem **autorização
> formal e por escrito**. Testar sistemas de terceiros sem permissão é crime (no Brasil,
> Lei 12.737/2012 — "Lei Carolina Dieckmann"). Todas as demonstrações deste material são
> feitas contra o **DVWA**, um aplicativo *intencionalmente vulnerável* criado para
> treino legal.

## 📚 Índice

| # | Documento | Descrição |
|---|-----------|-----------|
| — | [REQUISITOS](docs/REQUISITOS.md) | Objetivos, escopo e requisitos do projeto/seminário |
| — | [ROADMAP](docs/ROADMAP.md) | Roadmap de desenvolvimento do material (≈2h) |
| 01 | [Introdução](docs/01-introducao.md) | O que é o SQLMap, utilidades e técnicas suportadas |
| 02 | [Instalação](docs/02-instalacao.md) | Como instalar e validar o SQLMap |
| 03 | [Ambiente de Teste](docs/03-ambiente-de-teste.md) | Subindo o DVWA com Docker para a demo |
| 04 | [Uso e Comandos](docs/04-uso-e-comandos.md) | Comandos, flags e exemplos práticos |
| 05 | [Roteiro da Apresentação](docs/05-roteiro-apresentacao.md) | Script cronometrado do seminário |
| 06 | [Comandos](docs/06-comandos-apresentacao.md) | Comandos prontos para digitar ao vivo na demo |

## 🚀 Começando

1. Leia a [Introdução](docs/01-introducao.md) para entender o que a ferramenta faz.
2. Siga a [Instalação](docs/02-instalacao.md) e o [Ambiente de Teste](docs/03-ambiente-de-teste.md).
3. Pratique com o guia de [Uso e Comandos](docs/04-uso-e-comandos.md).
4. Aplique com os [Comandos](docs/06-comandos-apresentacao.md).

## 🧪 Descrição do exemplo implementado

O exemplo prático deste repositório é uma **demonstração ponta a ponta de SQL injection**
contra o **DVWA** (*Damn Vulnerable Web Application*), executada de forma automatizada:

1. **Sobe** um container Docker com o DVWA (alvo intencionalmente vulnerável).
2. **Configura** o DVWA: cria o banco, faz login com `admin/password` e salva o cookie de sessão.
3. **Ataca** com o SQLMap: detecta a injeção no parâmetro vulnerável e lista os bancos de dados.
4. **Extrai** a tabela `dvwa.users` (usuários e *hashes* de senha) e, opcionalmente, **quebra**
   os hashes por dicionário.

Toda a orquestração fica em um **Makefile** (que chama os scripts em `scripts/`), de modo que
cada etapa pode ser rodada isolada ou de uma vez com `make demo`. A técnica de ataque se
**adapta automaticamente** ao nível de dificuldade do DVWA (veja a tabela mais abaixo). Há ainda
uma **interface web** (Flask + Next.js) que é um wrapper visual sobre os mesmos comandos.

## ⚡ Reproduzir a demo rapidamente (Makefile)

Com **Docker** e **sqlmap** instalados, suba o ambiente e rode o ataque completo com:

```bash
make demo     # sobe o DVWA, configura e executa o ataque ponta a ponta
make ui       # abre a interface web da demo (Flask + Next.js) em http://localhost:3000
make help     # lista todos os comandos disponíveis
```

### Comandos `make` disponíveis

| Comando | O que faz |
|---------|-----------|
| `make help` | Lista todos os comandos disponíveis (gerado automaticamente a partir do Makefile). |
| `make up` | Sobe o container Docker do DVWA (`vulnerables/web-dvwa`) na porta 80 e aguarda ele ficar pronto. |
| `make setup` | Cria o banco do DVWA, faz login com `admin/password` e salva o cookie de sessão em `.dvwa-cookie`. |
| `make scan` | Roda o SQLMap para **detectar a injeção** e listar os bancos de dados (`--dbs --flush-session`). |
| `make dump` | **Extrai** a tabela `dvwa.users` (usuários e hashes de senha). |
| `make crack` | Extrai a tabela `users` e ainda **quebra os hashes** de senha por dicionário (`--answers="crack=Y"`). |
| `make level LEVEL=<nível>` | Troca a dificuldade do DVWA. Aceita `low`, `medium`, `high` ou `impossible` (requer `make setup` antes). |
| `make demo` | **Fluxo completo**: encadeia `up → setup → scan → dump` num único comando. |
| `make ui` | Sobe a **interface web** (backend Flask + frontend Next.js) em `http://localhost:3000`. |
| `make ui-down` | Para a interface web (encerra os processos do Flask e do Next.js). |
| `make down` | Para e remove o container do DVWA. |
| `make clean` | Faz `down` + `ui-down` e remove os artefatos gerados (cookie e saída do SQLMap). |

> A interface web (`make ui`) é um wrapper sobre os mesmos comandos `make`: botões
> para cada etapa, saída do SQLMap ao vivo e um seletor de dificuldade do DVWA.
> Backend em **Flask** (`backend/`) e frontend em **Next.js** (`web/`).

### Dificuldade do DVWA e técnica de ataque

Troque o nível com `make level LEVEL=<low|medium|high|impossible>`. Os alvos `scan`,
`dump` e `crack` **adaptam a técnica automaticamente** ao nível atual (lógica em
`scripts/sqlmap-attack.sh`):

| Nível | Como o `id` chega ao servidor | Técnica do SQLMap |
|-------|-------------------------------|-------------------|
| **low** | `GET` direto | injeção comum no parâmetro `id` |
| **medium** | `POST` (dropdown + `mysqli_real_escape_string`) | injeção **numérica** via `--data` (o escape não protege número) |
| **high** | `POST` em `session-input.php`, resultado em `index.php` | injeção de **segundo grau** via `--second-url` |
| **impossible** | consulta preparada (prepared statement) | **bloqueado** — serve para mostrar a mitigação correta |

Ou seja: `make level LEVEL=medium && make crack` extrai e quebra as senhas mesmo no
medium; o mesmo vale para o high. O `impossible` é o contraponto de defesa.
