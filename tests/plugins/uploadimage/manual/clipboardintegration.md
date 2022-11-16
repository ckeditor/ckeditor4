@bender-tags: 4.20.1, bug, 5333
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, uploadimage, image, floatingspace, toolbar, sourcearea

1. Open the console.

**Expected** There is `[CKEDITOR] Error code: clipboard-image-handling-disabled.` warning in the console after the editor is loaded.

**Unexpected** There is no warning in the console.
2. Drag and drop an image into the editor.

**Expected** The original name of the file is displayed above the editor.

**Unexpected** The name in the `image-<timestamp>-<n>.<ext>` format is displayed above the editor.

3. Repeat step `2` for the paste method.
