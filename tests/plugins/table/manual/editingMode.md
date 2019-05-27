@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar, contextmenu

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Place focus at the first editor paragraph.
2. Click the table button.
3. Verify status above the editor.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

4. Cancel dialog.
4. Place selection at the first table cell.
5. Click the table button.
6. Verify status above the editor.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

7. Cancel dialog.
8. Place selection at the first table cell.
9. Open context menu and click `Table properties` option.
10. Verify status above the editor.

## Expected

Dialog name: **tableProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

---
