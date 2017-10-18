@bender-tags: bug, 4.8.0, 662, pastefromwordimage
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromwordimage, sourcearea, elementspath, newpage

----

1. Open browser's console.
1. Using Microsoft Word open a document with images e.g. ([Offline img](../generated/_fixtures/SimpleImages/SimpleImages.docx)).
1. Select the whole document content.
1. Paste it into CKEditor instance.

**Expected:** There is no error with message: `Not allowed to load local resource` pointing to files beginning with `file://`.
