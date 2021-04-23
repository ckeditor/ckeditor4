@bender-tags: 4.17.0, feature, 4461
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

1. Open developer console. Watch for editor warning, right after button click in next step.
2. Click the button to start the test.

  **Expected**
    * `editor-delayed-creation` warning with `{ method: interval - 3000 ms }` object showed in the console. **On IE8-11 you'll get `[object Object]` instead.**

  **Unexpected**
    * No `editor-delayed-creation` warning in the console.

3. Wait three seconds for editor creation.

  **Expected**
    * `editor-delayed-creation-success` warning with `{ method: interval - 3000 ms }` object showed in the console. **On IE8-11 you'll get `[object Object]` instead.**
    * Editor is created.
    * Editor contains initial data.
    * Editor data is editable.

  **Unexpected**
    * No `editor-delayed-creation-success` warning in the console.
    * Editor isn't created.
    * Editor data is empty.
    * Editor data is not editable.
