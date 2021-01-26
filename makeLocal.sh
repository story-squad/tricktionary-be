#!/bin/sh
docker-compose down

# check command line argument
if [ -n "$1" ]; then
   file="docker/Dockerfile.$1"
   if [ -f $file ]; then
      tag="storysquad/$1"
      echo "building $1"
      docker build -f $file -t $tag docker
      exit 0
   fi
fi

# check for storysquad nginx
nginx=`docker image list|grep "storysquad/web"`

if [ $nginx -le 0 ]; then 
   file="docker/Dockerfile.web"
   if [ -f $file ]; then
      tag="storysquad/web"
      echo "building storysquad/web"
      docker build -f $file -t $tag docker
   fi
fi

#!/bin/sh
if [ ! -f .local-env ]; then
   echo "'.local-env' : No such file or directory"
   exit 0
fi

if [ -d pgdata ]; then
   echo "moving pgdata to /tmp"
   sudo mv pgdata /tmp/pgdata
fi

echo "creating build..."
npm run build

if [ -f .local-env ]; then
   echo "copying .local-env as .env"
   cp .local-env build/.env
fi

if [ -d data ]; then
   echo "copying data/ to build"
    cp -r data build
fi

echo "clean package.json for docker image"
sed '/^    \"prebuild\"/d' package.json -- | sed '/^    \"build\"/d' -- | sed '/^    \"prestart\"/d' -- | sed '/^    \"develop\"/d' -- | sed '/^    \"sed\"/d' -- | sed '/^    \"dockerize\"/d' -- |sed '/^    \"zip\"/d' -- | sed '/^    \"zipcurrent\"/d' -- |sed '/^    \"package\"/d' --|sed '/^    \"@types/d' -- |sed 's+build/src/index.js+src/index.js+g' > build/package.json

echo "generate clean package-lock"
cd build && npm install && rm -rf node_modules && cd ..

echo "compressing to current.zip"
npm run zipcurrent

echo "building local docker image"
docker build -f docker/Dockerfile -t storysquad/tricktionary-api .

if [ -d /tmp/pgdata ]; then
   echo "restoring pgdata from /tmp"
   sudo mv /tmp/pgdata .
fi
docker-compose up