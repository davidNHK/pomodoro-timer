#!/bin/sh

set -ex

npm run lint
npm run test:ci
npm run build
