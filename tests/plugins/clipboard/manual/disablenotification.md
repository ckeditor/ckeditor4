@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, clipboard, undo, image, floatingspace

1. Drag and drop into the editor file in a format unsupported by the editor eg. [JPEG2000](_assets/logo.jp2).

**Expected** Notification with "This file format is not supported." message is displayed.

**Unexpected** Nothing happens.

2. Click the `Disable notifications` button and repeat step 1.

**Expected** Notification is gone.

**Unexpected** Notification with "This file format is not supported." message is still displayed.

3. Repeat above steps for the inline editor and `paste` method.
**Note** You need to refresh page before testing the inline editor.
