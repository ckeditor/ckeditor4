@bender-ui: collapsed
@bender-tags: bug, 4.10.1, 1816, tableselection
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, tableselection, clipboard, floatingspace, basicstyles, list, undo, elementspath
@bender-ckeditor-remove-plugins: enterkey

## Enter event **without** enterkey plugin:
1. Select few cells to have activated tableselection.
2. Press <kbd>Enter</kbd> key or <kbd>Shift</kbd> + <kbd>Enter</kbd> combination.
3. Repeat steps in all editors.

## Expected result:
* All selected cells are emptied when <kbd>Enter</kbd> or <kbd>Shift</kbd> + <kbd>Enter</kbd> is pressed.
* Carret appear in 1st selected cell and appropriate new line tag is added.
* Selection is cleared out.
