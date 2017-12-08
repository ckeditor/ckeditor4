#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Syntax:"
  echo "    $0 <distribution-folder-path>"
  exit 1
fi

DISTPATH=$1
SRC="$HOME/Sites/plugins-dev"

if [ ! -d $DISTPATH ]; then
  echo "Error: $DISTPATH not found"
  exit
fi

PLUGINS=(
  a11yfirsthelp
  a11yformat
  a11yheading
  a11ystylescombo
)

RSYNC="rsync -av --delete-excluded --exclude='.DS_Store'"

FOLDER="custom"
CMD="$RSYNC $SRC/$FOLDER $DISTPATH"
echo
echo $CMD
eval $CMD

FOLDER="plugins"
for PLUGIN in "${PLUGINS[@]}"
do
  CMD="$RSYNC $SRC/$FOLDER/$PLUGIN $DISTPATH/$FOLDER"
  echo
  echo $CMD
  eval $CMD
done

FOLDER="plugins/balloonpanel/skins"
CMD="$RSYNC $SRC/$FOLDER/a11yfirst $DISTPATH/$FOLDER"
echo
echo $CMD
eval $CMD

FOLDER="skins"
CMD="$RSYNC $SRC/$FOLDER/a11yfirst $DISTPATH/$FOLDER"
echo
echo $CMD
eval $CMD
