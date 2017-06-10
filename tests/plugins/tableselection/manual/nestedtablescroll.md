@bender-ui: collapsed
@bender-tags: bug, trac17052, 493, 4.7.1
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

**Procedure:**

1. Open console.
2. Select cells inside nested table.
3. Without releasing mouse button, move pointer to the bottom edge of the editor to cause scrolling down to the end of the editor.

**Expected result:**

* Selection is contained inside nested table.
* Editable gets scrolled.
	* **Edge/IE** No scrolling occurs due to [#12115046](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12115046/).
* There are no errors in the console.

**Unexpected result:**

* There are errors in the console.