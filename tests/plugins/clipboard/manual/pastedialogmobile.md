@bender-tags: bug, 4.9.0, 595
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter,

## On non-touch devices

Click paste button on the toolbar.

### Expected

**Non-IEs**: Notification about inability to paste in such way is displayed.
**IEs**: Popup asking for Clipboard Permissions is displayed.

## On touch devices

Touch paste button on the toolbar.

### Expected

* Paste dialog is shown.
* Dismissing paste dialog does not trigger any notification.

## On non-touch devices with touch emulation (e.g. responsive view in browser)

1. Enable touch emulation.
2. Touch paste button on the toolbar.
3. Close paste dialog.
4. Disable touch emulation.
5. Click paste button on the toolbar.

### Expected

* Touching button should display paste dialog.
* Clicking button should display notification.
