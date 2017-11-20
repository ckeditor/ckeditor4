@bender-tags: bug, pastefromword, 4.8.0, 662
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, pastefromwordimage, sourcearea, elementspath, sourcearea, image

1. Open document [Shape_and_image.docx](../generated/_fixtures/Shapes/Shape_and_image/Shape_and_image.docx).
1. Copy its contents and paste to the editor.
1. Click button `getHtml` below editor.

**Expected:** Single image is pasted to the editor. Shape present in word document is removed during paste process.
