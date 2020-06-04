@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
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
5. Place selection at the first table cell.
6. Click the table button.
7. Verify status above the editor.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

8. Cancel dialog.
9. Place selection at the first table cell.
10. Open context menu and click `Table properties` option.
11. Verify status above the editor.

## Expected

Dialog name: **tableProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

---
