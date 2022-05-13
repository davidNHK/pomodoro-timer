#!/bin/sh

set -ex

npm run lint:ci
npx tsc
npm run test
npm run build
~/.pulumi/bin/pulumi stack select davidNHK/pomodoro-timer/production
~/.pulumi/bin/pulumi preview