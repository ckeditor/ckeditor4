@bender-ui: collapsed
@bender-tags: bug, 4.10.1, 1816, tableselection
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, tableselection, clipboard, enterkey, floatingspace, basicstyles, list, undo, elementspath

## Important: Repeat tests in all editors.

**Test Case 1**
1. Select few cells to have activated tableselection.
2. Press <kbd>Enter</kbd> key or <kbd>Shift</kbd> + <kbd>Enter</kbd> combination.

**Expected result:**
* All selected cells are emptied when <kbd>Enter</kbd> or <kbd>Shift</kbd> + <kbd>Enter</kbd> is pressed.
* Carret appear in 1st selected cell and appropriate new line tag is added.
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
* New list item is added inside table, when enter is pressed.

----
**Test case 3:**
1. Put cursor in single table cell at beginning ( and later on ending ) of the table cell
2. Press <kbd>Enter</kbd> key or <kbd>Shift</kbd> + <kbd>Enter</kbd> combination.

**Expected result:**
* New line appear in table cell, before or after text depend where caret was located.

----
**Test case 4:**
1. Check how undo/redo integrate with this fix.

**Expected result:**
* Clearing selected content and adding new paragraph should be stored as single undo step.
