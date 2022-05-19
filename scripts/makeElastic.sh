#!/bin/sh
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
