@bender-tags: 4.19.0, feature, 4641
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, undo, clipboard, basicstyles, elementspath

This manual test checks if you can cancel editor initialization.
By clicking a cancel button, the editor initialization on attach button should be prevented.

**Note** That clicking an attach button before canceling will result in the failed test!

1. Click the cancel button to cancel delayed interval creation.
1. Click attach the button to attach the editor to the DOM.

**Expected** You should see plain text indicating that the editor has not been initialized.

**Unexpected** Fully functional editor.
