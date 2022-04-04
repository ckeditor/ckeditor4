@bender-tags: 4.18.1, bug, 4750
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, clipboard, undo, image, floatingspace

1. Drag and drop into the editor image in a format unsupported by the editor e.g: [JPEG2000](_assets/logo.jp2).

**Expected** Notification with "This file format is not supported." message is displayed.

**Unexpected** Nothing happens.

2. Click the `Turn notification off` button and repeat step 1.

**Expected** Notification is gone.

**Unexpected** Notification with "This file format is not supported." message is still displayed.

3. Repeat steps for the inline editor and others file types like `.zip`, `.docx`.
