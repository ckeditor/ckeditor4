@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, link, toolbar

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Click `link` button.
2. Verify link above the editor.

## Expected

Dialog name: **link** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

3. Insert `example.com` `link` URL and click `OK`.
4. Double click `link` to open dialog again.
5. Verify status above the editor.

## Expected

Dialog name: **link** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

---

6. Repeat 1-5 for `anchor`.
