@bender-tags: 4.9.0, bug, 1217
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, uploadfile, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

1. Copy several custom images.
2. Focus the editor.
3. Paste images from a clipboard into the editor.
4. Select custom editor elements / change focus / write some text during images upload.
4. Wait for images upload.

## Expected

Custom selection is preserved.

## Unexpected

Custom selection has not been preserved and/or errors showed up in a browser console.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image or show the link to the *Lena* file.
