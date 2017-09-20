@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1574
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, tabletools, sourcearea, undo, elementspath

## `cellMerge` command

Perform steps for each editor.

1. Select multiple cells, e.g. 2x3 selection starting at "Cell 1.1.1" and ending at "Cell 1.3.2".
1. Right click on created table selection.
	**Expected:** Selection grays out, but is not shrinked to one cell.
1. Use option "Cell \ Merge Cells".

**Expected:**

* Selected cells are merged into a single cell.
* Merged cell is selected.

**Unexpected:**

* Selection is shrinked to one cell.
* Merged cell is not fully selected (e.g. has a collapsed selection).
