@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar, contextmenu, tabletools

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Focus the first table row.
1. Open context menu over the table and select `Cell Properties` option.
2. Verify status above the editor.

## Expected

Dialog name: **cellProperties** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`.
