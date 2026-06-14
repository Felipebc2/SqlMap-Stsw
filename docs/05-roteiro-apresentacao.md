# 05 — Roteiro da Apresentação

Roteiro cronometrado para um seminário de **~20 minutos + perguntas**. Ajuste os tempos
conforme a duração pedida pelo(a) professor(a).

## Antes de começar (checklist)

- [ ] DVWA rodando em `http://localhost` (ver [ambiente de teste](03-ambiente-de-teste.md)).
- [ ] Banco do DVWA criado e nível de segurança em **Low**.
- [ ] Cookie de sessão (`PHPSESSID` + `security`) já copiado.
- [ ] Comandos do SQLMap prontos em um arquivo de texto para copiar/colar.
- [ ] Terminal com fonte grande e tema legível no projetor.

## Estrutura (≈10 min)

### 1. O problema: SQL Injection (2 min)
- O que é SQLi, com o exemplo de código vulnerável (ver [introdução](01-introducao.md)).
- Tipos principais (error-based, UNION, blind boolean/time-based).
- Contexto: posição da *Injection* no OWASP Top 10.

### 2. A ferramenta: SQLMap (2 min)
- O que é e por que automatizar.
- Principais utilidades: detecção, fingerprint, enumeração, dump, `--os-shell`,
  bypass de WAF.
- Técnicas suportadas (`--technique BEUSTQ`).

### 3. Demonstração ao vivo (5 min) — ⭐ ponto alto
Sequência sugerida (use `-v 3` para mostrar os payloads):

1. Mostrar o DVWA e o parâmetro vulnerável no navegador.
2. `--dbs` → detecção + lista de bancos.
3. `-D dvwa --tables` → tabelas.
4. `-D dvwa -T users --dump` → extrair usuários e **quebrar os hashes**.
5. (Se der tempo) trocar o DVWA para **Impossible** e mostrar o ataque **falhando**.

> Plano B: se a internet/projeção falhar, tenha **prints** da execução salvos.

Como evitar SQLi no código:
- **Queries parametrizadas / prepared statements** (a defesa principal).
- **ORM** com binding de parâmetros.
- **Validação e sanitização** de entrada (allowlist).
- **Princípio do menor privilégio** no usuário do banco.
- **WAF** como camada extra (não substitui código seguro).
- Mostrar que o nível **Impossible** do DVWA usa query parametrizada.

### 6. Conclusão (1 min)
- SQLMap é poderoso para teste **e** para entender o ataque.
- Reforço ético: só com autorização.
- Frase de efeito de fechamento.
