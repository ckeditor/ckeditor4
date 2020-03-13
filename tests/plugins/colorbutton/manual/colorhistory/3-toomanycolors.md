@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Click on color button.

1. Pick any color that isn't in color history row yet (e.g. <span style="color:#F39C12">orange</span>).

1. Click on color button.

  **Expected:**

  * There are still six color boxes in history.
  * The yellow one that was furthest to the right doesn't exist anymore.

  **Unexpected:**

  * Seventh color box appeared.
  * Yellow box is still visible, another one disappeared instead.

1. Repeat all previous steps for each editor type.
