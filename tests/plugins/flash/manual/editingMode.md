@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, flash, toolbar

1. Click `flash` button.
2. Verify status above the editor.

## Expected

Dialog name: **flash** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

3. Insert `example.com` `flash` URL and click `OK`.
4. Double click `flash` to open dialog again.
5. Verify status above the editor.

## Expected

Dialog name: **flash** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`
