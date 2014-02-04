/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

( function() {

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
				template: '<div class="cke_snippet_wrapper"><pre></pre></div>',
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
						this.element.setHtml( '<pre>' + CKEDITOR.tools.htmlEncode( curData.code ) + '</pre>' );
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
					var retPreElement = new CKEDITOR.htmlParser.element( 'pre' ),
						code = new CKEDITOR.htmlParser.element( 'code' ),
						encodedSnippetCode = CKEDITOR.tools.htmlEncode( this.data.code );

					code.parent = retPreElement;
					retPreElement.children = [ code ];

					code.children = [ new CKEDITOR.htmlParser.text( encodedSnippetCode ) ];

					if ( this.data.lang )
						code.attributes[ 'class' ] = 'language-' + this.data.lang;

					return retPreElement;
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
				}

				var cssCode = path + 'lib/highlight/styles/' + ( editor.config.snippet_template || 'default' ) + '.css';

				// Adding css file to config.contentsCss, such logic will most likely
				// go to editor soon with issue #11532.
				if ( editor.config.contentsCss ) {
					CKEDITOR.tools.isArray( editor.config.contentsCss ) ?
						editor.config.contentsCss.push( cssCode ) :
						editor.config.contentsCss = [ cssCode, editor.config.contentsCss ];
				} else
					editor.config.contentsCss = [ cssCode ];
			}
		}
	} );

	// Default languages object.
	var defaultHighlighter = function( code, lang, callback ) {
			var hljs = window.hljs,
				// Ensure that language is supported by hljs.
				snippetLang = window.hljs.getLanguage( lang ) ? [ lang ] : undefined,
				result = window.hljs.highlightAuto( code, snippetLang );

			if ( result )
				callback( result.value );
		}, defaults = {
			bash: 'Bash',
			cs: 'C#', // im not sure :D
			ruby: 'Ruby',
			diff: 'Diff',
			javascript: 'JavaScript',
			xml: 'XML',
			markdown: 'Markdown',
			css: 'CSS',
			http: 'HTTP',
			java: 'Java',
			php: 'PHP',
			python: 'Python',
			sql: 'SQL',
			ini: 'INI',
			perl: 'Perl',
			objectivec: 'Objective-C',
			coffeescript: 'CoffeeScript',
			nginx: 'Nginx',
			json: 'JSON',
			apache: 'Apache',
			cpp: 'C++',
			makefile: 'Makefile'
		};

	function decodeHtml( stringToDecode ) {
		return stringToDecode.replace( /&amp;/g, '&' ).replace( /&gt;/g, '>' ).replace( /&lt;/g, '<' );
	}

	function ensurePluginNamespaceExists( editor ) {
		// Create a protected namespace if it's not already there.
		if ( !editor._.snippet )
			editor._.snippet = {};
	}

} )();