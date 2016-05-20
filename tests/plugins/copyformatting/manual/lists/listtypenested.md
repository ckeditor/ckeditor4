@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, list, indentlist, liststyle, undo

1. Put the cursor inside one of list items in the second list.
2. Click "Copy Formatting" button.
3. Select the first list to apply formatting to it.

### Expected

* Copied list styles applied only to outer list in the selection
* List styles for inner (nested) lists remain the same.

### Unexpected

* List styles removed for inner (nested) levels.
