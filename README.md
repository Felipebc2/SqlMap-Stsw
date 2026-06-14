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
4. Use o [Roteiro da Apresentação](docs/05-roteiro-apresentacao.md) e a [Cola de Comandos](docs/06-comandos-apresentacao.md) no dia.

## ⚡ Reproduzir a demo rapidamente (Makefile)

Com **Docker** e **sqlmap** instalados, suba o ambiente e rode o ataque completo com:

```bash
make demo     # sobe o DVWA, configura e executa o ataque ponta a ponta
make ui       # abre a interface web da demo (Flask + Next.js) em http://localhost:3000
make help     # lista todos os comandos (up, setup, scan, dump, crack, down, clean)
```

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
