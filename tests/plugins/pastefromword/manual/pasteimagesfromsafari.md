@bender-tags: bug, 4.10.0, 1134
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, pastefromword, elementspath, image, format, sourcearea

1. Create Word document with Image under MacOS.
1. Copy entire content of created document.
1. Paste content in editor.
1. Check src of pasted image by switching to source mode.

**Expected:** Image is pasted and transformed into base64,

**Unexpected:** Image is not pasted or src attribute is blob url.
