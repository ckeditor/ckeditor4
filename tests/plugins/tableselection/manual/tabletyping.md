@bender-ui: collapsed
@bender-tags: bug, 867, 4.7.3
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, basicstyles, sourcearea, elementspath, undo, autogrow

**Procedure:**

1. Open console.
2. Select table via editor's elements path.
3. Type any letter.

**Expected:**

* Table is replaced with typed character.
* No error is thrown.

**Unexpected:**

* Table is empty, but still present in editor's content (you can check it in source mode).
* Error is thrown.
