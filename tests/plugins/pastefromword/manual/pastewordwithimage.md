@bender-tags: bug, 4.8.0, 662, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, newpage, resize, image

----

1. Open document and copy whole content.
1. Clear editor content.
1. Paste copied content into CKEditor.

### Perform above steps for all files:
  1. [Simple_offline_image.docx](../generated/_fixtures/PFW_image/Simple_offline_image/Simple_offline_image.docx)
  2. [Online_and_offline_image.docx](../generated/_fixtures/PFW_image/Online_and_offline_image/Online_and_offline_image.docx)
  3. [Shapes_and_online_and_offline_image.docx](../generated/_fixtures/PFW_image/Shapes_and_online_and_offline_image/Shapes_and_online_and_offline_image.docx)
  4. [Wrapped_image.docx](../generated/_fixtures/PFW_image/Wrapped_image/Wrapped_image.docx)
  5. [Image_alternative_text.docx](../generated/_fixtures/PFW_image/Image_alternative_text/Image_alternative_text.docx)
  6. [Image_reflection.docx](../generated/_fixtures/PFW_image/Image_reflection/Image_reflection.docx)
  7. [Image_rotation.docx](../generated/_fixtures/PFW_image/Image_rotation/Image_rotation.docx) - _Note: Image is pasted without rotation, what is totally fine._

**Expected:** Images are pasted to the editor.<br>
Note: Keep in mind that shapes (like last object in `Shapes_and_online_and_offline_image.docx`) won't be pasted.

**Unexpected:** Images are not visible in the editor.
