#!/bin/sh
set -e

cd "$(dirname "$0")"

PRISMA_VERSION=latest

npx --yes prisma@$PRISMA_VERSION migrate deploy

node src/main
