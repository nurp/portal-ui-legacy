#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

bash <(curl -s https://codecov.io/bash)
bash ./docker_upload.sh