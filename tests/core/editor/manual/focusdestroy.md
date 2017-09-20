@bender-tags: bug, 4.7.0, trac16825
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, about, elementspath

1. Focus the editor.
1. Press any printable key.

## Expected

Editor gets blurred, destroyed and there are no errors in the console.

## Unexpected

There is a `Cannot read property 'isInline' of null` error in the console.
