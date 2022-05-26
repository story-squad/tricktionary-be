#!/bin/env sh

# copy all the README file from the src/api folders to our docusaurus docs folder
for foo in $(ls src/api/*/README.md); do 
  bar=$(echo "$foo"|tr "/" "-"|sed 's/-README//g');
  cp "$foo" "trex/docs/tricktionary/$bar"; done

# update the markdown links in our README file
content=$(cat README.md|sed 's#src/api/#src-api-#g');
header="---
id: about
title: About Tricktionary
sidebar_label: Tricktionary
slug: /tricktionary/README
---
"
echo "$header" > trex/docs/tricktionary/README.md
echo "$content" >> trex/docs/tricktionary/README.md


cp -rp gifs/* trex/static/img
rm -rf trex/docs/api

footer="![img](../../static/img/Node.js_logo_2015.svg)


***Node.js 12 running on 64bit Amazon Linux 2/5.2.5***

"
cp EB-README.md trex/docs/tricktionary/EB-README.mdx
echo "$footer" >> trex/docs/tricktionary/EB-README.mdx
