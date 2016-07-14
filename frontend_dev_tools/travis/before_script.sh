#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

export CHROME_BIN=chromium-browser
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start