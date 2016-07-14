#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

export DISPLAY=:99.0

sh -e /etc/init.d/xvfb start
NODE_ENV=production make build
make server &
sleep 3