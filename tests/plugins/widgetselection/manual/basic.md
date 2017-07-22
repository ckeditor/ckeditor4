@bender-tags: 4.6.1, bug, trac11064, widgetselection
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,widgetselection,elementspath,undo

----

## Proceed with all editor instances.

1. Focus editor instance.
1. Press `Ctrl/Cmd + a` to select all.

	**Expected:** Whole editor content gets selected.

	**Unexpected:** Caret moves to the beginning/end of the editor without selecting editor contents.

_Perform one of the 3 actions:_

* Type something
* Paste something

	**Expected:** The selection is immediately replaced by the typed/pasted content and the caret is at the end of the inserted content.

* Press a key

	**Expected:** Keys moving selection (like `left/right` arrow) should have proper effect. Keys which do not change selection
should not influence current selection in any way.
