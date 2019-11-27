@bender-tags: 4.10.0, feature, range, selection, 1902, 1915, 1925, 1930, tableselection
@bender-ckeditor-plugins: wysiwygarea, toolbar, codesnippet, image2, table, tableselection, sourcearea, placeholder, floatingspace

# Selection rectangles

This manual test checks the result returned by the `range.getClientRects()` inside our editor to test also fake selection. Returned results are visualized with red rectangles.

## Things to test:

1. Test [#1930](https://github.com/ckeditor/ckeditor4/issues/1930): after classic editor is initialized rectangle should match caret.

1. Select some table cells too see if red rectangles are matching the selection. Try different selections on the table and on the widgets.
Test selecting widget editable.

	Note: Selected widget should return only one rectangle matching its outermost boundaries.

1. Test [#1925](https://github.com/ckeditor/ckeditor4/issues/1925) for IE 9 and 10:

	Remove all content from editor. Write some one line text, and place selection at the end of it. Rect should appear at caret position.

1. For any browser:

	Remove all content from editor, check if rectangle matches caret position. And two more empty lines and check if rectangle matches selection when you place it in any line.

### Note:

Rectangles might vary depending on if you performed real selection on table or fake one. Fake selection happens when table cell are filled with blue color. Also keep in mind that the presented results, are values for the first rectangle from returned array.
gi
