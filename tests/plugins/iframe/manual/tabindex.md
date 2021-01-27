@bender-tags: dialog, 4.16.0, 4388, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, iframe, toolbar, sourcearea, undo

1. Open `IFrame` dialog.
1. Examine checkboxes.

  **Expected**

  * There are 3 checkboxes you can mark.
  * Each checkbox has a label.

  **Unexpected**

  * Only 2 checkboxes are visible.
  * The last checkbox doesn't have a label.

1. Copy your current URL and paste it in the `URL` field and mark `Remove from tabindex` checkbox.
1. Click `OK` to close dialog.
1. Switch editor to source mode.

  **Expected**

  * Iframe has a `tabindex="-1"` attribute.

  **Unexpected**

  * Iframe doesn't have a `tabindex` attribute set or it is equal to a different value than `-1`.

1. Switch back to WYSIWYG mode.
1. Click the `First link` link below the editor.
1. Press `tab` key.

  **Expected**

  * Selection moved to the `Second link`, omitting the iframe.

  **Unexpected**

  * Element inside iframe is selected.
