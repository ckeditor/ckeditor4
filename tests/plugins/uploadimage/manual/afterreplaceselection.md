@bender-tags: 4.9.0, bug, 1217
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, uploadfile, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

1. Copy several custom images.
2. Select whole text in the editor using `ctrl/cmd + a`.
3. Paste images from a clipboard into the editor replacing selected text.
4. Wait for images upload.

## Expected

All images are selected.

## Unexpected

Not all images are selected and/or errors showed up in a browser console.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image or show the link to the *Lena* file.
