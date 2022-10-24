@bender-tags: 4.20.1, bug, 2881
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, table, sourcearea, elementspath, tabletools, contextmenu, htmlwriter, floatingspace

1. Click the Right mouse button and open `Table Properties`.
2. Change `Headers` option to `First Column`.
3. Open source area.

**Expected:** The first `<th>` element inside `<table>` has `scope` attribute sets to `row`.

**Unexpected:** The first `<th>` element inside `<table>` does not have `scope` attribute or there is no `<th>` element,

4. Repeat above steps for the `divarea` and `inline` editor.
