@bender-ui: collapsed
@bender-tags: bug, 4.10.0, 1816, tableselection
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, tableselection, clipboard, enterkey, floatingspace, basicstyles, list, undo, elementspath

**Test Case 1**

1. Select few cells to have activated tableselection.
2. Press <kbd>Enter</kbd>.
3. Select other cells.
4. Press <kbd>Shift</kbd> + <kbd>Enter</kbd>

**Expected result:**
* All selected cells are emptied when <kbd>Enter</kbd> or <kbd>Shift</kbd> + <kbd>Enter</kbd> is pressed.
* Carret appear in 1st selected cell.
* Selection is cleared out.

**Unexpected result:**
* Table became broken ( cells are reordered, paragraphs appear instead of table cell ).
* Fake selection persist in table.

----
**Test case 2:**
1. Put cursor in table.
2. Create list inside table
3. Add new list item with <kbd>Enter</kbd> key

**Expected result:**
* New list item is added inside table.
