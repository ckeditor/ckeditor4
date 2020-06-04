@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, basicstyles, clipboard, sourcearea, undo, elementspath

**Things to check:**

* Selection began in nested table should be contained inside it.
* Selection inside one cell of parent table containing nested table should not trigger custom selection.
* Selection began in outer's table cell and ended in nested table's cell inside another outer's table cell should select cells from outer's table cell.
* Selection began in nested table and ended in parent's cell should leave nested cells selected.
* Selection inside nested table done via elementpath should select proper elements.
* Context menu for selected cells in outer table should be also possible to open inside nested table.
* Applying basic styles to the nested table cells is working correctly.
