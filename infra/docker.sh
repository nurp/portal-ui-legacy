#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker build -t deploybot-ui .

# If this is not a pull request, update the branch's docker tag.
if [ $TRAVIS_PULL_REQUEST = 'false' ]; then
  docker tag deploybot-ui quay.io/ncigdc/deploybot-ui:${TRAVIS_BRANCH/\//-} \
    && docker push quay.io/ncigdc/deploybot-ui:${TRAVIS_BRANCH/\//-};

  if [ $TRAVIS_BRANCH = 'develop' ]; then
    docker tag deploybot-ui quay.io/ncigdc/deploybot-ui:latest \
      && docker push quay.io/ncigdc/deploybot-ui:latest;
  fi

  if [ $TRAVIS_BRANCH = 'master' ]; then
    docker tag deploybot-ui quay.io/ncigdc/deploybot-ui:stable \
      && docker push quay.io/ncigdc/deploybot-ui:stable;
  fi

  # If this commit has a tag, use on the registry too.
  if ! test -z $TRAVIS_TAG; then
    docker tag deploybot-ui quay.io/ncigdc/deploybot-ui:${TRAVIS_TAG} \
      && docker push quay.io/ncigdc/deploybot-ui:${TRAVIS_TAG};
  fi
fi
