@bender-tags: 4.16.1, bug, 4301
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, sourcearea

## For each editor

1. Copy anything (e.g. text above the editor).
2. Paste it in the editor.
3. Without moving selection, paste it once more.

## Expected

The text is pasted twice.

## Unexpected

The text is pasted once.
