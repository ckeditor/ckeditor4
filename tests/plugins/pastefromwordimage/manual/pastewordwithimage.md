@bender-tags: bug, 4.8.0, 662, pastefromwordimage
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromwordimage, sourcearea, elementspath, newpage, resize

----

1. Open document and copy whole content.
1. Clear editor content.
1. Paste copied content into CKEditor.

### Perform above steps for all files:
  1. [Simple_offline_image.docx](../generated/_fixtures/Simple_offline_image/Simple_offline_image.docx).
  2. [Online_and_offline_image.docx](../generated/_fixtures/Online_and_offline_image/Online_and_offline_image.docx),
  3. [Shapes_and_online_and_offline_image.docx](../generated/_fixtures/Shapes_and_online_and_offline_image/Shapes_and_online_and_offline_image.docx).
  4. [Wrapped_image.docx](../generated/_fixtures/Wrapped_image/Wrapped_image.docx)

**Expected:** Images are pasted to the editor.<br>
Note: Keep in mind that shapes (like last object in `Shapes_and_online_and_offline_image.docx`) will not be pasted.

**Unexpected:** Images are not visible in the editor.
