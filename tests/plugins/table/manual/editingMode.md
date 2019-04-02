@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar

1. Place focus at the first editor paragraph.
2. Click the table button.
3. Verify status above the editor.
4. Cancel dialog.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

4. Place selection at the first table cell.
2. Click the table button.
3. Verify status above the editor.

## Expected

Dialog name: **table** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[table HTML]`

---
