@bender-tags: bug, 4.8.1, 595, 1347
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

## On non-touch devices with touch emulation (e.g. responsive view in browser)

1. Enable touch emulation.
1. Right click to open context menu.
1. Click paste.
	* **Expected**: Paste dialog is shown.
1. Close paste dialog.
1. Disable touch emulation.
1. Right click to open context menu.
1. Click paste.
	* **Expected**: Notification about inability to paste in such way is displayed.
