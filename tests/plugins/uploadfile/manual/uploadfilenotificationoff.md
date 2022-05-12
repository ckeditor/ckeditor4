@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadfile, clipboard, floatingspace, toolbar, sourcearea

1. Drag and drop, into the editor, file in a format unsupported by the editor eg. [WEBP](../_assets/logo.webp).

**Expected** File should be placed in the editable as a link.

**Unexpected** Notification with "The [file format] file format(s) are not supported." message is displayed.
