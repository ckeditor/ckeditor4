/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// We're using various weird markup combinations, thus disabling ACF filtering.
			allowedContent: true
		}
	};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test falsy matching': function() {
			var context = this._getContextStub( 'video' );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			this._assertToolbarVisible( false, context );
		},

		'test correct matching': function() {
			var context = this._getContextStub( 'strong' );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			this._assertToolbarVisible( true, context );
		},

		'test correct matching multiple': function() {
			var context = this._getContextStub( 'em;strong;s' );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			this._assertToolbarVisible( true, context );
		},

		'test ACF matching by attribute': function() {
			var context = this._getContextStub( 'strong[data-foo-bar]' );

			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1">foo^ bar</strong></p>' );

			this._assertToolbarVisible( true, context );
		},

		'test ACF reject by attribute': function() {
			var context = this._getContextStub( 'strong' );

			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1">foo^ bar</strong></p>' );

			this._assertToolbarVisible( false, context );
		},

		'test ACF reject by style': function() {
			var context = this._getContextStub( 'strong[data-foo-bar]' );

			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1" style="text-decoration: underline">foo^ bar</strong></p>' );

			this._assertToolbarVisible( false, context );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {String} selector A selector to be used as `options.elements`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( selector ) {
			return this.editor.plugins.inlinetoolbar.create( {
				elements: selector
			} );
		},

		/*
			* @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
			*/
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		}
	} );
} )();
