#!/bin/sh

set -ex
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

npm run lint
npx tsc
npm run test:ci
