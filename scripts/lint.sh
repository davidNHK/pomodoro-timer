#!/usr/bin/env bash

set -ex

npx lint-staged --allow-empty
npx eslint --ext .json,.yaml,.yml,.ts,.js --ignore-pattern '!.github/' --ignore-pattern systems/ --ignore-pattern package-lock.json .