#!/usr/bin/env bash

set -e

npm run build
gcloud auth configure-docker
pulumi stack select davidNHK/pomodoro-timer/production
pulumi up --yes