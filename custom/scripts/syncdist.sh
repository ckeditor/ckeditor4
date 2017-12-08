#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Syntax:"
  echo "    $0 <distribution-folder-path>"
  exit 1
fi

DISTPATH=$1
SRC="/Users/nhoyt/Sites/plugins-dev"

if [ ! -d $DISTPATH ]; then
  echo "Error: $DISTPATH not found"
  exit
fi

FOLDERS=(
  custom
  plugins/a11yfirsthelp
  plugins/a11yformat
  plugins/a11yheading
  plugins/a11ystylescombo
  plugins/balloonpanel/skins/a11yfirst
  skins/a11yfirst
)

for FOLDER in "${FOLDERS[@]}"
do
  CMD="rsync -av $SRC/$FOLDER $DISTPATH/$FOLDER"
  echo
  echo $CMD
  eval $CMD
done
