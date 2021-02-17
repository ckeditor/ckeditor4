@bender-tags: 4.17.0, bug, 4462, wysiwygarea
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo


1. Type anything in the editor.

2. Change text formatting. For example to 'Heading 1'.

3. Click Toggle button twice to detach and reattach editor.

**Expected** There are two undo steps.

**Unexpected** Number of undo steps is different than two.
