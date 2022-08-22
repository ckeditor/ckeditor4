@bender-tags: 4.20.0, feature, 5219
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, floatingspace

1. Move cursor to the "[Insert valid image here]" region and click the image button in the toolbar.

	**Expected** The "Lock ratio" is locked.

	**Unexpected** The "Lock ratio" is unlocked.
1. Paste any valid image URL (e.g. `%BASE_PATH%_assets/logo.png`).

	**Expected** The "Lock ratio" is locked.

	**Unexpected** The "Lock ratio" is unlocked.
1. Insert the image into the editor.
1. Double click it to open the dialog.

	**Expected** The "Lock ratio" is locked.

	**Unexpected** The "Lock ratio" is unlocked.
1. Close the dialog and move cursor to the "[Insert invalid image here]" region and click the image button in the toolbar.

	**Expected** The "Lock ratio" is locked.

	**Unexpected** The "Lock ratio" is unlocked.
1. Paste any invalid image URL (e.g. `%BASE_PATH%_assets/sample.txt`).

	**Expected** The "Lock ratio" is unlocked.

	**Unexpected** The "Lock ratio" is locked.
1. Insert the image into the editor.

	**Note** You could also add some alternative text to make the image more visible to make next step easier.
1. Double click it to open the dialog.

	**Expected** The "Lock ratio" is unlocked.

	**Unexpected** The "Lock ratio" is locked.
1. Repeat the procedure for all editors.
