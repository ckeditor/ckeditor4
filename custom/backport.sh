#!/usr/bin/env bash

# Once the remote name has been created and fetched, the following commands
# allow you to backport cherry-picked subtree commits to the original repo.

echo
echo "# The following commands are used for for backporting subtree commits"
echo "# to their original repositories. Please create and fetch the remote"
echo "# by running remotes.sh prior to running these commands."

if [ $# -eq 0 ]; then
    echo "Syntax:"
    echo "    $0 <plugin-name>"
    exit 1
fi

REMOTE=$1
VALID=false

case $REMOTE in
    "custom")
	VALID=true;;
    "block-format")
	VALID=true;;
    "heading")
	VALID=true;;
    "inline-style")
	VALID=true;;
    *)
	VALID=false;;
esac

if [ $VALID == false ]; then
    echo "Invalid argument"
    exit 1
fi

ENTRIES=6

echo
echo "# From the main development branch, view recent commits:"
echo "git log --oneline --decorate --stat -${ENTRIES}"

echo
echo "# Create a local branch specifically for backporting:"
echo "git checkout -b backport-${REMOTE} ${REMOTE}/master"

echo
echo "# Then cherry-pick the commits we want to backport:"
echo "git cherry-pick -x --strategy=subtree <commit-hash>"

echo
echo "# Finally, view the commits in the backport branch with:"
echo "git log --oneline --decorate --stat -${ENTRIES}"

echo
echo "# And push to the upstream remote-name and branch created when"
echo "# the subtree was added:"
echo "git push $REMOTE HEAD:master"

echo
