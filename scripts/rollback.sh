#!/usr/bin/env bash
# Roll back to the previous release on Hetzner.
#
# Flips the `current` symlink to the second-most-recent release in releases/
# and reloads nginx. Instant. Safe to run repeatedly (each invocation rolls
# back one more step).

set -euo pipefail

HOST="root@178.104.99.176"
ROOT="/var/www/worldbeachtour"

if [[ -d "/c/ProgramData/chocolatey/lib/rsync/tools/bin" ]]; then
  export PATH="/c/ProgramData/chocolatey/lib/rsync/tools/bin:${PATH}"
fi

SSH_OPTS=(
  -o ConnectTimeout=15
  -o UserKnownHostsFile=/dev/null
  -o StrictHostKeyChecking=no
  -c aes128-gcm@openssh.com
)

ssh "${SSH_OPTS[@]}" "$HOST" "bash -s" <<EOF
set -e
cd '${ROOT}/releases'
current_target=\$(basename "\$(readlink '${ROOT}/current')")
prev=\$(ls -1t | grep -v "^\${current_target}\$" | head -1)
if [[ -z "\${prev}" ]]; then
  echo 'No previous release available.' >&2
  exit 1
fi
ln -sfn "${ROOT}/releases/\${prev}" "${ROOT}/current.new"
mv -Tf "${ROOT}/current.new" "${ROOT}/current"
nginx -t >/dev/null 2>&1 && systemctl reload nginx
echo "rolled back: \${current_target} → \${prev}"
EOF

echo ""
echo "✓ verify: https://worldbeachtour.com/"
