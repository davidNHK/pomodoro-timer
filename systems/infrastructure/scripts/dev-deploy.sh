#!/bin/bash

set -e

npm run build
export GOOGLE_CREDENTIALS=$(cat "$HOME/.config/gcloud/productivity-service-account.json")
pulumi stack select davidNHK/pomodoro-timer/development
pulumi up --yes