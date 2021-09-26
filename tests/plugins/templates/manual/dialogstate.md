@bender-tags: 4.17.0, feature, 4850
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog, templates, image, table, format, basicstyles

**Note:** The `CKEDITOR.ajax#loadText()` is made intentionally slow in this test.

1. Click the `Templates` Button.
2. Choose "Title and Text" template.

**Expected:** There is a spinner in the dialog's title bar while the template file is loaded.
