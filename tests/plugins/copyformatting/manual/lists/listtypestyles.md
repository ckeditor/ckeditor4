@bender-ui: collapsed
@bender-tags: bug, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, list, indentlist, liststyle, undo

1. Put the cursor inside one of list items in the first list.
2. Click "Copy Formatting" button.
3. Click inside one of list items in the second list.

### Expected

* Inline styles are applied correctly.
* List's type changed.
* List's styles (custom marker) are removed.

### Unexpected

* List's type didn't change.
* List's styles aren't removed
