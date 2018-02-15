@bender-tags: 4.10, feature, 1566
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, sourcearea

Testing adding classes, styles and attributes to widget

1. Focus widget
1. Press first button without icon on toolbar
	### Expected
	- Widget changes its backgroud color to red
	- Widget floats to right
	- Text size changes to 48
	- Text aligns to right

1. Open source
	### Expected
	Widget div has following attributes:
	- `class` contains `test`
	- `id = 'test'`
	- `style` contains following: `font-size: 48px;`, `float: right`, `width: 200px`

1. Leave source
1. Focus widget again
1. Press second button
	### Expected
	All changes on styling are reverted, background color, text align and text size.

1. open source again
	### Expected
	Widget has no `id` attribute, `class` doesn't contain `test` and `style` contains only `width: 200px`
