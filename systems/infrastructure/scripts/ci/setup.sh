#!/bin/sh

set -ex

curl -fsSL https://get.pulumi.com | sh
~/.pulumi/bin/pulumi login
npm install
