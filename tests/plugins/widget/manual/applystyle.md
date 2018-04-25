@bender-tags: 4.10, feature, 1566
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, sourcearea, undo
@bender-include: ../_helpers/tools.js

Testing adding classes, styles and attributes to widget

# Notes for tester:

* Start with focusing widget. Area below widget will display focused widget `styleDefinition` and `data`.
* If no widget is focused output will present registered widget with lowest id.
* Buttons with no icons will add/remove style:
	- `class` contains `test`,
	- `id = 'test'`,
	- `style` contains following: `font-size: 48px;`, `float: right`.
* Predefined attributes are:
	- `class = 'widget'`,
	- `style = 'width: 200px'`,
	- no id.
* Test adding/removing style to widget.
* Test if styles are preserved after copy/paste.
* Test if styles are preserved after going into and back from `sourcemode`.
* Test undo integration.
