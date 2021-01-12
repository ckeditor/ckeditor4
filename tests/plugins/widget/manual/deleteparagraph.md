@bender-ui: collapsed
@bender-tags: 4.15.1, bug, 1572
@bender-ckeditor-plugins: wysiwygarea,toolbar,forms,widget,undo,basicstyles,entities,sourcedialog

1. Place the cursor in the empty paragraph between the two simplebox widgets.
1. Hit the backspace key.

**Expected:** The empty paragraph is removed and the first widget is selected. No visible characters are deleted (use source dialog to verify).

**Unexpected:** The empty paragraph is not removed.