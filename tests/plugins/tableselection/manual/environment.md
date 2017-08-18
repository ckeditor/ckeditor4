@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp2297
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, sourcearea, undo, elementspath

## Unsupported Environment

This editor **must not** provide improved table selection, as it's disabled for IE8-IE10.

1. Select the first row in table.

	**Expected:** A native selection is made.

	**Unexpected:** Our custom, improved selection is used.

2. Repeat for other editors.
