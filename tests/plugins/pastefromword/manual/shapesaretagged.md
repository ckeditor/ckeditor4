@bender-tags: bug, pastefromword, 4.8.0, 662
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, pastefromwordimage, sourcearea, elementspath, sourcearea, image

1. Open document [Shape_and_image.docx](../generated/_fixtures/Shapes/Shape_and_image/Shape_and_image.docx).
1. Copy its contents and paste to the editor.
1. Click button `getHtml` below editor.

**Expected:**
  * For browsers with good `text/html` clipboard processing (Firefox, Chrome, Safari): First image tag had additional attribute `data-cke-is-shape="true"`. Second image is pasted without this attribute.
  * For other browsers (Edge, IE, Mobile): There won't be `data-cke-is-shape="true"`. Browser will behave in an old way: display blank place or embed image by it's own.
