@bender-tags: selection, 4.20.0, bug, 4931
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, list, undo

1. Select entire content via `Ctrl+A`.
2. Delete content with backspace key.

**Expected** The entire list is removed from the editor.

**Unexpected** There are list leftovers in the editor.

3. Repeat steps in the second editor.
