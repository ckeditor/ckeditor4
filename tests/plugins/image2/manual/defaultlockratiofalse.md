@bender-tags: 4.20.0, feature, 5219
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, floatingspace

1. Move cursor to the "[Insert image here]" region and click the image button in the toolbar.

	**Expected** The "Lock ratio" is unlocked.

	**Unexpected** The "Lock ratio" is locked.
1. Paste any image URL (e.g. `%BASE_PATH%_assets/logo.png`).

	**Expected** The "Lock ratio" is unlocked.

	**Unexpected** The "Lock ratio" is locked.
1. Insert the image into the editor.
1. Double click it to open the dialog.

	**Expected** The "Lock ratio" is unlocked.

	**Unexpected** The "Lock ratio" is locked.
1. Repeat the procedure for all editors.
