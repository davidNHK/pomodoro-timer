#!/usr/bin/env bash

set -e

npm run build
~/.pulumi/bin/pulumi stack select davidNHK/pomodoro-timer/production
~/.pulumi/bin/pulumi up --yes