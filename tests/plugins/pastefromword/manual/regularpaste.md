@bender-tags: bug, 4.6.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, list, pastefromword, sourcearea, elementspath

1. Focus the editor.
1. Select all the content using `ctrl + a`.
1. Press ctrl + x.
1. Press ctrl + v.

**Expected:** Content is pasted, and looks the same way.

**Unexpected:** Content differs in any way. E.g. list is missing.
