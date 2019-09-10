@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar, contextmenu, tableselection

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Select the first table row using table selection.
2. Click the table button.
3. Verify status above the editor.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

4. Cancel dialog.
5. Open context menu and click `Table properties` option.
6. Verify status above the editor.

## Expected

Dialog name: **tableProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[table HTML]`

---

7. Cancel dialog.
8. Open context menu and click `Cell Properties` option.
9. Verify status above the editor.

## Expected

Dialog name: **cellProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[cells HTML]`.
