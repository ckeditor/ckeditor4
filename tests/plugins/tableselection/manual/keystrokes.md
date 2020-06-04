@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, basicstyles, sourcearea, elementspath, undo, autogrow

**Procedure:**

1. Select two or more table cells.
2. Press one of the keys listed below.
3. Check if the behavior linked to the key is present.

**Backspace/Delete:**

* Visual selection is discarded.
* Content from all cells is deleted.
* Selection is collapsed and moved to the first selected table cell.

**Left Arrow:**

* Visual selection is discarded.
* Selection is collapsed and moved to the beginning of the first selected table cell.

**Right Arrow:**

* Visual selection is discarded.
* Selection is collapsed and moved to the end of the last selected table cell.

**Any printable character:**

* Visual selection is discarded.
* The character is typed into the first selected table cell and collapsed selection is placed after it.
