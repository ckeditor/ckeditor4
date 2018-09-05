@bender-tags: 4.10.2, bug, clipboard, widget, filetools, 1217
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, image2, uploadimage, uploadfile
@bender-include: _helpers/xhr.js

1. Open a console.
1. Copy 2 images.
1. Focus the editor.
1. Paste an image using `cmd/ctr-v`.

## Expected

No console errors.

## Unexpected

Any console error.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image or show the link to the *Lena* file.
