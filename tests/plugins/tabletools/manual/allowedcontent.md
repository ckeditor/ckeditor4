@bender-tags: 4.10.0, 1986, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, sourcearea

# Test scenario

For each editor:
1. Open context menu for table cell.
1. Choose cell properties from context menu.

## Expected

#### First editor:

Dialog is empty.

#### Second editor:

Dialog has all listed options:
- Width,
- Height,
- Word Wrap,
- Horizontal Align,
- Vertical Align,
- Cell Type,
- Rows Span,
- Cols Span,
- Background Color,
- Border Color

It is possible to change any of cell property via dialog.

## Unexpected

First editor has any option in dialog,
Second editor has any missing option in dialog,
It is impossible to change any property via dialog in second editor.
