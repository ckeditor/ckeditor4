@bender-tags: tc, 4.5.6, 12465, forms
@bender-ui: collapsed
@bender-ckeditor-plugins: forms, wysiwygarea, toolbar

###ONLY IN BLINK/WEBKIT###

----

1. Click in the editor.
2. Click "Checkbox" button.
3. Check "Selected" field in the dialog and press "Ok" to create a checkbox.
4. Double click the checkbox.
5. Check "Selected" field in the dialog and press "Ok" to modify the checkbox.

**Expected:**
* The state of checkbox is changed.

----

Repeat the same operation with "Radio Button" button.

**Expected:**
* The state of radio button is changed.
