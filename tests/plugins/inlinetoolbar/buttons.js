/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test adding buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbarView( this.editor );
			panel.addMenuItems( {
				cut: {
					label: 'test',
					command: 'cut'
				}
			} );
			assert.isNotUndefined( panel.getMenuItem( 'cut' ), 'The button should exist.' );

		},
		'test removing buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbarView( this.editor );
			panel.addMenuItems( {
				cut: {
					label: 'test',
					command: 'cut'
				}
			} );
			panel.deleteMenuItem( 'cut' );
			assert.isUndefined( panel.getMenuItem( 'cut' ), 'The button should be deleted.' );

		}
	} );
} )();
