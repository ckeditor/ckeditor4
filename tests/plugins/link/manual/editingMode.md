@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, link, toolbar

1. Click `link` button.
2. Verify link status above the editor.

## Expected

**editing:** `false`

**model:** `false`


3. Insert `example.com` `link` URL and click `OK`.
4. Double click `link` to open dialog again.
5. Verify link status above the editor.

## Expected

**editing:** `true`

**model:** `true`

6. Repeat 1-5 for `anchor`.
