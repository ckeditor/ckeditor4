@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Click on color button.
1. Pick any color from default palette.
1. Click on color button.

  **Expected:** Picked color appeared in the first place in color history and is selected.

  **Unexpected:** Picked color didn't appear or it is last instead of first.

1. Open `More Colors` dialog.
1. Pick any color.
1. Click on color button.

  **Expected:** Picked color appeared in the first place in color history and is selected.

  **Unexpected:** Picked color didn't appear or it is last instead of first.

1. Pick the same color from the default pallete you chose at the first time.
1. Click on color button.

  **Expected:** Chosen color box moved to the first position.

  **Unexpected:** Color box is duplicated or didn't move.

1. Undo all changes.
1. Click on color button.

  **Expected:** All color boxes are still visible.

  **Unexpected:** Color boxes disappeared (some or all of them).

1. Repeat all previous steps for each editor type.
