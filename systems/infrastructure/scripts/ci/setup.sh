#!/bin/sh

set -ex

curl -fsSL https://get.pulumi.com | sh
echo "$HOME/.pulumi/bin" >> "$GITHUB_PATH"
"$HOME/.pulumi/bin/pulumi" login
npm install
