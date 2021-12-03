@bender-tags: 4.17.2, bug, 4873
@bender-ui: collapsed
@bender-ckeditor-plugins:basicstyles, elementspath, horizontalrule, pastefromword, showborders, sourcearea, table, toolbar, wysiwygarea, autogrow, image, undo

1. Open browser's console.
2. Open [outlook1](_assets/outlook1.msg)
or [image_with_hrline](_assets/image_with_hrline.docx)
3. Copy entire content from outlook.
4. Paste the content in the editor.

**Expected**

* Horizontal line and image was pasted properly.
* There is no error in console.

**Unxpected**

* Image was not pasted in the editor.
* There is an error in the browser's console `Error code: pastetools-failed-image-extraction. {rtf: 2, html: 1}`
