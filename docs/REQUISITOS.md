# Requisitos do Projeto

Documento de requisitos do **material de seminário sobre o SQLMap**.

## 1. Objetivo

Produzir um material didático que permita **apresentar o SQLMap** para a turma de
Segurança e Teste: explicar o que a ferramenta faz, demonstrar seu uso em um ambiente
controlado e discutir como **se defender** desse tipo de ataque.

## 2. Público-alvo

- Colegas de turma e professor(a) da matéria de Segurança e Teste de Software.
- Conhecimento prévio assumido: noções básicas de SQL, HTTP e linha de comando.

## 3. Escopo

**Inclui:**
- Conceito de SQL injection e papel do SQLMap.
- Instalação da ferramenta.
- Ambiente de teste vulnerável (DVWA) documentado.
- Comandos e flags essenciais com exemplos.
- Roteiro de apresentação e seção de mitigação/defesa.

**Não inclui:**
- Exploração de sistemas reais ou de terceiros.
- Cobertura exaustiva de todas as flags do SQLMap (foco nas mais usadas).
- Código executável próprio — o repositório contém **apenas arquivos `.md`**.

## 4. Requisitos do material (funcionais)

| ID | Requisito |
|----|-----------|
| RF01 | Explicar o que é SQL injection e os tipos principais |
| RF02 | Apresentar o SQLMap: o que faz e suas utilidades |
| RF03 | Documentar a instalação da ferramenta |
| RF04 | Documentar como subir um ambiente de teste seguro (DVWA via Docker) |
| RF05 | Listar comandos/flags essenciais com exemplos práticos |
| RF06 | Trazer uma demonstração reproduzível (do alvo ao dump de dados) |
| RF07 | Abordar mitigação/defesa contra SQL injection |
| RF08 | Fornecer um roteiro cronometrado para a apresentação |

## 5. Requisitos técnicos da demonstração

> Necessários apenas para *reproduzir* a demo ao vivo — não para criar o material.

- **Docker** instalado (para subir o DVWA).
- **Python 3.x** (para executar o SQLMap).
- **SQLMap** (clone do repositório oficial).
- Navegador web (para configurar o DVWA e capturar cookies de sessão).

## 6. Entregáveis

- `README.md` (capa + índice).
- `docs/` com os guias 01–05, além de `REQUISITOS.md` e `ROADMAP.md`.

## 7. Restrições

- **Somente arquivos `.md`** (nenhum código executável é versionado).
- **Uso ético/autorizado**: demonstrações apenas em ambiente próprio e intencionalmente
  vulnerável (DVWA).
- **Tempo de produção**: material simples, concluível em até **2 horas** (ver
  [ROADMAP](ROADMAP.md)).

## 8. Critérios de aceitação

- Todos os links do índice do README resolvem para arquivos existentes.
- Cada guia contém exemplos de comando em blocos de código.
- O aviso ético/legal aparece no README e no guia do ambiente de teste.
- O roteiro cabe no tempo previsto da apresentação.
