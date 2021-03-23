@bender-tags: 4.17.0, feature, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Open developer console.

**Expected**
  * There is CKEDITOR 'editor-delayed-creation' warning with 'callback' mode.

**Unexpected**
  * There is no CKEDITOR 'editor-delayed-creation' warning in the console.

2. Click button to attach editor to DOM element and invoke config callback to finish editor creation.

**Expected**
  * There is CKEDITOR 'editor-delayed-creation-success' warning with 'callback' mode.
  * Editor is created.
  * Editor data is editable.
  * Editor contains initial data.

**Unexpected**
  * There is no CKEDITOR 'editor-delayed-creation-success' warning in the console.
  * Editor isn't created.
  * Editor data is empty.
  * Editor data is not editable.
