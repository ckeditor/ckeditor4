@bender-ui: collapsed
@bender-tags: 4.17.0, clipboard, 4874, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

 1. Copy an image from an image editor or from the file system (using Explorer on Windows or Finder on Mac).

    **Note**: Do not copy an image from a web browser, as it may not copy the
    actual image, but instead a reference, which is not valid for this test case.

 1. Paste the image into the editor.

**Expected** No image is inserted. "Log output" shows: "Custom image paste handling: data received".

**Unexpected** Image is inserted into editor.
