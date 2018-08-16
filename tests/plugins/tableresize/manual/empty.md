@bender-ui: collapsed
@bender-tags: bug, 4.7.0, trac14762
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize, basicstyles, undo

Drag the mouse over the empty table.

**Expected**: No changes in the user interface. No error occurred in the browser developer console.

**Unexpected**: An error in the browser developer console occurred: `Unable to get property 'cells' of undefined or null reference`
