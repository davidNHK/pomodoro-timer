#!/bin/sh

set -ex

npm run lint:ci
npx tsc

docker compose -f docker-compose-test.yml up --build --exit-code-from app --abort-on-container-exit