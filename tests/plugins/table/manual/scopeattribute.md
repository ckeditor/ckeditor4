@bender-tags: 4.20.1, bug, 2996
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, table, sourcearea, elementspath, htmlwriter, tabletools, contextmenu

1. Create 2x2 table with `both` headers option.
2. Check the source code of table.

**Expected:** `<th>` elements inside `<thead>` should contain `scope` attribute sets to `col`.

**Unexpected:** The first cell inside `<thead>` has `scope` attribute sets to `row`.

3. Repeat above steps for div-based editor.
