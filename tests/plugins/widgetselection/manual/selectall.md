@bender-tags: 4.6.1, bug, trac11064, widgetselection
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,sourcearea,widgetselection,selectall,elementspath,undo

## Selectall integration

1. Set the selection in following position `Hello^ world!`.
1. Press "Select all" button.

**Expected:** Whole editor content gets selected.

**Unexpected:** Caret moves to the beginning/end of the editor without selecting editor contents.
