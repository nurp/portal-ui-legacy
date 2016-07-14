#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

sh -e <(curl -s https://codecov.io/bash)
sh -e ./docker_upload.sh