/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {}
	};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		'test refresh returning true': function() {
			var context = this._getContextStub( sinon.stub().returns( true ), true );

			this._assertToolbarVisible( true, context );
		},

		'test refresh returning false': function() {
			var context = this._getContextStub( sinon.stub().returns( false ), true );

			this._assertToolbarVisible( false, context );
		},

		'test refresh returning falsy value': function() {
			var context = this._getContextStub( sinon.stub().returns( 0 ), true );

			this._assertToolbarVisible( false, context );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {Function} refreshCallback Function to be used as `options.refresh`.
		 * @param {Boolean} [autoRefresh=false] Whether function should automatically force context
		 * manager, to recheck all the contexts.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( refreshCallback, autoRefresh ) {
			var ret = this.editor.plugins.inlinetoolbar.create( {
				refresh: refreshCallback
			} );

			if ( autoRefresh ) {
				this.editor.plugins.inlinetoolbar._manager.check();
			}

			return ret;
		},

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		}
	} );
} )();
