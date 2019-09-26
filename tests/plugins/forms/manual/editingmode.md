@bender-include: ../../dialog/manual/_helpers/tools.js
@bender-tags: dialog, 4.13.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, forms, image, toolbar

**NOTE:** For modern browsers you will see "real" HTML in **expected** results instead of `[element HTML]` string.

1. Click `form` button.
2. Verify status above the editor.

## Expected

Dialog name: **form** in **editor** editor.

Dialog is in **creation** mode.

Currently editing: null

---

**NOTE:** When testing with Firefox, some of the form elements are not clickable, however can be edited by by selecting them and clicking appropriate button in the toolbar.

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
* `imagebutton`
* `hiddenfield`
