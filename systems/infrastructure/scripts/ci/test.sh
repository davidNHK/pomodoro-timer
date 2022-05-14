#!/bin/sh

set -ex

npm run lint:ci
npx tsc
npm run test
npm run build
pulumi stack select davidNHK/pomodoro-timer/production
pulumi preview