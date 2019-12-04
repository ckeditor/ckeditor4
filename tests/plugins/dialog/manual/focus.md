@bender-tags: 3474, bug, 4.13.1, dialog, focus
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, find

1. Open the `find and replace` dialog window
2. Use the <kbd>TAB</kbd> key to move focus sowehere further in the dialog window
3. Click into the active tab in the dialog navigation
4. Again use the <kbd>TAB</kbd> key to move focus

### Expected:
The focus start to cycle from the beginning when tab was clicked

### Unexpected:
The focus start to cycle from the previously focused element after clicking into navigation tab.
