# Roadmap de Desenvolvimento (≈2h)

Plano enxuto para produzir todo o material do seminário em até **2 horas**, dividido em
blocos cronometrados. Cada bloco gera um ou mais arquivos `.md`.

## Visão geral

| Bloco | Tempo | Entrega |
|-------|-------|---------|
| 0 | 15 min | Organizar o GitHub (estrutura + README) |
| 1 | 20 min | `REQUISITOS.md` |
| 2 | 40 min | Guias de conteúdo (introdução, instalação, comandos) |
| 3 | 30 min | Ambiente de teste (DVWA via Docker) |
| 4 | 15 min | Roteiro da apresentação |
| 5 | 10 min | Revisão final e fechamento |
| **Total** | **≈2h10** | Material completo |

## Detalhamento

### Bloco 0 — Organizar o GitHub (15 min)
- Criar a pasta `docs/`.
- Reescrever o `README.md` como capa: título, resumo, aviso legal e índice com links.
- **Saída:** estrutura navegável pronta para receber conteúdo.

### Bloco 1 — Requisitos (20 min)
- Escrever `docs/REQUISITOS.md`: objetivo, escopo, requisitos, entregáveis, restrições.

### Bloco 2 — Conteúdo principal (40 min)
- `docs/01-introducao.md`: o que é SQLi, o que o SQLMap faz, técnicas suportadas.
- `docs/02-instalacao.md`: instalação e validação.
- `docs/04-uso-e-comandos.md`: comandos e flags com exemplos.

### Bloco 3 — Ambiente de teste (30 min)
- `docs/03-ambiente-de-teste.md`: subir DVWA com Docker, configurar, achar o endpoint
  vulnerável e rodar o SQLMap até o dump.

### Bloco 4 — Apresentação (15 min)
- `docs/05-roteiro-apresentacao.md`: roteiro cronometrado + pontos de fala.

### Bloco 5 — Revisão e fechamento (10 min)
- Rodar revisão final: índice coerente e links válidos.

## Definição de pronto (DoD)
- [ ] Estrutura de pastas criada.
- [ ] README com índice funcional.
- [ ] Guias 01–05 escritos com exemplos.
- [ ] Ambiente de teste documentado e reproduzível.
- [ ] Roteiro cabe no tempo da apresentação.
- [ ] Aviso ético/legal presente.
