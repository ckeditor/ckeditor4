@bender-tags: 4766, bug, 4.16.2, dialog, focus
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table

1. Click the table button.
2. Click `OK` when the dialog box opens.

 **Expected** Autofocus is fired, os keyboard is visible.

3. Try to type something using the os keyboard.

 **Expected** Typing is possible text is added correctly.

 **Unexpected** Typing is possible but no text is added.

4. Repeat the above steps by clicking the `Cancel` button in `step 2`.
