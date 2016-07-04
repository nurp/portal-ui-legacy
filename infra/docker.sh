#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker build -t deploybot-client .

# If this is not a pull request, update the branch's docker tag.
if [ $TRAVIS_PULL_REQUEST = 'false' ]; then
  docker tag deploybot-client quay.io/ncigdc/deploybot:client \
    && docker push quay.io/ncigdc/deploybot:client;
fi
