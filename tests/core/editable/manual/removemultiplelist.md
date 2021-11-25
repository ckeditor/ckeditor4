@bender-tags: 4.17.2, bug, 4875
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, list, resize, undo, sourcearea, elementspath

1. Select everything from first list item (t1) to last list item in the second list (t22)
2. Press <kbd>delete</kbd> or <kbd>backspace</kbd>

**Expected**

Whole text gets deleted.

**Unexpected**

Only second list gets deleted.
