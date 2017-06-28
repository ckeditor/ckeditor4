@bender-ui: collapsed
@bender-tags: bug, 4.7.1, 417
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize

1. Focus editor.
2. Move mouse over the table.
	* **Expected**: No error is thrown in the browser console.
3. Try to resize one of the table columns.
	* **Expected**: The cursor changes to horizontal resize cursor when hovering over table borders. It is possible to
	resize table. The `column pillar` is visible while resizing table.

**Unexpected**: An error in the browser console occurs. Not possible to resize table.
