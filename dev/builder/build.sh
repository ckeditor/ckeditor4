#!/bin/bash
# Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or http://ckeditor.com/license

# Build CKEditor using the default settings (and build.js)

set -e

echo "CKBuilder - Builds a release version of ckeditor-dev."
echo ""

CKBUILDER_VERSION="2.0.1"
CKBUILDER_URL="http://download.cksource.com/CKBuilder/$CKBUILDER_VERSION/ckbuilder.jar"

PROGNAME=$(basename $0)
MSG_UPDATE_FAILED="Warning: The attempt to update ckbuilder.jar failed. The existing file will be used."
MSG_DOWNLOAD_FAILED="It was not possible to download ckbuilder.jar"
ARGS=" $@ "

function error_exit
{
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
	exit 1
}

function command_exists
{
	command -v "$1" > /dev/null 2>&1;
}

# Move to the script directory.
cd $(dirname $0)

# Download/update ckbuilder.jar
mkdir -p ckbuilder/$CKBUILDER_VERSION
cd ckbuilder/$CKBUILDER_VERSION
if [ -f ckbuilder.jar ]; then
	echo "Checking/Updating CKBuilder..."
	if command_exists curl ; then
	curl -O -R -z ckbuilder.jar $CKBUILDER_URL || echo "$MSG_UPDATE_FAILED"
	else
	wget -N $CKBUILDER_URL || echo "$MSG_UPDATE_FAILED"
	fi
else
	echo "Downloading CKBuilder..."
	if command_exists curl ; then
	curl -O -R $CKBUILDER_URL || error_exit "$MSG_DOWNLOAD_FAILED"
	else
	wget -N $CKBUILDER_URL || error_exit "$MSG_DOWNLOAD_FAILED"
	fi
fi
cd ../..

# Run the builder.
echo ""
echo "Starting CKBuilder..."

JAVA_ARGS=${ARGS// -t / } # Remove -t from arrgs

VERSION="4.4.5 DEV"
REVISION=$(git rev-parse --verify --short HEAD)
SEMVER_REGEX="^([0-9]+)\.([0-9]+)\.([0-9]+)(\-[0-9A-Za-z-]+)?(\+[0-9A-Za-z-]+)?$"

# Get version number from tag (if available and follows semantic versioning principles).
# Use 2>/dev/null to block "fatal: no tag exactly matches", true is needed because of "set -e".
TAG=$(git symbolic-ref -q --short HEAD || git describe --tags --exact-match 2>/dev/null) || true
# "Git Bash" does not support regular expressions.
if echo $TAG | grep -E "$SEMVER_REGEX" > /dev/null
then
	echo "Setting version to $TAG"
	VERSION=$TAG
fi

java -jar ckbuilder/$CKBUILDER_VERSION/ckbuilder.jar --build ../../ release $JAVA_ARGS --version="$VERSION" --revision="$REVISION" --overwrite

# Copy and build tests
if [[ "$ARGS" == *\ \-t\ * ]]; then
	echo ""
	echo "Coping tests..."

	cp -r ../../tests release/ckeditor/tests
	cp -r ../../package.json release/ckeditor/package.json
	cp -r ../../bender.js release/ckeditor/bender.js

	echo ""
	echo "Installing tests..."

	(cd release/ckeditor &&	npm install && bender init)
fi

echo ""
echo "Release created in the \"release\" directory."
