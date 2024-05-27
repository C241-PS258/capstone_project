#!/bin/sh

echo "Seed Database"
yarn prisma db seed

echo "Generate Database"
yarn prisma generate

echo "Migration Database"
yarn prisma migrate deploy

echo "Start Server Dev"
yarn start:dev