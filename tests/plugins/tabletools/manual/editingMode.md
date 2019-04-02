@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar, contextmenu, tabletools

1. Focus the first table row.
1. Open context menu over the table and select `Cell Properties` option.
2. Verify status above the editor.

## Expected

Dialog name: **cellProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[selected cells HTML]`
