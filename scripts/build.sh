#!/bin/sh
# Compile the TypeScript sources into dist/ and copy the knex data files.
# Stops at the first failing step, so a type error fails the build.
set -e

if [ -d dist ]; then
   echo "removing old dist"
   rm -rf dist
fi

echo "transpiling..."
tsc

if [ -d data ]; then
   echo "copying data to dist"
   cp -r data dist
fi
echo "done"
