#!/usr/bin/env bash

# The custom subtree uses a separate location
NAME="custom"
echo \# $NAME

cmd="git remote add $NAME https://github.com/a11yfirst/${NAME}.git"
echo $cmd

cmd="git fetch $NAME"
echo $cmd

cmd="git read-tree --prefix=${NAME} -u ${NAME}/master"
echo $cmd

# Use git status to view what will be committed
cmd="git status"
echo $cmd

# Commit the changes
cmd="git commit -m \"Add subtree ${NAME}\""
echo $cmd

# Install the custom plugins as subtrees under the plugins folder
PLUGINS="block-format heading inline-style"

for NAME in $PLUGINS
do
  echo
  echo \# $NAME

  # Create named remote for subtree's central repo
  cmd="git remote add $NAME https://github.com/a11yfirst/${NAME}.git"
  echo $cmd

  # Fetch the remote ref into the index
  cmd="git fetch $NAME"
  echo $cmd

  # Update the index with the contents of the remote's master branch
  # and (using the -u switch) update the working directory as well:
  cmd="git read-tree --prefix=plugins/${NAME} -u ${NAME}/master"
  echo $cmd

  # Use git status to view what will be committed
  cmd="git status"
  echo $cmd

  # Commit the changes
  cmd="git commit -m \"Add subtree plugins/${NAME}\""
  echo $cmd
done
