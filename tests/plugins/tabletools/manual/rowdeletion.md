@bender-tags: 4.10, bug, 2300
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, contextmenu

----
1. Run this on MacOS.
1. Place cursor in row 2 column 5, just after cell text ends.
1. Right click and choose Row -> Delete row.

**Expected:** One row gets removed.

**Unexpected:** Both selected row and the one following it gets removed.
