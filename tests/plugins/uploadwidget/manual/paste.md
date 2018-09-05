@bender-tags: 4.10.2, bug, clipboard, widget, filetools, 1217
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, image2, uploadimage, uploadfile
@bender-include: _helpers/xhr.js

## No selection

1. Copy an image.
1. Focus the editor.
1. Paste an image using `cmd/ctr-v`.
1. Click outside the editor to remove selection from an image.
1. Wait until upload finished.

## Expected

Image is not selected.

## Unexpected

Image is selected.

## Image preselection

1. Copy an image.
1. Focus the editor.
1. Paste an image using `cmd/ctrl-v`.
1. Focus pasted image during image upload.
1. Wait until upload finished.

## Expected

Image is selected.

## Unexpected

Image is not selected.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image or show the link to the *Lena* file.
