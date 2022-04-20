@bender-tags: 4.19.0, bug, 5095
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, clipboard, undo, image, floatingspace

1. Drag and drop, into the editor, file in a format unsupported by the editor eg. [JPEG2000](_assets/logo.jp2).

**Expected** Notification with "This file format is not supported." message is displayed.

**Unexpected** Nothing happens.

2. Click the `Disable notifications` button and repeat step `1`.

**Expected** Notification does not appear.

**Unexpected** Notification with "This file format is not supported." message is still displayed.

3. Click `Set defaults` button and repeat above steps for the inline editor.

4. Click `Set defaults` and repeat steps `1`-`3` but use copy/paste file instead of drag and drop.
