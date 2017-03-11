#!/usr/bin/env bash

# Once the remote names have been created and fetched, the following
# commands create the subtree folders and commit them to the repo.

echo
echo "# The following commands are used for setting up subtrees. Please create and"
echo "# fetch the remotes by running remotes.sh prior to running these commands."

# The custom subtree uses a separate location
NAME="custom"
echo
echo \# $NAME

# Update the index with the contents of the remote's master branch
# and (using the -u switch) update the working directory as well:
cmd="git read-tree --prefix=${NAME} -u ${NAME}/master"
echo $cmd

# Use git status to view what will be committed
cmd="git status"
echo $cmd

# Commit the changes
cmd="git commit -m \"Add subtree ${NAME}\""
echo $cmd

# Install the custom plugins as subtrees under the plugins folder
PLUGINS="blockformat heading inlinestyle"

for NAME in $PLUGINS
do
  echo
  echo \# $NAME

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

echo
