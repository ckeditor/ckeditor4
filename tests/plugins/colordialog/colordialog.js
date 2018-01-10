/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		assertColor: function( inputColor, outputColor ) {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', inputColor );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( outputColor, color );
				} );
			} );
			wait();
		},

		'test colordialog add hash to color\'s values with 6 hexadecimal digits': function() {
			this.assertColor( '123456', '#123456' );
		},

		'test colordialog add hash to color\'s values with 3 hexadecimal digits': function() {
			this.assertColor( 'FDE', '#FDE' );
		},

		'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': function() {
			// IE8 doesn't set incorrect values.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			this.assertColor( '1', '1' );
		},

		'test colordialog does not add hash to color name': function() {
			this.assertColor( 'red', 'red' );
		},

		'test colordialog does not add hash to rgb color value': function() {
			this.assertColor( 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash to empty value ': function() {
			this.assertColor( '', '' );
		}
	} );
} )();
