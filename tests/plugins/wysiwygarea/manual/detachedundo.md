@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Change text formatting to 'Heading 1'.

2. Reattach editor with double click on "Toggle" button.

**Expected:** There is exactly one undo step.

**Unexpected:** Number of undo steps is different than one.
