@bender-tags: 4.17.2, bug, 5068
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, list, resize, undo, sourcearea, elementspath, magicline

1. Open the browser's console.
2. Select everything contained in `[]` including markers.
3. Move the mouse cursor under the last list item to show the `magicline`. Red dashed line should be visible under the last list item.
4. Press <kbd>delete</kbd> or <kbd>backspace</kbd>

**Expected**

The content from selected range has been properly removed.

**Unexpected**

There is an error in the console: `Cannot read properties of null (reading 'getParents')`
