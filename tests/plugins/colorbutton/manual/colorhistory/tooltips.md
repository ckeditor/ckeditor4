@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

**Note:** At the beginning open console and watch for errors (especially when picking colors).

1. Click on color button.
1. Hover over the first color box from color history.

  **Expected:** Tooltip contains color name with color history annotation (`Strong Blue - Color History` or it's equivalent in other lang).

  **Unexpected:** Tooltip is empty or contains hex code instead of name.

1. Hover over the second color box from color history.

  **Expected:** Tooltip contains uppercase hex color code without `#` hash (`FF0000 - Color History`).

  **Unexpected:** Tooltip is empty, contains lowercase content or color name (`red`).

1. Repeat all previous steps for each editor type.
