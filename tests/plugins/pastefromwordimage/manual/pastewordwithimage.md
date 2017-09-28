@bender-tags: bug, 4.8.0, 662, pastefromwordimage
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromwordimage, sourcearea, elementspath, newpage

----

1. Using Microsoft Word open a document with images [Offline img](../generated/_fixtures/SimpleImages/SimpleImages.docx).
1. Select the whole document content.
1. Paste it into CKEditor instance.
1. Clear editor with `New page` and repeat above steps for next two files:
  * [Online and offline img](../generated/_fixtures/MixedOnline/Mixed_drawings_and_online.docx),
  * [Document with shape](../generated/_fixtures/MixedOnlineAndShapes/Mixed_drawings_and_online_and_shapes.docx). _Please notice that shape should be ignored while pasting._

**Expected:** Images are pasted to the editor.

**Unexpected:** Images are not visible in the editor.
