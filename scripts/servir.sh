#!/usr/bin/env bash
# Compila e sobe o app em http://localhost:8766 para a bateria de testes (para o servidor anterior antes).
cd "$(dirname "$0")/.."
P=$(ss -ltnp 2>/dev/null | grep ':8766 ' | grep -o 'pid=[0-9]*' | cut -d= -f2 | head -1)
[ -n "$P" ] && kill "$P" && sleep 1
pnpm build 2>&1 | grep -E "rror|Compiled|Failed" || exit 1
(nohup pnpm start -p 8766 > /tmp/traxium-8766.log 2>&1 &)
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}" http://localhost:8766/hoje | grep -q 200 && echo "no ar: http://localhost:8766" && exit 0; sleep 1; done
echo "o servidor não subiu: veja /tmp/traxium-8766.log"; exit 1
