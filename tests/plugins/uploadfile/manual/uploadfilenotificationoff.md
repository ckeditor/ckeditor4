@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadfile, clipboard, floatingspace, toolbar, sourcearea

1. Drag and drop, into the editor, file in a format unsupported by the editor eg. [JPEG2000](../_assets/logo.jp2).

**Expected** File should be placed in the editable as a link.

**Unexpected** Notification with "File of type .XXX is not supported." message is displayed.

2. Repeat step `1` for the paste method.

3. Repeat the above steps for the inline editor.
