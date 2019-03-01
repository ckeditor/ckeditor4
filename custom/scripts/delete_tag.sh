#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Syntax:"
  echo "    $0 <tag-name>"
  exit 1
fi

TAGNAME=$1

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

confirm "Delete tag ${TAGNAME} on origin"
git push --delete origin ${TAGNAME}

confirm "Delete tag ${TAGNAME} from local branch"
git tag --delete ${TAGNAME}
