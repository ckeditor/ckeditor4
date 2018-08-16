@bender-tags: feature, colordialog, 565, 4.8.0
@bender-ui: collapsed
@bender-ckeditor-plugins: table,tabletools,colordialog,toolbar,wysiwygarea,sourcearea,contextmenu

1. Right click into table cell.
1. Select `Cell -> Cell Properties`.
1. Press `Choose` button next to _Background Color_.
	* Color dialog should appear.
1. Type color value in input field (just above `Clear` button) in hexadecimal 6-digit format **without** leading `#`. E.g. (`ABC123`).
1. Confirm it.
	* **Expected**: Inserted color should contain additional `#` at the beginning.
1. Repeat above steps for color with hexadecimal 3-digits format. E.g. (`FFF`).

**Note:** You can also check the behaviour of color dialog by setting values in different formats (rgb, text) or invalid hex strings. For such colors `#` should not be added.
