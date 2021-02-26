@bender-tags: 4.17.0, bug, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo


1. Type anything in the editor.

2. Change text formatting. For example to 'Heading 1'.

3. Reattach editor with double click on "Toggle" button.

**Expected:** There are two undo steps.

**Unexpected:** Number of undo steps is different than two.
