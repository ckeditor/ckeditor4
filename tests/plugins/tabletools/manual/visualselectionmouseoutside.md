@bender-ui: collapsed
@bender-tags: tc, 18
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, elementspath, floatpanel

**Procedure for both editors:**

1. Select more than one cell.
2. With left button pressed move the cursor outside of the table, e.g. to the right hand side.
3. Release the left mouse button outside of the table.
4. Repeat for other edges of table.

**Expected result:**

Visual selection is visible.

**Unexpected results:**

* Visual selection is cleared after releasing left mouse button.
* Releasing mouse button didn't end table selection (moving mouse cursor over table causes change in fake selection).
