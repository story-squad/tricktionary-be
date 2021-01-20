#!/bin/sh
docker-compose down
if [ -d pgdata ]; then
   echo "moving pgdata to /tmp"
   sudo mv pgdata /tmp/pgdata
fi
echo "creating local build..."
npm run dockerize

if [ -d /tmp/pgdata ]; then
   echo "restoring pgdata from /tmp"
   sudo mv /tmp/pgdata .
fi
docker-compose up -d