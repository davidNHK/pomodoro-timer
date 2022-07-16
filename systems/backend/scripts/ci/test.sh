#! /usr/bin/env bash

set -ex


# https://github.com/firebase/firebase-admin-node/issues/1703
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/scripts/dummy-gcp-credentials.json"
export GCLOUD_PROJECT=dummy-project-id
export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
export APP_ENV=test
docker-compose up -d
npm run test:ci
docker-compose kill
