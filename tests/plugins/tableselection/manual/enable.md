@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableselection, autogrow

Try to select more than one cell in both of editors.

**Expected:**

* In the first editor the custom visual selection should be shown.
* In the second editor the native browser's selection should be shown.

**Unexpected:**

* In the second editor the custom visual selection is shown.
