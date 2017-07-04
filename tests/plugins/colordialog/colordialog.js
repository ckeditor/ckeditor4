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

		'test colordialog add hash to colors 6 digits': function() {
			this.assertColor( '123456', '#123456' );
		},

		'test colordialog add hash to colors 3 digits': function() {
			this.assertColor( 'FDE', '#FDE' );
		},

		'test colordialog does not add hash 1 digit': function() {
			// IE8 don't allow on totally wrong values of attributes
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			this.assertColor( '1', '1' );
		},

		'test colordialog does not add hash color name': function() {
			this.assertColor( 'red', 'red' );
		},

		'test colordialog does not add hash rgb': function() {
			this.assertColor( 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash empty value': function() {
			this.assertColor( '', '' );
		}
	} );
} )();
