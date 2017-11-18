/* bender-tags: inlinetoolbar, context */
/* bender-ckeditor-plugins: inlinetoolbar, toolbar, basicstyles, sourcearea, widget */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong;u;em;cite'
		}
	};

	bender.test( {
		tearDown: function() {
			this.editor.plugins.inlinetoolbar._manager._clear();
		},

		setUp: function() {
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

		'test options.elements the top-most patch match wins': function() {
			// If we have path like: "foo > bar > baz" and there are contexts matching "bar" and "baz", only the context
			// that matches for "baz" should be shown.
			var additionalContextDefinitions = {
				emContext: {
					buttons: 'Bold,Italic',
					elements: 'em'
				},
				citeContext: {
					buttons: 'Bold,Italic',
					elements: 'cite'
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'elements', 'emContext', 'citeContext' ], true, additionalContextDefinitions );

			this._assertToolbarVisible( true, contexts.citeContext, 'contexts.citeContext visibility' );

			this._assertToolbarVisible( false, contexts.elements, 'contexts.elements visibility' );
			this._assertToolbarVisible( false, contexts.emContext, 'contexts.emContext visibility' );
		},

		'test options.elements with a HGIH priority takes the precedence': function() {
			var additionalContextDefinitions = {
				elements: {
					buttons: 'Bold,Italic',
					elements: 'a;strong;u',
					priority: CKEDITOR.plugins.inlinetoolbar.PRIORITY.HIGH
				},
				citeContext: {
					buttons: 'Bold,Italic',
					elements: 'cite'
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'elements', 'citeContext', 'refresh' ], true, additionalContextDefinitions );

			this._assertToolbarVisible( false, contexts.citeContext, 'contexts.citeContext visibility' );
			this._assertToolbarVisible( true, contexts.elements, 'contexts.elements visibility' );
			this._assertToolbarVisible( false, contexts.refresh, 'contexts.refresh visibility' );
		},

		'test options.elements with a LOW priority are less favorable': function() {
			var additionalContextDefinitions = {
				refresh: {
					buttons: 'Bold,Italic',
					refresh: sinon.stub().returns( true ),
					priority: CKEDITOR.plugins.inlinetoolbar.PRIORITY.LOW
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'elements', 'refresh' ], true, additionalContextDefinitions );

			this._assertToolbarVisible( false, contexts.refresh, 'contexts.refresh visibility' );
			this._assertToolbarVisible( true, contexts.elements, 'contexts.elements visibility' );
		},

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
		 * @param {Object} [additionalMappings] Additional context mappings, see the code for more details.
		 * @return {Object} A dictionary of created contexts.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.refresh A context with `options.refresh` that always returns `true`.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.widgets A context with `options.widgets` alone set.
		 * @return {CKEDITOR.plugins.inlinetoolbar.context} return.elements A context with `options.elements` alone set.
		 */
		_createContexts: function( whitelist, autoRefresh, additionalMappings ) {
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
						elements: 'a;strong;u'
					}
				},
				ret = {},
				i;

			whitelist = CKEDITOR.tools.isArray( whitelist ) ? whitelist : CKEDITOR.tools.objectKeys( optionsMapping );

			// Eventually one might provide even more mappings.
			if ( additionalMappings ) {
				optionsMapping = CKEDITOR.tools.extend( optionsMapping, additionalMappings, true );
			}

			for ( i in optionsMapping ) {
				if ( CKEDITOR.tools.array.indexOf( whitelist, i ) !== -1 ) {
					ret[ i ] = this.editor.plugins.inlinetoolbar.create( optionsMapping[ i ] );
				}
			}

			if ( autoRefresh ) {
				this.editor.plugins.inlinetoolbar._manager.check();
			}

			return ret;
		}
	} );
} )();
