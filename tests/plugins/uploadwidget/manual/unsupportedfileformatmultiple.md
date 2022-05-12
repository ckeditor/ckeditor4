@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, floatingspace, toolbar, sourcearea

1. Drag and drop both files [logo.webp](../_assets/logo.webp) and [logo.svg](../_assets/logo.svg) into the editor.

**Expected** Notification with "The image/svg+xml, image/webp file format(s) are not supported." message is displayed.

**Unexpected** Nothing happens or one of the file formats is missing.

2. Repeat step `1` for the paste method.
