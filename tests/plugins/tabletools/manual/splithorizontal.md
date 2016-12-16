@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools

1. Place caret in the table cell.
1. Open the context menu.
1. Choose:
	1. "Cell".
	1. "Split Cell **Horizontally**".

Expected:

1. New cell is created below the original one.
1. Table has two rows, one column.
1. Caret is located in the bottom cell.