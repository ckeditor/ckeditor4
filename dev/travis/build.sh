#!/bin/bash
# Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Build CKEditor on Travis CI for testing.

BRANCH=$1

# Clone and setup ckeditor4-presets repository.
cd ..
git clone https://github.com/ckeditor/ckeditor4-presets.git
cd ckeditor4-presets
git fetch --all
git checkout $BRANCH
git reset --hard origin/$BRANCH

# Remove ckeditor4 submodule as the local one will be used.
git submodule deinit ckeditor
git rm ckeditor

# Update submodule paths to use HTTPS instead of SSH.
sed -i "s/git\@/https:\/\//g" .gitmodules
sed -i "s/com:/com\//g" .gitmodules

# Init submodules.
git submodule update --init

# Link to ckeditor4 repository which triggered the build.
rm -rf ckeditor
ln -s ../ckeditor4/ ckeditor

# Build full preset.
./build.sh full all -t
cd "./build/$(ls -1t ./build/ | head -n 1)/full-all/ckeditor/"

# Copy bender.ci.js file as it is removed during build.
cp ../../../../../ckeditor4/bender.ci.js bender.ci.js
