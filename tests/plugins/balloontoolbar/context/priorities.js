/* bender-tags: balloontoolbar, context */
/* bender-ckeditor-plugins: balloontoolbar, toolbar, basicstyles, sourcearea, widget */
/* bender-include: ../../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, contextTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong;u;em;cite'
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );

			this.editor.widgets.add( 'bar', {
				editables: {
					header: 'h1'
				}
			} );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
		},

		'test options.refresh has the highest priority': function() {
			this.editorBot.setData( CKEDITOR.document.getById( 'widgetWithEditable' ).getHtml(), function() {
				var rng = this.editor.createRange();
				rng.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
				rng.collapse( true );

				this.editor.getSelection().selectRanges( [ rng ] );

				var contexts = this._createContexts( null, true );

				contextTools._assertToolbarVisible( true, contexts.refresh, 'contexts.refresh visibility' );
				contextTools._assertToolbarVisible( false, contexts.widgets, 'contexts.widgets visibility' );
				contextTools._assertToolbarVisible( false, contexts.cssSelector, 'contexts.cssSelector visibility' );
			} );
		},

		'test options.refresh has the highest priority with widget selected': function() {
			this.editorBot.setData( CKEDITOR.document.getById( 'widgetWithEditable' ).getHtml(), function() {
				var widget = widgetTestsTools.getWidgetById( this.editor, 'w1' );
				widget.focus();

				var contexts = this._createContexts( null, true );

				contextTools._assertToolbarVisible( true, contexts.refresh, 'contexts.refresh visibility' );
				contextTools._assertToolbarVisible( false, contexts.widgets, 'contexts.widgets visibility' );
				contextTools._assertToolbarVisible( false, contexts.cssSelector, 'contexts.cssSelector visibility' );
			} );
		},

		'test options.cssSelector the top-most patch match wins': function() {
			// If we have path like: "foo > bar > baz" and there are contexts matching "bar" and "baz", only the context
			// that matches for "baz" should be shown.
			var additionalContextDefinitions = {
				emContext: {
					buttons: 'Bold,Italic',
					cssSelector: 'em'
				},
				citeContext: {
					buttons: 'Bold,Italic',
					cssSelector: 'cite'
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'cssSelector', 'emContext', 'citeContext' ], true, additionalContextDefinitions );

			contextTools._assertToolbarVisible( true, contexts.citeContext, 'contexts.citeContext visibility' );

			contextTools._assertToolbarVisible( false, contexts.cssSelector, 'contexts.cssSelector visibility' );
			contextTools._assertToolbarVisible( false, contexts.emContext, 'contexts.emContext visibility' );
		},

		'test options.cssSelector with a HGIH priority takes the precedence': function() {
			var additionalContextDefinitions = {
				cssSelector: {
					buttons: 'Bold,Italic',
					cssSelector: 'a, strong, u',
					priority: CKEDITOR.plugins.balloontoolbar.PRIORITY.HIGH
				},
				citeContext: {
					buttons: 'Bold,Italic',
					cssSelector: 'cite'
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'cssSelector', 'citeContext', 'refresh' ], true, additionalContextDefinitions );

			contextTools._assertToolbarVisible( false, contexts.citeContext, 'contexts.citeContext visibility' );
			contextTools._assertToolbarVisible( true, contexts.cssSelector, 'contexts.cssSelector visibility' );
			contextTools._assertToolbarVisible( false, contexts.refresh, 'contexts.refresh visibility' );
		},

		'test options.cssSelector with a LOW priority are less favorable': function() {
			var additionalContextDefinitions = {
				refresh: {
					buttons: 'Bold,Italic',
					refresh: sinon.stub().returns( true ),
					priority: CKEDITOR.plugins.balloontoolbar.PRIORITY.LOW
				}
			};

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'nestedElements' ).getHtml() );

			var contexts = this._createContexts( [ 'cssSelector', 'refresh' ], true, additionalContextDefinitions );

			contextTools._assertToolbarVisible( false, contexts.refresh, 'contexts.refresh visibility' );
			contextTools._assertToolbarVisible( true, contexts.cssSelector, 'contexts.cssSelector visibility' );
		},

		/*
		 * Creates three different context. Each with a different options selector.
		 *
		 * @param {String[]/null} [whitelist=null] Array of contexts to be returned, e.g. `[ 'refresh', 'cssSelector' ]`.
		 * If `null` white listing is ignored and all contexts are returned.
		 * @param {Boolean} [autoRefresh=false] If `true` created contexts will be refreshed right after being created.
		 * @param {Object} [additionalMappings] Additional context mappings, see the code for more details.
		 * @return {Object} A dictionary of created contexts.
		 * @return {CKEDITOR.plugins.balloontoolbar.context} return.refresh A context with `options.refresh` that always returns `true`.
		 * @return {CKEDITOR.plugins.balloontoolbar.context} return.widgets A context with `options.widgets` alone set.
		 * @return {CKEDITOR.plugins.balloontoolbar.context} return.cssSelector A context with `options.cssSelector` alone set.
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
					cssSelector: {
						buttons: 'Bold,Italic',
						cssSelector: 'a, strong, u'
					}
				},
				ret = {},
				i;

			whitelist = CKEDITOR.tools.isArray( whitelist ) ? whitelist : CKEDITOR.tools.object.keys( optionsMapping );

			// Eventually one might provide even more mappings.
			if ( additionalMappings ) {
				optionsMapping = CKEDITOR.tools.extend( optionsMapping, additionalMappings, true );
			}

			for ( i in optionsMapping ) {
				if ( CKEDITOR.tools.array.indexOf( whitelist, i ) !== -1 ) {
					ret[ i ] = this.editor.balloonToolbars.create( optionsMapping[ i ] );
				}
			}

			if ( autoRefresh ) {
				this.editor.balloonToolbars.check();
			}

			return ret;
		}
	} );
} )();
