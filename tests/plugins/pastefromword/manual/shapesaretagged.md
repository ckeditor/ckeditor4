@bender-tags: bug, pastefromword, 4.8.0, 662
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, pastefromword, pastefromwordimage, sourcearea, elementspath, sourcearea

1. Open document [Shape_and_image.docx](../generated/_fixtures/Shape_and_image/Shape_and_image.docx).
1. Copy its contents and paste to the editor.
1. Click button `getHtml` below editor.

**Expected:** First image tag had additional attribute `data-cke-is-shape="true"`. Second image is pasted without this attribute.

