#!/bin/sh

set -e

pulumi --cwd ../infrastructure stack select davidNHK/pomodoro-timer/production

pulumi --cwd ../infrastructure stack output --json > ./src/environments/dynamic.json
GCP_REGION=$(pulumi --cwd ../infrastructure config get gcp:region)
IMAGE_REGISTRY=$(pulumi --cwd ../infrastructure stack output ARTIFACT_REGISTRY_URL)
IMAGE_NAME="$IMAGE_REGISTRY/pomodoro-timer-frontend:${GITHUB_SHA:-latest}"
CLOUD_RUN_NAME=$(pulumi --cwd ../infrastructure stack output CLOUD_RUN_FRONTEND_NAME)
gcloud auth configure-docker "$GCP_REGION-docker.pkg.dev"

docker build -t "$IMAGE_NAME" .
docker push "$IMAGE_NAME"

gcloud run deploy "$CLOUD_RUN_NAME" \
  --allow-unauthenticated \
  --image="$IMAGE_NAME" \
  --region="$GCP_REGION"
