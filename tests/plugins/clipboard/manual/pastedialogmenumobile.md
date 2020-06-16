@bender-tags: bug, 4.9.0, 595, 1347
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter, contextmenu, undo

## On non-touch devices

1. Right click to open context menu.
1. Click paste.

### Expected result:

**Non-IEs**: Notification about inability to paste in such way is displayed.
**IEs**: Popup asking for Clipboard Permissions is displayed.

## On touch devices

1. Touch and hold to open context menu.
1. Click paste.

### Expected result:

* Paste dialog is shown.
* Dismissing paste dialog does not trigger any notification.
