@bender-tags: dialog, 4.12.0, 2423
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, table, toolbar

1. Place focus at the first editor paragraph.
2. Click table button.
3. Verify status above the editor.
4. Cancel dialog.

## Expected

**editing:** `false`

**model:** `false`

4. Place focus at the table.
2. Click table button.
3. Verify status above the editor.

## Expected

**editing:** `true`

**model:** `true`
