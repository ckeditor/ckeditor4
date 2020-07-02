@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Select the word `Hello`.
1. Click on color button.
1. Press an `arrow up` key.

  **Expected:** Focus moved to the `Vivid yellow` color box.

  **Unexpected:** Focus is stucked in color history part of panel.

1. Press an `arrow right` key three times.

  **Expected:** Focus moved to through the color history to `More colours` button.

  **Unexpected:** Focus stopped before color history or moved directly to `More colours` button.

1. Press an `arrow left` key and `space` afterwards.

  **Expected:** Color of the selected word changed.

  **Unexpected:** Color change wasn't applied or panel is still opened.
