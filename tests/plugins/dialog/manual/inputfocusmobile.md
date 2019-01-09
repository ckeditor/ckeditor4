@bender-tags: 2395, bug, 4.12.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

1. Scroll down until editor is visible and press link button.
1. Focus other input in dialog.

## Expected:

- After each step page should be scrolled in a way caret is visible.

## Unexpected

- Caret is outside of current viewport.
