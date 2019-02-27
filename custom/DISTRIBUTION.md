# Creating a new distribution

1. Depending on the time since the last distribution, it may be desirable to
   merge in all changes from the upstream repository from which plugins-dev
   was forked, nameley `https://github.com/ckeditor/ckeditor-dev`. Roughly
   speaking, this involves the following two steps:
   1. merge the upstream/master branch into the local master branch
   1. merge the local master branch into the a11yfirst branch

1. Use the [CKEditor Builder](https://ckeditor.com/cke4/builder) app to create
   a new build, following the instructions in `config.js`.

   * Note: If nothing has changed with the build process since the last
     distribution, you can upload the `build-config.js` from the previous
     distribution to Builder.

1. Download the Builder ZIP file and expand it to a new folder

1. Make sure that the `plugins-dev` working copy is clean and includes all the
   changes needed for the new distribution, including the new version number
   and updates to the `CHANGELOG.md` and scripts/syncdist.sh files.

1. Change directory to the `distribution` working copy folder and issue the
   following command to make sure it is up to date with origin:

   `git pull`

1. Use the following command to delete all files from the working copy:

   `git rm -r *`

1. Commit the changes, but do not push them:

   `git commit -am "Delete all files in preparation for new distribution"`

1. Copy all files from the new build folder to the working copy folder, for
   example:

   `cp -r ~/Downloads/ckeditor/* ./`

1. Run the script `syncdist.sh` giving it the location of the working copy
   folder.

   * Note: The script assumes that the files is will rsync into the
     distribution are located in `$HOME/Sites/plugins-dev`

1. Test the distribution in the browser:

   * All new editor functionality
   * New version number in A11yFirstHelp dialog
   * Updates to `CHANGELOG.md`

1. Add all files, commit and push the changes:

   `git add -A`

   `git commit -m "Initial commit for version <N.N.N>"`

   `git push`

1. Create a new tag for `distribution` and push it to origin

   `git tag -n    # list all tags with their messages`

   `git tag -a <tag-name> -m "<message>" # where <tag-name> is formatted a11yfirst-vN.N.N`

   `git push origin <tag-name>`

1. Create a new tag for `plugins-dev` (using same commands as previous step)
