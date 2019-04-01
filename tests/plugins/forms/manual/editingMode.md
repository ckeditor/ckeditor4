@bender-tags: dialog, 4.12.0, 2423, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, forms, toolbar

1. Click `form` button.
2. Verify status above the editor.

## Expected

**editing:** `false`

**model:** `false`


3. Fill empty fields and click `ok`.
4. Double click inserted form element to open dialog again.
5. Verify status above the editor.

## Expected

**editing:** `true`

**model:** `true`

6. Repeat 1-5 for the rest of the form controls, i.e.:


* `checkbox`
* `radiobutton`
* `textfield`
* `textarea`
* `select`
* `button`
* `hiddenfield`
