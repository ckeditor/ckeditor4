#!/usr/bin/env bash

# The purpose of this script is to facilitate periodic backporting of
# the subtrees in the plugins-dev repository to their upstream remotes.

# It takes the name of a subtree as its only argument, and outputs the
# canonical list of files specified for the subtree that will be copied
# and replaced into the current working directory, which is assumed to
# be a working copy of the subtree's remote.

# It then requires the user to confirm that all listed files should be
# copied and replaced in the current working directory.

if [ -d "${PLUGINS_DEV:?You must set PLUGINS_DEV}" ]; then
  ROOTDIR=${PLUGINS_DEV}
else
  echo "Directory $PLUGINS_DEV not found"
  exit
fi

if [ -z $1 ]; then
  echo "Syntax:"
  echo "    $0 <subtree-name>"
  exit
else
  SUBTREE=$1
fi

if [ $SUBTREE == "custom" ]; then
    SUBDIR=""
else
    SUBDIR="plugins/"
fi

case $SUBTREE in

  a11yfirst)
    FILES=(
      plugin.js
    )
    ;;

  blockformat)
    FILES=(
      lang/en-au.js
      lang/en-ca.js
      lang/en-gb.js
      lang/en.js
      plugin.js
      README.md
    )
    ;;

  custom)
    FILES=(
      backport.sh
      config.js
      index.html
      remotes.sh
      subtrees.sh
      update.sh
      README.md
    )
    ;;

  heading)
    FILES=(
      dialogs/heading_help.js
      dialogs/heading_outline.js
      lang/en-au.js
      lang/en-ca.js
      lang/en-gb.js
      lang/en.js
      plugin.js
      README.md
    )
    ;;

  inlinestyle)
    FILES=(
      lang/en-au.js
      lang/en-ca.js
      lang/en-gb.js
      lang/en.js
      plugin.js
      README.md
    )
    ;;

  *)
    echo "ERROR: $SUBTREE is not a valid subtree name!"
    exit
    ;;
esac

SOURCE=$ROOTDIR/${SUBDIR}$SUBTREE

if [ $SOURCE == `pwd` ]; then
  echo "The update script should not be run from $SOURCE!"
  exit
fi

#echo
#echo "Copying files from $SOURCE ..."

function prompt {
  read -p "$1 (y/n)? " answer
  echo $answer
}

function confirm {
  result=$(prompt "$1")
  ch=${result:0:1}

  if [[ $ch != y && $ch != Y ]]; then
    echo Exiting script...
    exit
  fi
}

echo
echo "The following files will be copied into `pwd`:"

for FILE in "${FILES[@]}"
do
  FULLNAME=$SOURCE/$FILE
  if [ -e $FULLNAME ]; then
    echo $FULLNAME
  else
    echo "ERROR: $FULLNAME not found!"
    exit
  fi
done

echo
confirm "Replace all of the above files in $SUBTREE?"
echo

for FILE in "${FILES[@]}"
do
  FULLNAME=$SOURCE/$FILE
  CMD="cp -fp $FULLNAME $FILE"
  echo $CMD
  eval $CMD
done
