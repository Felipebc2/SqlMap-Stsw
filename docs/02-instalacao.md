# 02 — Instalação do SQLMap

O SQLMap é escrito em **Python** e não exige compilação. Funciona em Linux, Windows e
macOS, com Python 2.6+ ou **Python 3.x** (recomendado).

## Pré-requisitos

- **Python 3.x** instalado (`python3 --version`).
- **git** (para clonar o repositório oficial).

## Opção 1 — Clonar o repositório oficial (recomendado)

É a forma indicada pelo projeto, pois facilita atualizar com `git pull`:

```bash
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git sqlmap-dev
cd sqlmap-dev
python sqlmap.py --version
```

Saída esperada: a versão do SQLMap (ex.: `1.8.x`).

Para ver a ajuda completa de todas as flags:

```bash
python sqlmap.py -hh
```

## Opção 2 — Via gerenciador de pacotes (Kali/Debian/Ubuntu)

Distribuições voltadas a pentest já trazem o SQLMap:

```bash
sudo apt update && sudo apt install sqlmap
sqlmap --version
```

> Observação: a versão dos repositórios pode estar mais antiga que a do GitHub.

## Opção 3 — Via pip

```bash
pip install sqlmap
sqlmap --version
```

## Validando a instalação

Independentemente do método, confirme que o comando responde:

```bash
sqlmap --version          # se instalado via apt/pip
python sqlmap.py --version  # se rodando a partir do clone
```

## Atualizando

```bash
# A partir do clone do git
cd sqlmap-dev && git pull

# Ou usando a própria ferramenta
python sqlmap.py --update
```

## Dica para a demo

Mantenha o SQLMap e o ambiente de teste ([DVWA](03-ambiente-de-teste.md)) na **mesma
máquina** (ou rede local) para evitar problemas de conectividade durante a apresentação.

---

⬅️ Anterior: [01 — Introdução](01-introducao.md) | ➡️ Próximo: [03 — Ambiente de Teste](03-ambiente-de-teste.md)
