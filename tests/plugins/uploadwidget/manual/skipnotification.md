@bender-tags: 4.8.0, feature, 1145
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, image, uploadimage, elementspath
@bender-include: _helpers/xhr.js

## Skipping Notifications

1. Paste or drag and drop an image into the editor.

## Expected

* No progress/success notifications are shown.
* Image is changed to Lena (after ~4 secs).

**Note:** This test uses upload mock which will show you *Lena* instead of the real uploaded image.
