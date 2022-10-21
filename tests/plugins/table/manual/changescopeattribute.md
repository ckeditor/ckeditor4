@bender-tags: 4.20.1, bug, 2996
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, table, sourcearea, elementspath, tabletools, contextmenu, htmlwriter, floatingspace
@bender-include: helpers/utils.js

1. Click the Right mouse button and open `Table Properties`.
2. Change `Headers` option to `First Column`.
3. Open source area.

**Expected:** The first `<th>` element inside `<thead>` has `scope` attribute sets to `row`.

**Unexpected:** The first `<th>` element inside `<thead>` does not have `scope` attribute.

4. Repeat above steps for the `divarea` and `inline` editor.
