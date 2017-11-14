/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, toolbar, basicstyles */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'strong,em'
		}
	};

	bender.test( {
		tearDown: function() {
			if ( this.curContext ) {
				this.curContext.destroy();
				this.curContext = null;
			}
		},

		'test selectionChange with options.refresh': function() {
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

		'test moving focus out of the editor hides the toolbar': function() {
			// Note: this test is verified to fail with testing window blurred (e.g. when dev console window focused).
			this.curContext = this.editor.plugins.inlinetoolbar.create( {
					buttons: 'Bold,Italic',
					refresh: sinon.stub().returns( true )
				} );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^bar</strong></p>' );

			this._assertToolbarVisible( true, this.curContext );

			this.editor.once( 'blur', function() {
				resume( function() {
					this._assertToolbarVisible( false, this.curContext, 'Toolbar visibility after blurring the editor' );
				} );
			}, this, null, 99999 );

			// Keep in mind that modern browsers will "debounce" the focus event, it will happen asynchronously.
			CKEDITOR.document.getById( 'focusHost' ).focus();

			wait();
		},

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		}
	} );
} )();
