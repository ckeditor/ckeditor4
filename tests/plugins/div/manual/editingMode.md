@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, div, toolbar, contextmenu

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Click `div` button.
2. Verify link above the editor.

## Expected

Dialog name: **creatediv** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

3. Insert div element. You can choose 'special container' as a style so it's nicely visible after insertion.
4. Open context menu.
5. Select div editing option.
6. Verify status above the editor.

## Expected

Dialog name: **editdiv** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`
