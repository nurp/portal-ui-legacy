#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker build -t portal-ui-legacy .

# If this is not a pull request, update the branch's docker tag.
if [ $TRAVIS_PULL_REQUEST = 'false' ]; then
  docker tag portal-ui-legacy quay.io/ncigdc/portal-ui-legacy:${TRAVIS_BRANCH/\//_} \
    && docker push quay.io/ncigdc/portal-ui-legacy:${TRAVIS_BRANCH/\//_};

  # If this commit has a tag, use on the registry too.
  if ! test -z $TRAVIS_TAG; then
    docker tag portal-ui-legacy quay.io/ncigdc/portal-ui-legacy:${TRAVIS_TAG} \
      && docker push quay.io/ncigdc/portal-ui-legacy:${TRAVIS_TAG};
  fi
fi
