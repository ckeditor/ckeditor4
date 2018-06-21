# Creating a new distribution

1. Use the [CKEditor Builder](https://ckeditor.com/cke4/builder) app to create a new build: follow the instructions in `config.js`.

   * Note: If nothing has changed with the build process since the last distribution, you can upload the `build-config.js` from the previous distribution to Builder.

1. Download the Builder ZIP file and expand it to a new folder

1. Make sure that the `plugins-dev` working copy is clean and includes all the changes needed for the new distribution, including the new version number and updates to the `CHANGELOG.md` and scripts/syncdist.sh files.

1. Change directory to the `distribution` working copy folder

   * Use `git pull` to make sure it is up to date with origin

1. Use the command: `git rm -r *` to delete all files from the working copy

1. Commit and push the changes: "Delete all files in preparation for new distribution"

1. Copy all files from the new build folder to the working copy folder, for example

   * `cp -r ~/Downloads/ckeditor/* ./`

1. Run the script `syncdist.sh` giving it the location of the working copy folder.

   * Note: The script assumes that the files is will rsync into the distribution are located in `$HOME/Sites/plugins-dev`

1. Test the distribution in the browser:

   * All new editor functionality
   * New version number in A11yFirstHelp dialog
   * Updates to `CHANGELOG.md`

1. Commit and push the changes: "Initial commit for new distribution"

1. Create a new tag for `distribution` and push it to origin

1. Create a new tag for `plugins-dev` and push it to origin
