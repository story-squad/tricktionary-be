#!/bin/sh

if [ -d pgdata ]; then
   echo "moving pgdata to /tmp"
   sudo mv pgdata /tmp/pgdata
fi
echo "creating build..."
npm run build

if [ -f .env ]; then
   echo "copying .env to build"
   cp .env build
fi

if [ -d data ]; then
   echo "copying data/ to build"
    cp -r data build
fi

echo "clean package.json for docker image"
sed '/^    \"prebuild\"/d' package.json -- | sed '/^    \"build\"/d' -- | sed '/^    \"prestart\"/d' -- | sed '/^    \"develop\"/d' -- | sed '/^    \"sed\"/d' -- | sed '/^    \"dockerize\"/d' -- |sed '/^    \"zip\"/d' -- | sed '/^    \"zipcurrent\"/d' -- |sed '/^    \"aws-docker\"/d' -- |sed '/^    \"package\"/d' --|sed '/^    \"@types/d' -- |sed 's+build/src/index.js+src/index.js+g' > build/package.json

echo "generate clean package-lock"
cd build && npm install && rm -rf node_modules && cd ..

echo "compressing to current.zip"
npm run zipcurrent

echo "building docker image"
docker build -t storysquad/aws-tricktionary-api .

echo "tagging image"
docker tag storysquad/aws-tricktionary-api trevorjmartin/storysquad-tricktionary-api

echo "pushing to cloud"
docker push trevorjmartin/storysquad-tricktionary-api

if [ -d /tmp/pgdata ]; then
   echo "restoring pgdata from /tmp"
   sudo mv /tmp/pgdata .
fi

