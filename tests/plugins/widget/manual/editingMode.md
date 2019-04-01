@bender-tags: widget, dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, placeholder

1. Click `placeholder` widget button.
2. Verify widget status above the editor.

## Expected

**editing:** `false`

**model:** `true`


3. Insert `foo` `placeholder` name and click `OK`.
4. Double click `placeholder` widget to open dialog again.
5. Verify widget status above the editor.

## Expected

**editing:** `true`

**model:** `true`
