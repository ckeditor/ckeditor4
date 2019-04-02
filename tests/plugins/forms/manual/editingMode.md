@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, forms, toolbar

1. Click `form` button.
2. Verify status above the editor.

## Expected

Dialog name: **form** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

3. Fill empty fields and click `Ok`.
4. Double click `form` to open dialog again.
5. Verify status above the editor.

## Expected

Dialog name: **form** in **editor** editor.

Dialog is in **editing** mode.

Currently editing: `[element HTML]`

6. Repeat 1-5 for the rest of the form controls, i.e.:


* `checkbox`
* `radiobutton`
* `textfield`
* `textarea`
* `select`
* `button`
* `hiddenfield`
