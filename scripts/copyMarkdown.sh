#/bin/env sh

# copy all the README file from the src/api folders to our docusaurus docs folder
for foo in $(ls src/api/*/README.md); do 
  bar=$(echo "$foo"|tr "/" "-"|sed 's/-README//g');
  cp "$foo" "trex/docs/tricktionary/$bar"; done

# update the markdown links in our README file
content=$(cat README.md|sed 's#src/api/#src-api-#g');
header="---
id: README
title: Getting Started
sidebar_label: Getting Started
slug: /tricktionary/README
---
"
echo "$header" > trex/docs/tricktionary/README.md
echo "$content" >> trex/docs/tricktionary/README.md
cp EB-README.md trex/docs/tricktionary
cp -rp gifs trex/docs/tricktionary
rm -rf trex/docs/api

