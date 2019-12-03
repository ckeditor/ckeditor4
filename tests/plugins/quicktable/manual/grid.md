@bender-tags: 4.14.0, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, table, quicktable, undo

1. Click Quick Table button.
1. Mouse over grid.

	**Expected:** Hovering over grid changes cell selection. All cells are selected up to cursor position.

1. Move cursor over the second grid row and column (2x2).
1. Click hovered cell.

	**Expected:** Table has been inserted into the editor with 2 rows and columns.
