@bender-tags: 4.9.0, bug, 1419, widgetselection
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,link,format,sourcearea,widgetselection,elementspath

----

1. Set system settings to use Polish keyboard layout.
2. Focus editor instance.
3. Press `AltGr (right alt) + a` (or `option + a` on Mac) to insert `ą` letter.

## Expected
`ą` letter has been inserted at the caret position. Editor content has not been selected.

## Unexpected
`ą` letter has not been inserted and/or editor content has been selected.
