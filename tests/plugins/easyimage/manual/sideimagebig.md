@bender-tags: 4.9.0, bug, 932, 1553
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, table, tableresize
@bender-include: ../_helpers/tools.js

## Image scaling

1. Play with resizing editor (by resizing browser window) or resizing single table cell.

## Expected

Easy image widget should occupy around 50% of parent container, unless the container is small enough that image minimum
size is reached (which is _10em based on 20px font-size_). When enlarging such container image size should also increase
(but to maximum of 50% parent container width).

**Notice**: In IE11 it may not be possible to resize the table cell in a way that it contains image perfectly, there will
always be some empty space left.
