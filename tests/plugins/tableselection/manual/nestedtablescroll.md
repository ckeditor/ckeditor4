@bender-ui: collapsed
@bender-tags: tc, 17052, 4.7.1
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

**Procedure:**

1. Open console.
2. Select cells inside nested table.
3. Without releasing mouse button, move pointer to the bottom edge of the editor to cause scrolling down to the end of the editor.

**Expected result:**

* Selection is contained inside nested table.
* There are no errors in the console.

**Unexpected result:**

* There are errors in the console.
