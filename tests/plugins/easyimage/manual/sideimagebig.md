@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, table, tableresize

## Image scaling

1. Play with resizing editor (by resizing browser window) or resizing single table cell.

## Expected

Easy image widget should occupy around 25% of parent container, unless the container is small enough that image minimum
size is reached (which is _10em based on 20px font-size_). When enlarging such container image size should also increase
(but to maximum of 25% parent container width).
