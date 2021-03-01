@bender-tags: 4.17.0, bug, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Click first button to attach first editor target element to DOM.
2. Click second button to attach second editor target element and create it from callback.

**Expected**
  * Each editor is created.
  * Each editor is editable.
  * Each editor contains initial data.

**Unexpected**
  * Editor isn't created.
  * Editor data is empty.
  * Editor data is not editable.
