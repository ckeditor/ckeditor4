/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

(function() {

	CKEDITOR.plugins.add( 'snippet', {
		requires: 'widget,ajax,dialog',

		onLoad: function( editor ) {
			CKEDITOR.addCss( '.cke_snippet_wrapper > pre {' +
				'font-family:monospace;' +
				'background: #fafafa;' +
				'border-top: 1px solid #ccc;' +
				'border-bottom: 1px solid #ccc;' +
				'margin: 0;' +
				'padding: 10px;' +
			'}'	);
			CKEDITOR.dialog.add( 'snippet', this.path + 'dialogs/snippet.js' );
		},

		/**
		 * Sets custom syntax highlighter function.
		 * @member CKEDITOR.editor.plugins.snippet
		 * @param {CKEDITOR.editor} editor
		 * @param {Function} highlightHandlerFn
		 *
		 * 	Function highlightHandlerFn takes 3 parameters:
		 *
		 *	* code - string - plain text code to be formatted
		 *	* lang - string - language identifier taken from {@link CKEDITOR.config.snippet_langs}
		 *	* callback - function - function which takes string as arguments and writes output inside of a widget
		 */
		setHighlighter: function( editor, languages, highlightHandlerFn ) {

			ensurePluginNamespaceExists( editor );

			editor._.snippet.highlighter = highlightHandlerFn;
			editor._.snippet.langs = languages;
		},

		/**
		 * Restores default syntax highlighter for the plugin, which by default
		 * uses highlight.js library.
		 */
		setDefaultHighlighter: function( editor, pluginInstance ) {
			this.setHighlighter( editor, defaults, defaultHighlighter );
		},

		afterInit: function( editor ) {

			ensurePluginNamespaceExists( editor );

			var langs = editor.config.snippet_langs || defaults,
				path = CKEDITOR.getUrl( this.path );

			editor.widgets.add( 'snippet', {
				allowedContent: 'pre; code(*)',
				template: '<div class="cke_snippet_wrapper"></div>',
				dialog: 'snippet',
				mask: true,
				defaults: {
					lang: '',
					code: ''
				},

				doReformat: function() {
					var widgetData = this.data,
						preTag = this.element.findOne( 'pre' ),
						callback = function( formattedCode ) {
							//that.element.setHtml( formattedCode );
							preTag.setHtml( formattedCode );
						};
					// Set plain code first, so even if custom handler will not call it the code will be there.
					callback( CKEDITOR.tools.htmlEncode( widgetData.code ) );
					// Call higlighter to apply its custom highlighting.
					editor._.snippet.highlighter( widgetData.code, widgetData.lang, callback );
				},

				data: function( evt ) {
					var curData = evt.data;
					// Lang needs to be specified in order to apply formatting.
					if ( curData.lang )
						this.doReformat();
					else if ( curData.code )
						this.element.setHtml( '<pre>' + curData.code + '</pre>' );
				},

				// Upcasts <pre><code [class="language-*"]>...</code></pre>
				upcast: function( el, data ) {
					var code;

					// Check el.parent to prevent upcasting loop of hell. If not checked,
					// widgets system will attempt to upcast nested editables. Bunnies cry.
					if ( el.name != 'pre' || !el.parent || !( code = el.getFirst( 'code' ) ) )
						return;

					// Read language-* from <code> class attribute.
					for ( var l in langs ) {
						if ( code.hasClass( 'language-' + l ) ) {
							data.lang = l;
							break;
						}
					}

					data.code = code.getHtml();

					// Remove <code>. The internal form is <pre>.
					code.replaceWithChildren();

					// Wrap <pre> with wrapper. It is to hold bar, etc.
					return el.wrapWith( new CKEDITOR.htmlParser.element( 'div', {
						'class': 'cke_snippet_wrapper'
					} ) );
				},

				// Downcasts to <pre><code [class="language-*"]>...</code></pre>
				downcast: function( el ) {
					var pre = CKEDITOR.htmlParser.fragment.fromHtml( this.data.code, 'pre' ),
						code = new CKEDITOR.htmlParser.element( 'code' ),
						encodedHtmlContent;

					code.children = pre.children;

					for ( var i = 0; i < code.children.length; ++i )
						code.children[ i ].parent = code;

					pre.children = [ code ];
					code.parent = pre;

					encodedHtmlContent = CKEDITOR.tools.htmlEncode( this.data.code );
					// CKEDITOR.htmlParser.fragment.prototype expects brs, and will transform them
					// to new lines.
					encodedHtmlContent = encodedHtmlContent.replace( /\n/g, '<br />' );
					code.setHtml( encodedHtmlContent );

					if ( this.data.lang )
						code.attributes.class = 'language-' + this.data.lang;

					return pre;
				}
			} );

			editor.ui.addButton && editor.ui.addButton( 'snippet', {
				label: 'Gimme snippet!',
				command: 'snippet',
				toolbar: 'insert,10'
			} );

			// At the very end, if no custom highlighter was set so far (by plugin#setHighlighter)
			// we will set default one.
			if ( !editor._.snippet.highlighter ) {
				this.setDefaultHighlighter( editor, this );

				if ( editor._.snippet.highlighter == defaultHighlighter && !window.hljs ) {
					// Inserting required styles/javascript.
					// Default highlighter was not changed, and hljs is not available, so
					// it wasn't inserted to the document.
					CKEDITOR.scriptLoader.load( path + 'lib/highlight/highlight.pack.js' );
					editor.on( 'instanceReady', function( evt ) {
						editor.document.appendStyleSheet( path + 'lib/highlight/styles/default.css' );
					} );
				}
			}
		}
	} );

	// Default languages object.
	var defaultHighlighter = function( code, lang, callback ) {
			var result = window.hljs.highlightAuto( code );
			if ( result )
				callback( result.value );

		}, defaults = {
			javascript: 'JavaScript',
			php: 'PHP',
			html4strict: 'HTML',
			html5: 'HTML5',
			css: 'CSS'
		};

	function decodeHtml( stringToDecode ) {
		return stringToDecode.replace( /&amp;/g, '&' ).replace( /&gt;/g, '>' ).replace( /&lt;/g, '<' );
	}

	function ensurePluginNamespaceExists( editor ) {
		// Create a protected namespace if it's not already there.
		if ( !editor._.snippet )
			editor._.snippet = {};
	}

})();