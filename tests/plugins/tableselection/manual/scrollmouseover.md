@bender-ui: collapsed
@bender-tags: bug, bug, 4.7.1, 515
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, tableselection

**Procedure:**

1. Open developer console.
2. Focus on editor.
3. Use mouse to scroll down the editor.

**Expected result:**

No error in the console.

**Unexpected result:**

Error is thrown into console:

`Uncaught TypeError: target.getAscendant is not a function`
