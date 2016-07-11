@bender-tags: 4.5.10, tc, 10750
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, sourcearea

1. Click on the second paragraph.
	* The font name in the combo box should be set.

1. Switch to source mode.
	* Somewhere in the source should be a `font-family` style with the value `font-family: 'Univers LT Std', sans-serif;`

This test should pass regardless of whether `Univers LT Std` is available.
