@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image, toolbar

1. Click `image` button.
2. Verify image status above the editor.

## Expected

**editing:** `false`

**model:** `false`


3. Fill up missing fields and click `OK`.
4. Double click `image` to open dialog again.
5. Verify image status above the editor.

## Expected

**editing:** `true`

**model:** `true`
