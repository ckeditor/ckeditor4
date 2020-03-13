@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Click on color button.

1. Pick any color that isn't in color history row yet (e.g. <span style="color:#F39C12">orange</span>).

1. Click on color button.

  **Expected:**

  * Second color history row appeared.
  * Yellow color box was moved to the new row.

  **Unexpected:**

  * Seventh color box appeared in the first row.
  * New row didn't appear.

1. Repeat all previous steps for background color button.

1. Repeat all previous steps for each editor type.
