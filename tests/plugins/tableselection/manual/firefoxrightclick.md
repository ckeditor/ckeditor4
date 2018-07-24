@bender-ui: collapsed
@bender-tags: bug, 4.10.1, 2003
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

# Test steps:

1. Select all table cells.
1. Right click inside one of table cell.
1. Choose cell properties from context menu.
1. Change background color.

## Expected:

All selected cells has changed background colour.

## Unexpected:

Only cell that was right clicked has changed background colour.
