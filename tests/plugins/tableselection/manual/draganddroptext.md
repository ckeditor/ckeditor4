@bender-tags: dialog, 4.17.2 547, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableselection, undo, sourcearea, elementspath

**Note:** Before you start moving the selected text using D&D, hold down the left mouse button for a moment on selected text.

1. Open browser's console.
2. Select only text `Move me.`.
3. Using drag&drop move selected text to other table cell.

**Expected**

* Selected text was moved properly.
* The content looking good and there is no error in the console.

**Unxpected**

* Selected text was not moved.
* There's error in the console.
