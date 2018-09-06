@bender-tags: widget, dialog, feature, 1044
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, widget, dialog

**Pay attention to notifications.**

1. Double click on `Widget 1`.
1. Wait until dialog show up.
1. Click `OK` button.
1. Repeat 1-3 for but instead of `OK` click `Close` button.

Repeat test steps for `Widget 2`.

## Expected

* After opening and closing dialog notifications show up with widget content.
* Make sure that notification message equals widget content.

## Unexpected

* Notification doesn't show up on widget opening and closing.
* Notification message is not the same as widget content.

**Note**: Clicking `OK` button triggers `ok` and `hide` events thus notification message will be doubled.
