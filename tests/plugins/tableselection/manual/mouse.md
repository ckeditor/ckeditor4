@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, elementspath

Have fun with visual table selection!

**Procedure #1:**

1. Start selecting inside the empty space between cells.
2. Select more than one cell.

**Expected result:**

Visual selection is visible.

**Unexpected result:**

Native selection is visible.

---

**Procedure #2:**

1. Select some cells.
2. Press right mouse button in space between cells.

**Expected result:**

* Context menu with `Cells`→`Merge cells` option active is shown.
* Visual selection is still visible.

**Unexpected result:**

* Context menu with `Cells`→`Merge cells` option disabled is shown.
* Native selection is visible.
