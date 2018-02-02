@bender-tags: 4.9.0, bug, 1543
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage

## Steps for both editors:

1. Focus first image caption.
1. Press Tab.
1. Select caption of second image with Ctrl + A.
1. Press Delete.
1. Press Shift + Tab or focus anywhere outside widget with mouse.

### Expected

Caption on second widget should be hidden.

### Unexpected

Caption remains visible.
