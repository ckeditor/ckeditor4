@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Click on color button.

  **Expected:** Color history is empty.

  **Unexpected:** Color history was initially filled with colors.

1. Choose any color.
1. Click on color button.

  **Expected:** New color was added to color history.

  **Unexpected:** Color history is still empty.

1. Repeat all previous steps for each editor type.
