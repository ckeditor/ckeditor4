@bender-ui: collapsed
@bender-tags: 4.13.0, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, divarea, clipboard

### Note:
Test has to be performed with console opened.

### Test scenario:
* Click the input above editor.

**Expected:**

Console remains clean.

**Unexpected:**

A `Permission denied` error is thrown.
