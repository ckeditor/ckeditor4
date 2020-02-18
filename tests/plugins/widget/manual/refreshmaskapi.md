@bender-ui: collapsed
@bender-tags: 4.14.0, feature, 3775
@bender-ckeditor-plugins: wysiwygarea,toolbar,clipboard,image2,sourcearea,list,undo,stylescombo

**Note:** Mask has a red border so it's positioning is visible without inspecting mask element,
but still keep the console opened and watch out for errors.

1. Click `Refresh widget mask` button below editor.

  **Expected:**

  Nothing happened.

  **Unexpected:**

  Error was thrown.

1. Click `Add missing widget HTML` button below editor.

  **Expected:**

  Widget expanded by the second row. It's not clickable, but there is no mask (red border).

  **Unexpected:**

  Second row didn't appear.

1. Click `Refresh widget mask` button below editor.

  **Expected:**

  Nothing happened.

  **Unexpected:**

  Error was thrown.

1. Click `Refresh widget parts` button below editor.

1. Click `Refresh widget mask` button below editor.

  **Expected:**

  Mask appeared over the second row.

  **Unexpected:**

  Mask didn't appear or error was thrown.

1. Add a new row in the widget's editable.

  **Expected:**

  Mask moved and still covers the right part of widget.

  **Unexpected:**

  Mask didn't move.

1. Switch to source mode and back.

  **Expected:**

  Mask is still visible and in the right place.

  **Unexpected:**

  Mask disappeared.
