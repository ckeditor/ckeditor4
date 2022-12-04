@bender-tags: feature, 5352, 4.20.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea

1. Click **Text Color** button.
2. Hover over any color.

### Expected:

Custom style from string has been applied, and all color squares are now circles.
Custom style from file has been applied, and outline around hovered color is a circle.


### Unexpected:

Custom style from string has not been applied, and color squares have default square shape.
Custom style from file has not been applied, and outline around hovered color is a square.
