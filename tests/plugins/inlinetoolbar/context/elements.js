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
			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			var context = this._getContextStub( 'video' );

			context.refresh();

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test correct matching': function() {
			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			var context = this._getContextStub( 'strong' );

			context.refresh();

			assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test correct matching multiple': function() {
			this.editorBot.setHtmlWithSelection( '<p><strong>foo^ bar</strong></p>' );

			var context = this._getContextStub( 'em;strong;s' );

			context.refresh();

			assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test ACF matching by attribute': function() {
			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1">foo^ bar</strong></p>' );

			var context = this._getContextStub( 'strong[data-foo-bar]' );

			context.refresh();

			assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test ACF reject by attribute': function() {
			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1">foo^ bar</strong></p>' );

			var context = this._getContextStub( 'strong' );

			context.refresh();

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test ACF reject by style': function() {
			this.editorBot.setHtmlWithSelection( '<p><strong data-foo-bar="1" style="text-decoration: underline">foo^ bar</strong></p>' );

			var context = this._getContextStub( 'strong[data-foo-bar]' );

			context.refresh();

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {String} selector A selector to be used as `options.elements`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( selector ) {
			var ret = this.editor.plugins.inlinetoolbar.create( {
				elements: selector
			} );

			sinon.stub( ret.toolbar, 'hide' );
			sinon.stub( ret.toolbar, 'show' );

			return ret;
		}
	} );
} )();
