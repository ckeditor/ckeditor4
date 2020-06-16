@bender-tags: 4.7.0, bug, trac14894
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, contextmenu, toolbar, wysiwygarea, link

## Test scenario

For each editor:
1. Scroll it without focusing.
2. Open the link dialog.

## Expected result

Scroll position remains unchanged.

## Unexpected

Editor scroll position is moved to top.
