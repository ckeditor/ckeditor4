/* bender-tags: balloontoolbar,context */
/* bender-ckeditor-plugins: balloontoolbar */
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
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
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

			this.editor.balloonToolbars.check();

			contextTools._assertToolbarVisible( true, context );

			sinon.assert.calledWithMatch( showSpy, function( actual ) {
				return actual.equals( emElem );
			} );
		},

		'test refresh subsequent negative matches will not override focus element': function() {
			this.editorBot.setHtmlWithSelection( '<p>foo<strong>ba^r</strong>baz<em>em</em></p>' );

			// Add a context that has a higher priority.
			this._getContextStub( sinon.stub().returns( false ), false, CKEDITOR.plugins.balloontoolbar.PRIORITY.HIGH );

			var emElem = this.editor.editable().findOne( 'em' ),
				context = this._getContextStub( sinon.stub().returns( emElem ) ),
				managerShowSpy = sinon.spy( context, 'show' );

			// Add a third context that has a higher priority, so that matching context is surrounded with unmatched contexts.
			this._getContextStub( sinon.stub().returns( false ), false, CKEDITOR.plugins.balloontoolbar.PRIORITY.HIGH );

			this.editor.balloonToolbars.check();

			contextTools._assertToolbarVisible( true, context );

			sinon.assert.calledWithMatch( managerShowSpy, function( actual ) {
				return actual.equals( emElem );
			} );
		},

		'test _matchRefresh return type': function() {
			var contextFalse = this._getContextStub( sinon.stub().returns( false ) ),
				contextTrue = this._getContextStub( sinon.stub().returns( true ) ),
				contextElem = this._getContextStub( sinon.stub().returns( new CKEDITOR.dom.element( 'p' ) ) );

			assert.isNull( contextFalse._matchRefresh( null, null ) );
			assert.isInstanceOf( CKEDITOR.dom.element, contextTrue._matchRefresh( null, null ), 'contextTrue return type' );
			assert.isInstanceOf( CKEDITOR.dom.element, contextElem._matchRefresh( null, null ), 'contextTrue return type' );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {Function} refreshCallback Function to be used as `options.refresh`.
		 * @param {Boolean} [autoRefresh=false] Whether function should automatically force context manager, to recheck all the contexts.
		 * @param {Number} [priority] Context priority based on {@link CKEDITOR.plugins.balloontoolbar#PRIORITY}.
		 * @returns {CKEDITOR.plugins.balloontoolbar.context}
		 */
		_getContextStub: function( refreshCallback, autoRefresh, priority ) {
			var ret = this.editor.balloonToolbars.create( {
				refresh: refreshCallback,
				priority: priority
			} );

			if ( autoRefresh ) {
				this.editor.balloonToolbars.check();
			}

			return ret;
		}
	} );
} )();
