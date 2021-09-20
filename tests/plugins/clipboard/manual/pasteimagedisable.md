@bender-ui: collapsed
@bender-tags: 4.17.0, clipboard, 4874
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

 1. Paste an image into the editor.

    Observe that the image is inserted and that no "Custom image paste handling" entry is written to "log output" on the page.

 2. Click the "Disable built-in image paste handling" button.

 3. Paste an image into the editor.

    Observe that the image is not inserted, and that "log output" now shows "Custom image paste handling: image data received".

**Expected** No image is inserted in step 3 but instead produces log output as described.

**Unexpected** Image pasting is not suppressed in step 3 and/or no log output is produced.
