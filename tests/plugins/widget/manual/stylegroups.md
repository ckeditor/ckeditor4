@bender-tags: widget, bug, 4.6.2, trac13818
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, image2, sourcearea

### Test widget style groups
Styles from the same group cannot be applied together. Each style can belong to couple different groups.

1. Click on the image.
1. Select `Style 1` from styles combo.
1. Select `Style 2`, check if `Style 1` is deselected.
1. Select `Style 3`, check if both `Style 2` and `Style 3` are still selected.
1. Select `Style 4`, check if all other styles are deselected.
