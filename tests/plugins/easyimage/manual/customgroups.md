@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../_helpers/tools.js


## Styles Group

This manual test shows how one could add style groups unrelated to positioning.

1. Click on image widget.
1. Click "Side Image" button.
1. Click "Border1" button.
	## Expected

	* Green outline is applied to the widget.
	* Border1 button becomes active.
	* Side image style **remains active** too.
2. Click "Border2" button.
	## Expected:

	* "Border1" button gets deactivated.
	* "Border2" button becomes active.
	* Green outline is replaced with a pink one.
	* Side image style **remains active**.

Repeat test for the "Divarea editor".

**Note:** custom styles might not have an icon.
