#!/usr/bin/env bash

echo
echo "# The following commands are needed for both setting up subtrees and"
echo "# for backporting subtree commits to their original repositories."
echo "# See backport.sh and subtrees.sh for additional commands."

SUBTREES="custom blockformat heading inlinestyle"

for NAME in $SUBTREES
do
  echo
  echo \# $NAME

  # Create named remote for subtree's central repo
  cmd="git remote add $NAME https://github.com/a11yfirst/${NAME}.git"
  echo $cmd

  # Fetch the remote ref into the index
  cmd="git fetch $NAME"
  echo $cmd
done

echo
