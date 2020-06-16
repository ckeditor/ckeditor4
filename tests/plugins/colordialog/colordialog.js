/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */
/* bender-include: _helpers/tools.js */
/* global assertColor, openDialogManually */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		'test colordialog add hash to color\'s values with 6 hexadecimal digits': function() {
			assertColor( this.editor, '123456', '#123456' );
		},

		'test colordialog add hash to color\'s values with 3 hexadecimal digits': function() {
			assertColor( this.editor, 'FDE', '#FDE' );
		},

		'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': function() {
			// IE8 doesn't set incorrect values.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			assertColor( this.editor, '1', '1' );
		},

		'test colordialog does not add hash to color name': function() {
			assertColor( this.editor, 'red', 'red' );
		},

		'test colordialog does not add hash to rgb color value': function() {
			assertColor( this.editor, 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash to empty value ': function() {
			assertColor( this.editor, '', '' );
		},

		// (#2639)
		'test colordialog setting text color by clicking on UI buttons': function() {
			openDialogManually( this.editor, '#ff0000', '<h1>[<span style="color:#ff0000">Foo</span>]</h1>', 'TextColor' );
		},

		// (#2639)
		'test colordialog setting background color by clicking on UI buttons': function() {
			openDialogManually( this.editor, '#0000ff', '<h1>[<span style="background-color:#0000ff">Foo</span>]</h1>', 'BGColor' );
		},

		// (#2639)
		'test omitting default text color': function() {
			openDialogManually( this.editor, '', '<h1>[Foo]</h1>', 'TextColor' );
		},

		// (#2639)
		'test omitting default background color': function() {
			openDialogManually( this.editor, '', '<h1>[Foo]</h1>', 'BGColor' );
		},

		// (#2639)
		'test text color of mixed selection': function() {
			openDialogManually( this.editor, '', '<h1>[<span style="color:#0000ff">Foo</span>bar]</h1>', 'TextColor' );
		},

		// (#2639)
		'test background color of mixed selection': function() {
			openDialogManually( this.editor, '', '<h1>[<span style="background-color:#0000ff">Foo</span>bar]</h1>', 'BGColor' );
		}

	} );

} )();
