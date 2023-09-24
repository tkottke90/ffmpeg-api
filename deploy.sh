#! /bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

if [ ! command jq ]; then
  apt-get install jq
fi

# Backend
cd backend
API_IMAGE="ghcr.io/tkottke90/ffmpeg-api:$GITHUB_REF_NAME"

docker build \
  -t $API_IMAGE \
  --build-arg \"COMMIT=$(git rev-parse HEAD)\" \
  --build-arg \"BRANCH=$(git rev-parse --abbrev-ref HEAD)\"  \
  .

docker push $API_IMAGE

# Frontend
# (cd frontend && npm install && npm run build)
# docker build \
#   -f FrontendDockerfile \
#   -t $UI_IMAGE \
#   --build-arg \"COMMIT=$(git rev-parse HEAD)\" \
#   --build-arg \"BRANCH=$(git rev-parse --abbrev-ref HEAD)\"  \
#   .

# docker push $UI_IMAGE