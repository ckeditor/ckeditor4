/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */
/* bender-include: _helpers/tools.js */
/* global colorTools */

( function() {
	'use strict';

	bender.editor = true;

	var isIE8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

	bender.test( {
		_should: {
			// IE8 doesn't set unsupported/incorrect values.
			ignore: {
				'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': isIE8,
				'test converting RGBA to hex color': isIE8,
				'test converting HSL to hex color': isIE8,
				'test converting HSLA to hex color': isIE8,
				'test converting transparent value to hex color': isIE8
			}
		},

		'test colordialog add hash to color\'s values with 6 hexadecimal digits': function() {
			colorTools.assertColor( this.editor, '123456', '#123456' );
		},

		'test colordialog add hash to color\'s values with 3 hexadecimal digits': function() {
			colorTools.assertColor( this.editor, 'FDE', '#FDE' );
		},

		'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': function() {
			colorTools.assertColor( this.editor, '1', '1' );
		},

		'test colordialog does not add hash to color name': function() {
			colorTools.assertColor( this.editor, 'red', 'red' );
		},

		'test colordialog does not add hash to rgb color value': function() {
			colorTools.assertColor( this.editor, 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash to empty value ': function() {
			colorTools.assertColor( this.editor, '', '' );
		},

		// (#2639)
		'test colordialog setting text color by clicking on UI buttons': function() {
			colorTools.openDialogManually( this.editor, '#ff0000', '<h1>[<span style="color:#ff0000">Foo</span>]</h1>', 'TextColor' );
		},

		// (#2639)
		'test colordialog setting background color by clicking on UI buttons': function() {
			colorTools.openDialogManually( this.editor, '#0000ff', '<h1>[<span style="background-color:#0000ff">Foo</span>]</h1>', 'BGColor' );
		},

		// (#2639)
		'test omitting default text color': function() {
			colorTools.openDialogManually( this.editor, '', '<h1>[Foo]</h1>', 'TextColor' );
		},

		// (#2639)
		'test omitting default background color': function() {
			colorTools.openDialogManually( this.editor, '', '<h1>[Foo]</h1>', 'BGColor' );
		},

		// (#2639)
		'test text color of mixed selection': function() {
			colorTools.openDialogManually( this.editor, '', '<h1>[<span style="color:#0000ff">Foo</span>bar]</h1>', 'TextColor' );
		},

		// (#2639)
		'test background color of mixed selection': function() {
			colorTools.openDialogManually( this.editor, '', '<h1>[<span style="background-color:#0000ff">Foo</span>bar]</h1>', 'BGColor' );
		},

		// (#4351)
		'test converting RGBA to hex color': function() {
			colorTools.assertSettingAndGettingColor( this.editor, {
				inputColor: 'rgba(100,200,50,.4)',
				expectedColor: '#c1e9ad',
				button: 'TextColor'
			} );
		},

		// (#4351)
		'test converting HSL to hex color': function() {
			colorTools.assertSettingAndGettingColor( this.editor, {
				inputColor: 'hsl(150,50%,52%)',
				expectedColor: '#47c285',
				button: 'TextColor'
			} );
		},

		// (#4351)
		'test converting HSLA to hex color': function() {
			colorTools.assertSettingAndGettingColor( this.editor, {
				inputColor: 'hsla(150,50%,52%,0.2)',
				expectedColor: '#daf3e7',
				button: 'TextColor'
			} );
		},

		// (#4351)
		// This particular value should be _broken_ until the whole flow is fixed in #4592.
		// Otherwise automatic values in colorbutton become broken.
		'test converting transparent value to hex color': function() {
			colorTools.assertSettingAndGettingColor( this.editor, {
				inputColor: 'rgba(0,0,0,0)',
				expectedColor: '#rgba(0, 0, 0, 0)',
				button: 'TextColor'
			} );
		}
	} );

} )();
