@bender-tags: 4.10.0, feature, range, selection, 1902, 1915, tableselection
@bender-ckeditor-plugins: wysiwygarea, toolbar, codesnippet, table, tableselection, sourcearea

# Selection rectangles

This manual test checks the result returned by the `range.getClientRects()` on fake selection. Returned results are visualized with red rectangles.

## Things to test:

Select some table cells too see if red rectangles match the selection. Try different selections on the table and on the widget.

### Note:

Rectangles might vary depending on if you performed real selection on table or fake one. Fake selection happens when table cell are filled with blue color. Also keep in mind that the presented results, are values for the first rectangle from returned array.
