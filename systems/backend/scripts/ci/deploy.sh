#!/bin/sh

set -e

pulumi --cwd ../infrastructure stack select davidNHK/pomodoro-timer/production

GCP_REGION=$(pulumi --cwd ../infrastructure config get gcp:region)
IMAGE_REGISTRY=$(pulumi --cwd ../infrastructure stack output ARTIFACT_REGISTRY_URL)
IMAGE_NAME="$IMAGE_REGISTRY/pomodoro-timer-backend:${GITHUB_SHA:-latest}"
CLOUD_RUN_NAME=$(pulumi --cwd ../infrastructure stack output CLOUD_RUN_BACKEND_NAME)
CLOUD_RUN_FRONTEND_RUL=$(pulumi --cwd ../infrastructure stack output CLOUD_RUN_FRONTEND_RUL)
CLOUD_RUN_BACKEND_URL=$(pulumi --cwd ../infrastructure stack output CLOUD_RUN_BACKEND_URL)
gcloud auth configure-docker "$GCP_REGION-docker.pkg.dev"

docker build -t "$IMAGE_NAME" .
docker push "$IMAGE_NAME"

gcloud run deploy "$CLOUD_RUN_NAME" \
  --allow-unauthenticated \
  --image="$IMAGE_NAME" \
  --region="$GCP_REGION" \
  --command="npm" \
  --args='start:prod' \
  --update-env-vars='APP_PORT=5000' \
  --update-env-vars='APP_ENV=production' \
  --update-env-vars="FRONTEND_ORIGIN=$CLOUD_RUN_FRONTEND_RUL" \
  --update-env-vars="BACKEND_ORIGIN=$CLOUD_RUN_BACKEND_URL" \
  --update-env-vars="CONNECTOR_ATLASSIAN_CLIENT_ID=$CONNECTOR_ATLASSIAN_CLIENT_ID" \
  --update-env-vars="CONNECTOR_ATLASSIAN_CLIENT_SECRET=$CONNECTOR_ATLASSIAN_CLIENT_SECRET"