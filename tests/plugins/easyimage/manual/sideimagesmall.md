@bender-tags: 4.9.0, bug, 932, 1553
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, table, tableresize
@bender-include: ../_helpers/tools.js

## Image scaling

1. Play with resizing editor (by resizing browser window) or resizing single table cell.

## Expected

Image inside easy image widget should not be resized or get smaller/bigger.

The widget itself in some edge cases (resized to big/tiny viewport) might slightly change its size, but it should not be a significant change.
