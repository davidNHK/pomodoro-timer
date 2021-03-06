#!/bin/sh

set -e

# https://github.com/firebase/firebase-admin-node/issues/1703
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/scripts/dummy-gcp-credentials.json"
export APP_ENV=development
npm run start:dev