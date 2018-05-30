@bender-tags: 4.10.0, bug, 1910
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

# Classic and divarea editors

1. Scroll the editor content to the middle.
1. Focus the editor at the middle line and type `@`.
1. Scroll the editor up and down.

## Expected

When changing scroll position of the editor the view should be placed differently:

- If there is enough space above a caret position and too little space below, the view should be placed above a caret.
- If there is enough space below a caret position, the view should be placed below a caret.
- If there is not enough space above and below a caret, the view should be placed below a caret.

## Unexpected

The view is not changing its position depending on space below and above a caret.

# Inline editor

1. Focus the editor at the first line and type `@`.
1. Close the view using `esc` key (or `backspace` key on mobile).
1. Focus the editor at the last line and type `@`.

## Expected

- View at the first line should be placed below a cursor.
- View at the last line should be placed above a cursor.

## Unexpected

The view is not changing its position depending on space below and above a caret.
