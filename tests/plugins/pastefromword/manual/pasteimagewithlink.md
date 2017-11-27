@bender-tags: bug, 4.8.0, 662, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, newpage, resize, link, image

----

1. Open document and copy whole content.
1. Clear editor content.
1. Paste copied content into CKEditor.

### Perform above steps for all files:
  1. [Link_image.docx](../generated/_fixtures/PFW_image/Link_image/Link_image.docx)

**Expected:** Images is visible and pasted only once. Image is wrapped with an anchor link.

**Unexpected:** Image is not visible and/or img tag is placed twice.
