@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, floatingspace, toolbar, sourcearea

1. Drag and drop both files [logo.jp2](../_assets/logo.jp2) and [logo.svg](../_assets/logo.svg) into the editor.

**Expected** Notification with "File in the format image/svg+xml, image/jp2 is not supported." message is displayed.

**Unexpected** Nothing happens or one of the file formats is missing.

2. Repeat step `1` for the paste method.
