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
			var context = this._getContextStub( {
				buttons: 'Bold,Italic,Underline',
				refresh: function( editor, path ) {
					return path.contains( 'em' );
				}
			} );

			// context.refresh();

			this.editorBot.setHtmlWithSelection( '<p>Test^ <strong>Foo</strong><em>bar</em></p>' );

			// bot.setHtmlWithSelection will trigger selection change, which will already do some refresh() calls.
			context.toolbar.hide.reset();
			context.toolbar.show.reset();

			var rng = this.editor.createRange();

			// Set range at <strong>F^oo</strong>.
			rng.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
			rng.collapse( true );

			this.editor.getSelection().selectRanges( [ rng ] );
			// debugger;

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );

			this._assertToolbarVisible( false );

			context.toolbar.hide.reset();
			context.toolbar.show.reset();

			var newRange = this.editor.createRange(),
				emElem = this.editor.editable().findOne( 'em' );

			newRange.setStartAt( emElem, CKEDITOR.POSITION_AFTER_START );
			newRange.setEndAt( emElem, CKEDITOR.POSITION_BEFORE_END );

			this.editor.getSelection().selectRanges( [ newRange ] );

			assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );

			this._assertToolbarVisible( true );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {Object} options
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( options ) {
			var ret = this.editor.plugins.inlinetoolbar.create( options );

			sinon.stub( ret.toolbar, 'hide' );
			sinon.stub( ret.toolbar, 'show' );

			return ret;
		},

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function() {
		}
	} );
} )();
