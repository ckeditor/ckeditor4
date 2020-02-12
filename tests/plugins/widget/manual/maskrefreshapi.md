@bender-ui: collapsed
@bender-tags: 4.14.0, feature, 3775
@bender-ckeditor-plugins: wysiwygarea,toolbar,clipboard,image2,sourcearea,list,undo,stylescombo

**Note:** Mask has a red border so it's positioning is visible without inspecting mask element.

1. Click `Fetch widget` button below editor.

  **Expected:**

  Widget expanded by the second row, which is covered by partial mask.

  **Unexpected:**

  Second row or mask didn't appear.

1. Add a new row in the widget's editable.

  **Expected:**

  Mask moved and still covers the right part of widget.

  **Unexpected:**

  Mask didn't move.

1. Switch to source mode and back.

  **Expected:**

  Mask is still visible.

  **Unexpected:**

  Mask disappeared.
