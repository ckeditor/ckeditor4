@bender-tags: bug, 4.8.0, forms, 834
@bender-ui: collapsed
@bender-ckeditor-plugins: forms, wysiwygarea, toolbar, sourcearea

----

1. Click in the editor.
2. Click "Radio" button.
3. Check "Selected" field in the dialog and press "Ok" to create a radio button.
4. Check source in editor.
5. Double click the radio.
6. Check "Selected" field in the dialog and press "Ok" to modify radio.
7. Check source in editor.

**Expected:**
* The state of radio button is changed according to settings.
* In source mode appeaers 'checked' attribute when radio button is marked as selected.

**Unexpected:**
* The state of radio button is not saved. 'Checked' attribute is **not present** in source mode.
