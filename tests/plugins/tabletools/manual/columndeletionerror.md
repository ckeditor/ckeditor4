@bender-tags: 4.7.3, bug, 577
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, contextmenu, undo

----
1. Open browser console.
1. Select some cells somewhere under merged header.
1. Selection should use native selection.
1. Right click to open context menu.
1. Select Column -> Delete Columns.
1. You can use `Undo` command and try remove different columns.

**Expected:** Columns are deleted. There is no error in the console.

**Unexpected:** Error is thrown in a console. Columns are not removed.

----

1. Make collapsed selection at the end of one cell.
1. Right click to open context menu.
1. Select Column -> Delete Columns.

**Expected:** Only one column is deleted.

**Unexpected:** Two columns are deleted (with selection and next one).
