/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar,basicstyles */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*]'
		}
	};

	bender.test( {
		'test integration selectionChange with options.refresh': function() {
			var context = this.editor.plugins.inlinetoolbar.create( {
					buttons: 'Bold,Italic,Underline',
					refresh: function( editor, path ) {
						return path.contains( 'em' );
					}
				} ),
				newRange = this.editor.createRange(),
				emElem;

			this.editorBot.setHtmlWithSelection( '<p>Test^ <strong>Foo</strong><em>bar</em></p>' );

			emElem = this.editor.editable().findOne( 'em' );

			// First set the selection in a place where inline toolbar should not be shown.
			// Set range at <strong>F^oo</strong>.
			newRange.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
			newRange.collapse( true );

			this.editor.getSelection().selectRanges( [ newRange ] );

			this._assertToolbarVisible( false, context );

			// Now, change the selection to a place that should show the toolbar.
			// For example: "<em>b^ar</em>".
			newRange.setStartAt( emElem.getFirst(), 1 );
			newRange.collapse( true );

			this.editor.getSelection().selectRanges( [ newRange ] );

			this._assertToolbarVisible( true, context );

			context.destroy();
		},

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), 'Toolbar visibility' );
		}
	} );
} )();
