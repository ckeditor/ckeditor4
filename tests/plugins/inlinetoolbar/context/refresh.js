/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar */
/* bender-include: _helpers/tools.js */
/* global contextTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
				assert.ignore();
			}
		},

		tearDown: function() {
			this.editor.inlineToolbar._manager._clear();
		},

		'test refresh returning true': function() {
			var context = this._getContextStub( sinon.stub().returns( true ), true );

			contextTools._assertToolbarVisible( true, context );
		},

		'test refresh returning false': function() {
			var context = this._getContextStub( sinon.stub().returns( false ), true );

			contextTools._assertToolbarVisible( false, context );
		},

		'test refresh returning falsy value': function() {
			var context = this._getContextStub( sinon.stub().returns( 0 ), true );

			contextTools._assertToolbarVisible( false, context );
		},

		'test refresh returning custom element': function() {
			this.editorBot.setHtmlWithSelection( '<p>foo<strong>ba^r</strong>baz<em>em</em></p>' );

			var emElem = this.editor.editable().findOne( 'em' ),
				context = this._getContextStub( sinon.stub().returns( emElem ) ),
				showSpy = sinon.spy( context, 'show' );

			this.editor.inlineToolbar._manager.check();

			contextTools._assertToolbarVisible( true, context );

			sinon.assert.calledWithMatch( showSpy, function( actual ) {
				return actual.equals( emElem );
			} );
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
			var ret = this.editor.inlineToolbar.create( {
				refresh: refreshCallback
			} );

			if ( autoRefresh ) {
				this.editor.inlineToolbar._manager.check();
			}

			return ret;
		}
	} );
} )();
