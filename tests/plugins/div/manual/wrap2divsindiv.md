@bender-tags: tc, div, 13585, 4.7.0
@bender-ui: collapsed
@bender-ckeditor-plugins: div, toolbar, wysiwygarea, sourcearea

----
1. Open console.
2. Select the fragment marked with brackets.
3. Click the "DIV" button on the toolbar to open the dialog.
4. Click "OK" in the dialog.
5. Click the "Source" button.

**Expected:**
* There shouldn't be any error in the console.
* The source should be equal to: `<div><div>Some [text</div><div>to be] selected</div></div>`
