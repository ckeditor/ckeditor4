/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar,button,richcombo */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test adding buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			assert.isInstanceOf( CKEDITOR.ui.button, panel.getItem( 'cut' ), 'Registered button type.' );
		},

		'test removing buttion': function() {
			var panel = new CKEDITOR.ui.inlineToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			assert.isInstanceOf( CKEDITOR.ui.button, panel.getItem( 'cut' ), 'Registered button type.' );
			panel.deleteItem( 'cut' );
			assert.isUndefined( panel.getItem( 'cut' ), 'The button should be deleted.' );
		},

		'test group wrapping': function() {
			var panel = new CKEDITOR.ui.inlineToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			panel._view.renderItems( panel._items );
			assert.isNotNull( panel._view.parts.content.findOne( '.cke_toolgroup' ), 'Button should be wrapped in group' );
		}
	} );
} )();
