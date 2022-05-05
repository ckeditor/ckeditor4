@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, floatingspace, toolbar, sourcearea

1. Drag and drop, [JPEG2000](../_assets/logo.jp2) into the editor.

**Expected** Nothing happens.

**Unexpected** Notification with "File in the format image/jp2 is not supported." message is displayed.

2. Repeat step `1` for the paste method.

3. Drag and drop, [SVG Image](../_assets/logo.svg) into the editor.

**Expected** Notification with "File in the format image/svg+xml is not supported." message is displayed.

**Unexpected** Nothing happens.

2. Repeat step `3` for the paste method.
