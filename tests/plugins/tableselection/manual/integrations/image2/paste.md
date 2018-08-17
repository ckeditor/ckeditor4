@bender-ui: collapsed
@bender-tags: bug, 520, 4.7.2
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, elementspath, undo, image2

## Case 1

1. Copy image.
2. Put cursor in one of the cells.
3. Paste image.
4. Click image.

**Expected result:**

Image is inserted as widget.

**Unexpected result:**

Image is not a widget.


## Case 2

1. Copy image.
2. Select some cells.
3. Paste image.
4. Click image.

**Expected result:**

* Image is inserted as widget into the first selected cell.
* Other cells are emptied.
* All selected cells are still selected.

**Unexpected result:**

* Image is not inserted.
* Selection is modified.
* There are selection-connected errors in browser's console.

## Undo/redo

After pasting check if undo/redo is working correctly:

* The undo is enabled.
* Paste generates only one snapshot.
