@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, uploadwidget, uploadimage, image, floatingspace, toolbar, sourcearea

**Note:** Make sure the notification was closed/disappeared after the step which shows it.

1. Drag and drop, into the editor, file in a format unsupported by the editor eg. [WEBP](../_assets/logo.webp).

**Expected** Notification with "The [file format] file format(s) are not supported." message is displayed.

**Unexpected** Nothing happens.

2. Repeat step `1` for the paste method.
