@bender-tags: 4.8.0, bug, 1008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, format

** Scenario 1: **

1. Select each word or put caret in each word and click `Text Colour`/`Background Colour` button.

### Expected result:

Proper text/background color should be highlighted in color panel.

### Unexpected result:

Text/background color in color panel is not highlighted.

** Scenario 2: **

1. Click `Text Colour`/`Background Colour` button.
2. Mouseover on each color element in color palette.

### Expected result:

For each color, a label is showing with a proper color name.

### Unexpected result:

Instead of color name in label, hex color appear.
