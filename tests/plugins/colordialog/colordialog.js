/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */
/* bender-include: _helpers/tools.js */
/* global assertColor, assertColorAtDialogShow */

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
		'test colordialog setting current text color on opening': function() {
			assertColorAtDialogShow( this.editor, '#ff0000', '<h1><span style="color:#ff0000">Foo</span></h1>', 'TextColor' );
		},

		// (#2639)
		'test colordialog setting current background color on opening': function() {
			assertColorAtDialogShow( this.editor, '#0000ff', '<h1><span style="background:#0000ff">Foo</span></h1>', 'BGColor' );
		}
	} );

} )();
