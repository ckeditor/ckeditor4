@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools

1. Place caret in the table cell.
1. Open the context menu.
1. Choose:
	1. "Cell".
	1. "Split Cell **Vertically**".

Expected:

1. New cell is created on the right hand side of the original one.
1. Table has one row, two columns.
1. Caret is located in the right cell.
