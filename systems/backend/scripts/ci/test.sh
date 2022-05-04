#!/bin/sh

set -ex
export GCLOUD_PROJECT=dummy-project-id

npm run lint:ci
npx tsc
npm run test:ci