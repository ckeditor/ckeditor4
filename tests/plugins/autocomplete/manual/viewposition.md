@bender-tags: 4.10.0, bug, tp3559
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch

1. Scroll the editor content to the middle.
2. Focus the editor and type `@`.
3. Scroll the editor up and down.

## Expected

When changing scroll position of the editor the view should be placed differently:

- if there is enough space above a caret position and too little space below, the view should be placed above a caret
- if there is not enough space above a caret position and enough space below, the view should be placed below a caret
- if there is not enough space above and below a caret, the view should be placed below a caret

## Unexpected

The view is not changing its position depending on space below and above a caret.

