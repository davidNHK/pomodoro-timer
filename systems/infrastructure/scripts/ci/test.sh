#!/bin/sh

set -ex

npm run lint:ci
npx tsc
npm run test
~/.pulumi/bin/pulumi stack select davidNHK/pomodoro-timer/production
~/.pulumi/bin/pulumi preview