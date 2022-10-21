@bender-tags: 4.20.1, bug, 4802 
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, sourcearea, elementspath, undo, floatingspace, tab

1. Put the caret in the first cell.
2. Press <kbd>Tab</kbd>.
3. Press <kbd>Backspace</kbd>.

**Expected** The selection stays in the second cell.

**Unexpected** The selection is moved to the first cell.
