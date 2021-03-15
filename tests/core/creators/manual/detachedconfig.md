@bender-tags: 4.17.0, feature, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Click button to attach editor to DOM element and invoke config callback to finish editor creation.

**Expected**
  * Editor is created.
  * Editor data is editable.
  * Editor contains initial data.

**Unexpected**
  * Editor isn't created.
  * Editor data is empty.
  * Editor data is not editable.
