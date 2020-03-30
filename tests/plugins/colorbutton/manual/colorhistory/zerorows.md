@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

**Note:** At the beginning open console and watch for errors (especially when picking colors).

1. Click on color button.

  **Expected:** Only the default color button UI is displayed (automatic color, default palette and `More Colors` button).

  **Unexpected:** Horizontal rule, empty row or additional color boxes are visible.

1. Pick any color from default palette.
1. Click on color button.

  **Expected:**  No new UI elements appeared.

  **Unexpected:**  Color history row or console errors appeared.

1. Open `More Colors` dialog.
1. Pick any color.
1. Click on color button.

  **Expected:**  No new UI elements appeared.

  **Unexpected:**  Color history row or console errors appeared.

1. Repeat all previous steps for background color button.
1. Repeat all previous steps for each editor type.
