@bender-tags: 4.17.2, bug, 4952
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, image, clipboard, sourcearea, tableselection, elementspath

**Note:** Do not add extra empty space in a table cell with an image before D&D.

1. Using the Drag&drop move the image to another cell.

**Expected**

* The image was moved properly.

**Unexpected**

* The image has been moved with an additional nested table surrounding the image.
