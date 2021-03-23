@bender-tags: 4.17.0, feature, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Open developer console. Watch for editor warning, right after button click in next step.
2. Click the button to start the test.

**Expected**
  * There is CKEDITOR 'editor-delayed-creation' warning with 'interval - 3000 ms' mode.

**Unexpected**
  * There is no CKEDITOR 'editor-delayed-creation' warning in the console.

3. Wait three seconds for editor creation.

**Expected**
  * There is CKEDITOR 'editor-delayed-creation-success' warning with 'interval - 3000 ms' mode.
  * Editor is created.
  * Editor data is editable.
  * Editor contains initial data.

**Unexpected**
  * There is no CKEDITOR 'editor-delayed-creation-success' warning in the console.
  * Editor isn't created.
  * Editor data is empty.
  * Editor contains initial data.
