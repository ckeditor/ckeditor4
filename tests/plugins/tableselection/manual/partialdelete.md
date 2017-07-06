@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp2224
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, undo, elementspath

1. Select two cells in the middle of first row.
1. Press `backspace`.

	### Expected

	Selection is collapsed into first formerly selected cell (so the second in the first row).

	### Unexpected

	Whole table gets removed.

1. Repeat above using `delete` key, same result is expected.


## Whole Row Remove

1. Select whole first row.
1. Press `backspace`.

	### Expected

	Whole row gets removed.
