@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.7.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo, basicstyles

## Test scenario 1

1. Paste some text from somewhere else using `Ctrl + Shift + V`.

## Expected

Text is pasted.

## Test scenario 2

1. Put the caret in the first paragraph and hit `Ctrl + Shift + C`.
2. Use the arrow keys to place the caret in the second paragraph.
3. Hit `Ctrl + Shift + V`

## Expected

Underline is applied to the selected content in the second paragraph.
