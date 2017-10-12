/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test adding buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbarView( this.editor );
			panel.addUIElements( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			assert.isNotUndefined( panel.getUIElement( 'cut' ), 'The button should exist.' );

		},
		'test removing buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbarView( this.editor );
			panel.addUIElements( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			panel.deleteUIElement( 'cut' );
			assert.isUndefined( panel.getUIElement( 'cut' ), 'The button should be deleted.' );

		}
	} );
} )();
