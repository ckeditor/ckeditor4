@bender-tags: selection, 4.13.1, bug, 3475
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard

1. Open browser's console
2. Select text in input above the editor and copy it with <kbd>CTRL</kbd>+<kbd>C</kbd>
3. Type something in the editor for example `foo bar baz`
4. Make **non-collapsed** selection for example over a `bar`
5. Paste previously copied plain-text

### Expected:
Text is copied to editor.

### Unexpected
The error is thrown in the console.
