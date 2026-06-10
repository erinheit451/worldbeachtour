#!/usr/bin/env bash
# WorldBeachTour deploy — build-on-server, atomic-release.
#
# Architecture:
#   1. rsync site/ source diff → server (small, fast — kilobytes for typical edits)
#   2. ssh trigger /usr/local/bin/wbt-deploy on server, which:
#        - npm ci (only if package-lock changed)
#        - npm run build (~22s on the 16-core Hetzner box)
#        - hardlink-copy out/ → releases/<ts>/  (instant)
#        - atomic symlink swap of /var/www/worldbeachtour/current
#        - nginx reload
#        - prune old releases (keep last 5)
#
# Why this shape:
#   - The 500+ MB build artifact never crosses the wire.
#   - Source rsync is delta-only (KB-MB diffs after first sync).
#   - aes128-gcm@openssh.com cipher is hardware-accelerated → ~8.5 MB/s
#     vs ~1.25 MB/s with default cipher on Windows OpenSSH.
#   - `--partial` + retry loop survives the occasional transatlantic
#     connection drop (Hetzner anti-abuse / NAT / packet loss).
#
# Expected duration: ~25-30s end-to-end. Most of it is `npm run build` on
# the server, which is unavoidable but local to the box.
#
# Rollback: scripts/rollback.sh

set -euo pipefail

HOST="root@178.104.99.176"
WORKSPACE="/opt/worldbeachtour-build/site"
SSH_CIPHER="aes128-gcm@openssh.com"

# On Windows, prefer cwRsync's bundled SSH (Windows OpenSSH has cipher quirks).
if [[ -d "/c/ProgramData/chocolatey/lib/rsync/tools/bin" ]]; then
  export PATH="/c/ProgramData/chocolatey/lib/rsync/tools/bin:${PATH}"
fi

SSH_OPTS=(
  -o ConnectTimeout=15
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=3
  -o UserKnownHostsFile=/dev/null
  -o StrictHostKeyChecking=no
  -c "${SSH_CIPHER}"
)

cd "$(dirname "$0")/.."

T0=$(date +%s)

echo "[1/2] rsync source → ${HOST}:${WORKSPACE}/  (delta only)"
attempts=0
until rsync -rlt --no-owner --no-group --chmod=D755,F644 \
  --partial --info=stats1 \
  --delete \
  --exclude=node_modules --exclude=.next --exclude=out \
  --exclude=.turbo --exclude=.vercel --exclude=.git \
  -e "ssh ${SSH_OPTS[*]}" \
  site/ "${HOST}:${WORKSPACE}/"; do
  attempts=$((attempts + 1))
  if [[ $attempts -ge 10 ]]; then
    echo "rsync failed after $attempts retries — aborting." >&2
    exit 1
  fi
  echo ">>> rsync disconnected, retry $attempts in 3s..." >&2
  sleep 3
done

T1=$(date +%s)
echo "      source synced in $((T1 - T0))s"

echo "[2/2] ssh ${HOST} → wbt-deploy (build + atomic swap)"
# MSYS_NO_PATHCONV=1 prevents Git Bash from mangling /usr/local/bin/... into a Windows path
MSYS_NO_PATHCONV=1 ssh "${SSH_OPTS[@]}" "$HOST" "/usr/local/bin/wbt-deploy"

T2=$(date +%s)
echo ""
echo "✓ deployed in $((T2 - T0))s total"
echo "  verify: https://worldbeachtour.com/"
