@bender-ui: collapsed
@bender-tags: bug, 4.11.0, 706
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, elementspath

Try to select some cells.

## Expected

Cursor changes into the `cell` type.

## Unexpected

Cursor remains of the `text` type.

## Known issues

Cursor won't change in IE/Edge and Safari due to upstream issues.
