#!/usr/bin/env bash

set -e

npm run build
pulumi stack select davidNHK/pomodoro-timer/production
GCP_REGION=$(pulumi config get gcp:region)
gcloud auth configure-docker "$GCP_REGION-docker.pkg.dev"
pulumi up --yes