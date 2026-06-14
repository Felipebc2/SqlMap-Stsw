#!/usr/bin/env python3
"""
Backend da interface web da demo do SQLMap.

E um wrapper fino sobre o Makefile: cada endpoint apenas dispara um `make`
target ja existente e transmite a saida. Toda a logica de ataque continua no
Makefile/scripts -- aqui nao ha nada novo de SQL injection.

Endpoints:
  GET /api/status          -> JSON {container_up, cookie_present, level}
  GET /api/run/<target>    -> SSE com a saida ao vivo de `make <target>`
  GET /api/level/<level>   -> JSON {ok, message} apos `make level LEVEL=<level>`

Roda so em 127.0.0.1:5000. Os alvos sao validados por whitelist (sem
interpolacao de input livre na shell).
"""
from pathlib import Path
import subprocess

from flask import Flask, Response, jsonify

# Raiz do repositorio (onde fica o Makefile): pai da pasta backend/.
ROOT = Path(__file__).resolve().parent.parent
COOKIE_FILE = ROOT / ".dvwa-cookie"

# Alvos do Makefile que a UI pode disparar (espelha o .PHONY do Makefile).
ALLOWED_TARGETS = {"up", "setup", "scan", "dump", "crack", "demo", "down", "clean"}
# Niveis de seguranca validos do DVWA (espelha o target `level` do Makefile).
ALLOWED_LEVELS = {"low", "medium", "high", "impossible"}

app = Flask(__name__)


@app.after_request
def allow_cors(resp):
    # Demo local: o frontend (Next em :3000) chama este backend (:5000) direto.
    # EventSource/fetch GET sao "simple requests", entao basta este header.
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


def _current_level():
    """Le o nivel atual do cookie (security=<x>), ou None se nao houver."""
    if not COOKIE_FILE.exists():
        return None
    text = COOKIE_FILE.read_text()
    for part in text.replace("\n", ";").split(";"):
        part = part.strip()
        if part.startswith("security="):
            return part.split("=", 1)[1].strip()
    return None


def _container_up():
    try:
        out = subprocess.run(
            ["docker", "ps", "--filter", "name=dvwa", "--format", "{{.Names}}"],
            cwd=ROOT, capture_output=True, text=True, timeout=10,
        )
        return "dvwa" in out.stdout.split()
    except Exception:
        return False


@app.get("/api/status")
def status():
    return jsonify(
        container_up=_container_up(),
        cookie_present=COOKIE_FILE.exists(),
        level=_current_level(),
    )


def _stream_make(*make_args):
    """Generator SSE: roda `make` line-buffered e emite cada linha como evento."""
    # stdbuf -oL forca saida line-buffered; sem isso o sqlmap bufferiza e a
    # saida so apareceria toda de uma vez no fim.
    proc = subprocess.Popen(
        ["stdbuf", "-oL", "-eL", "make", *make_args],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    try:
        for line in iter(proc.stdout.readline, ""):
            yield f"data: {line.rstrip(chr(10))}\n\n"
        proc.wait()
        yield f"event: end\ndata: {proc.returncode}\n\n"
    finally:
        # Cliente desconectou (fechou a aba / clicou em outro comando): mata o make.
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()


def _sse(generator):
    return Response(
        generator,
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@app.get("/api/run/<target>")
def run(target):
    if target not in ALLOWED_TARGETS:
        return jsonify(error=f"alvo invalido: {target!r}"), 400
    return _sse(_stream_make(target))


@app.get("/api/level/<level>")
def level(level):
    if level not in ALLOWED_LEVELS:
        return jsonify(ok=False, message=f"nivel invalido: {level!r}"), 400
    out = subprocess.run(
        ["make", "level", f"LEVEL={level}"],
        cwd=ROOT, capture_output=True, text=True,
    )
    message = (out.stdout + out.stderr).strip()
    return jsonify(ok=out.returncode == 0, message=message)


if __name__ == "__main__":
    # threaded=True: responde /api/status enquanto um comando faz streaming.
    app.run(host="127.0.0.1", port=5000, threaded=True, debug=False)
