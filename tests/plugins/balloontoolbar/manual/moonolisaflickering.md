@bender-ui: collapsed
@bender-tags: 4.11.0, bug, balloontoolbar, 1682
@bender-ckeditor-plugins: wysiwygarea,toolbar,balloontoolbar,image,stylescombo

1. Focus the image.
1. Hover over balloon options.

## Expected

* Balloon option hovers smoothly.
* Hovered option has equal left and right margin.
* Options separator is hidden under hover style.

## Unexpected

* Visible flickering occurs on the right edge of the balloon panel.
* Hovered option has bigger right margin compared to left margin.
* Options separator is visible under hover style.
