@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Select the word `Hello`.
1. Click on color button.

  **Expected:**

  The first color box from the default palette is selected.

  **Unexpected:**

  The first box from the color history is selected.

1. Change color to `Pale red` using the color box from the color history.
1. Open color panel without changing selection in the editor.

  **Expected:**

  Color box from the color history is selected.

  **Unexpected:**

  Color box from the default palette is selected.

1. Close the panel without changing color and change selection in editor.
1. Select the world `Hello` again.
1. Open color panel.

  **Expected:**

  The `Pale red` box from the default palette is selected.

  **Unexpected:**

  The box from color history is selected.

1. Repeat for each editor.
