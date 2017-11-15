/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, toolbar, basicstyles, sourcearea, widget */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong;h1'
		}
	};

	bender.test( {
		tearDown: function() {
			if ( this.contexts.length ) {
				// Destroy each registered context.
				CKEDITOR.tools.array.filter( this.contexts, function( curContext ) {
					curContext.destroy();
					return false;
				} );
			}
		},

		setUp: function() {
			this.contexts = [];

			this.editor.widgets.add( 'bar', {
				editables: {
					header: 'h1'
				}
			} );
		},

		'test options.refresh has the highest priority': function() {
			this.editorBot.setData( CKEDITOR.document.getById( 'widgetWithEditable' ).getHtml(), function() {
				var rng = this.editor.createRange();
				rng.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
				rng.collapse( true );

				this.editor.getSelection().selectRanges( [ rng ] );

				var contexts = this._createContexts( null, true );

				this._assertToolbarVisible( true, contexts.refresh, 'contexts.refresh visibility' );
				this._assertToolbarVisible( false, contexts.widgets, 'contexts.widgets visibility' );
				this._assertToolbarVisible( false, contexts.elements, 'contexts.elements visibility' );
			} );
		},

		'test options.refresh has the highest priority with widget selected': function() {
			this.editorBot.setData( CKEDITOR.document.getById( 'widgetWithEditable' ).getHtml(), function() {
				var widget = widgetTestsTools.getWidgetById( this.editor, 'w1' );
				widget.focus();

				var contexts = this._createContexts( null, true );

				this._assertToolbarVisible( true, contexts.refresh, 'contexts.refresh visibility' );
				this._assertToolbarVisible( false, contexts.widgets, 'contexts.widgets visibility' );
				this._assertToolbarVisible( false, contexts.elements, 'contexts.elements visibility' );
			} );
		},

		// This case is yet to be decided.
		// 'test options.widgets has the priority over options.elements': function() {
		// 	this.editorBot.setData( CKEDITOR.document.getById( 'widgetWithEditable' ).getHtml(), function() {
		// 		var rng = this.editor.createRange();
		// 		rng.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
		// 		rng.collapse( true );

		// 		this.editor.getSelection().selectRanges( [ rng ] );

		// 		var contexts = this._createContexts( [ 'widgets', 'elements' ], true );

		// 		assert.isUndefined( contexts.refresh, 'context refresh is undefined' );
		// 		this._assertToolbarVisible( true, contexts.widgets, 'contexts.widgets visibility' );
		// 		this._assertToolbarVisible( false, contexts.elements, 'contexts.elements visibility' );
		// 	} );
		// },

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		},

		/*
		 * Creates three different context. Each with a different options selector.
		 *
		 * @param {String[]/null} [whitelist=null] Array of contexts to be returned, e.g. `[ 'refresh', 'elements' ]`.
		 * If `null` white listing is ignored and all contexts are returned.
		 * @param {Boolean} [autoRefresh=false] If `true` created contexts will be refreshed right after being created.
		 * @return {Object} A dictionary of created contexts.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.refresh A context with `options.refresh` that always returns `true`.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.widgets A context with `options.widgets` alone set.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.elements A context with `options.elements` alone set.
		 */
		_createContexts: function( whitelist, autoRefresh ) {
			var optionsMapping = {
					refresh: {
						buttons: 'Bold,Italic',
						refresh: sinon.stub().returns( true )
					},
					widgets: {
						buttons: 'Bold,Italic',
						widgets: [ 'foo', 'bar' ]
					},
					elements: {
						buttons: 'Bold,Italic',
						elements: 'a,strong,u'
					}
				},
				ret = {},
				i;

			whitelist = CKEDITOR.tools.isArray( whitelist ) ? whitelist : CKEDITOR.tools.objectKeys( optionsMapping );

			for ( i in optionsMapping ) {
				if ( CKEDITOR.tools.array.indexOf( whitelist, i ) !== -1 ) {
					ret[ i ] = this.editor.plugins.inlinetoolbar.create( optionsMapping[ i ] );
					this.contexts.push( ret[ i ] );

					if ( autoRefresh ) {
						ret[ i ].refresh();
					}
				}
			}

			return ret;
		}
	} );
} )();
