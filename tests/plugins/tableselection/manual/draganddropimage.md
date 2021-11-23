@bender-tags: dialog, 4.17.2, 547, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableselection, image, undo, sourcearea, basicstyles, elementspath


1. Open browser's console.
3. Using drag&drop move image to other table cell.

**Expected**

* Image was moved properly.
* The content looking good and there is no error in the console.

**Unxpected**

* Image was not moved.
* There's error in the console.
* After the image was moved, the table was modified - an extra cell was added.
