@bender-tags: bug, 4.12.0, 1490, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, table, basicstyles, font, colorbutton, justify

Be aware that pasting from Excel doesn't work for IE8 and Safari browsers. Use MS Word instead.

1. Using Microsoft Excel and Word create/copy table with custom cell borders. Use different colors and border types.
1. Paste it into editor.

You can use [`table.xls`](%BASE_PATH%/plugins/pastefromword/manual/_assets/tables.xls),
and [`table.docx`](%BASE_PATH%/plugins/pastefromword/manual/_assets/tables.docx).

## Expected

Borders are preserved.

## Unexpected

Borders are not preserved or have different style.

**NOTE** Some styles may not be preserved natively.
Use clipboard dump input to check if the issue is not MS Office / browser upstream.
