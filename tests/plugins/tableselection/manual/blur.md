@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1577
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, sourcearea, undo, elementspath

## Table selection with blurred editor

Perform steps for each editor.

1. Focus the editor.
1. Select the first row in table.
	**Expected:** Selection is blue.
1. Press tab to move the focus outside of current editor.

**Expected:** Selection in the former editor gets grayed out.

**Unexpected:** Styling doesn't change.
