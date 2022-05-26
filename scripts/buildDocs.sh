#!/bin/env sh
case "$OSTYPE" in
  darwin*)  echo "OSX" ;;
  linux*)   echo "LINUX";
            cd trex && npm run build && mv build ../dist/src/docs && cd ..
            ;;
  msys*)    echo "WINDOWS";
            cd trex && npm.cmd run build && mv build ../dist/src/docs && cd ..
            ;;
  *)        echo "unknown: $OSTYPE" ;;
esac


