@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, flash, toolbar

1. Click `flash` button.
2. Verify status above the editor.

## Expected

**editing:** `false`

**model:** `false`


3. Fill dialog fields and click `Ok`.
4. Double click inserted `flash` to open dialog again.
5. Verify status above the editor.

## Expected

**editing:** `true`

**model:** `true`
