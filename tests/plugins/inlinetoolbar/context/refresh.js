/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*]'
		}
	};

	bender.test( {
		'test refresh returning true': function() {
			var context = this._getContextStub( sinon.stub().returns( true ) );

			context.refresh();

			assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test refresh returning false': function() {
			var context = this._getContextStub( sinon.stub().returns( false ) );

			context.refresh();

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		'test refresh returning falsy value': function() {
			var context = this._getContextStub( sinon.stub().returns( 0 ) );

			context.refresh();

			assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
			assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {Function} refreshCallback Function to be used as `options.refresh`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( refreshCallback ) {
			var ret = this.editor.plugins.inlinetoolbar.create( {
				refresh: refreshCallback
			} );

			sinon.stub( ret.toolbar, 'hide' );
			sinon.stub( ret.toolbar, 'show' );

			return ret;
		}
	} );
} )();
