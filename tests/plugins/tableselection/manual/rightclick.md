@bender-ui: collapsed
@bender-tags: bug, 4.11.0, 1264
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, elementspath

1. Select some table cells.
1. Right click on table cell which is not selected.

## Expected

- Context menu opens, and none of cells is selected.

## Unexpected

- Cells remains selected.

### Note:
Right click on table border will clear selection, as it fires event with whole table as target, not particular cell.
