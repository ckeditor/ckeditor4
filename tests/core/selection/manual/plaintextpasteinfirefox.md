@bender-tags: selection, 4.13.1, bug, 3475
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard

1. Open browser's dev console.
1. Select text in the input above the editor and copy it with <kbd>CTRL</kbd>/<kbd>CMD</kbd>+<kbd>C</kbd>.
1. Make **non-collapsed** selection in the editor, for example over a `Bar` word.
1. Paste previously copied text.

### Expected:
Text is correctly pasted into editor.

### Unexpected
The error is thrown in the console.
