@bender-tags: clipboard, widget, filetools, 4.11.0, 1454, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

1. Drag and drop some image into editable.
2. Click on the image and press `delete` key to remove image before upload progress bar finished.

## Expected

The editor shows notification `You are awesome!` exactly once.

## Unexpected

No notification or many notifications with `You are awesome!` message emerged.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.
