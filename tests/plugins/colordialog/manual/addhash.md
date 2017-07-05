@bender-tags: tc, feature, colordialog, 565, 4.8.0
@bender-ui: collapsed
@bender-ckeditor-plugins: table,tabletools,colordialog,toolbar,wysiwygarea,sourcearea,contextmenu

1. Right click into table cell.
1. Select `Cell -> Cell Properties`.
1. Press `Choose` button next to _Background color_
1. There should appear color dialog.
1. Type color value in input filed (just above `Clear` button) in hexadecimal 6-digit format **without** leading `#`. E.g. (`ABC123`).
1. Confirm it.
1. Inserted color should contain additional `#` at the beginning.
1. Repeat above steps for color with hexadecimal 3-digits format. E.g. (`FFF`).

**Note:** You can also check behave of color dialog with setting up values in different formats (rgb, text) or invalid hex strings. For such colors `#` should not be added.
