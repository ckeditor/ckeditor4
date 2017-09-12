@bender-tags: bug, 4.8.0, 796, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, list, pastefromword

1. Open OneNote.
1. Create three element unordered list with different element (example above editor).
1. While cursor blinks use Ctrl + A twice to select the entire list (The first Ctrl + A selects single list item in OneNote).
1. Press Ctrl + C.
1. Paste into CKEditor with Ctrl + V.

## Expected:
List preserve correct order.

## Unexpected:
List is pasted in reverse order.
