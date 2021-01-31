#!/bin/sh
if [ -d build ]; then
   echo "removing old build"
   rm -rf build
fi

echo "transpiling..."
tsc

if [ -f .env ]; then
   echo "copying .env to build"
   cp .env build
fi

if [ -d data ]; then
   echo "copying data to build"
    cp -r data build
fi
echo "done"
