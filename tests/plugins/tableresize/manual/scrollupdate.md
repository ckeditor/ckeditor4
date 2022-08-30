@bender-ui: collapsed
@bender-tags: bug, 4.20.0, 4889
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize, tabletools, floatingspace

1. Scroll the editor to its right end and then slightly to the left.
1. Try to resize the last column.

	**Expected** The resizing cursor is in the right place.

	**Unexpected** The resizing cursor is moved from the column's border.
