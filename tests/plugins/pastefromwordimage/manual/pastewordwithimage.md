@bender-tags: bug, 4.8.0, 662, pastefromwordimage
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromwordimage, sourcearea, elementspath, newpage, resize

----

1. Open document and copy whole content.
1. Clear editor content.
1. Paste copied content into CKEditor.

### Perform above steps for all files:
  * [Offline img](../generated/_fixtures/SimpleImages/SimpleImages.docx).
  * [Online and offline img](../generated/_fixtures/MixedOnline/Mixed_drawings_and_online.docx),
  * [Document with shape](../generated/_fixtures/MixedOnlineAndShapes/Mixed_drawings_and_online_and_shapes.docx). _Please notice that shape should be ignored while pasting._

**Expected:** Images are pasted to the editor.

**Unexpected:** Images are not visible in the editor.
