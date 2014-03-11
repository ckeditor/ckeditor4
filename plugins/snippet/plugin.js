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
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%

		onLoad: function( editor ) {
			CKEDITOR.addCss( '.cke_snippet_wrapper{' +
				'font-family:monospace;' +
				'background:#fafafa;' +
				'border-top:1px solid #ccc;' +
				'border-bottom:1px solid #ccc;' +
			'}' +
			'.cke_snippet_wrapper > pre{' +
				'margin:0px auto;' +
				'padding:10px' +
			'}' );
			CKEDITOR.dialog.add( 'snippet', this.path + 'dialogs/snippet.js' );
		},

		afterInit: function( editor ) {
			ensurePluginNamespaceExists( editor );
			registerWidget( editor );

			editor.ui.addButton && editor.ui.addButton( 'snippet', {
				label: editor.lang.snippet.button,
				command: 'snippet',
				toolbar: 'insert,10'
			} );

			// At the very end, if no custom highlighter was set so far (by plugin#setHighlighter)
			// we will set default one.
			if ( !editor._.snippet.highlighter ) {
				CKEDITOR.plugins.snippet.setDefaultHighlighter( editor );

				var path = CKEDITOR.getUrl( this.path ),
					cssCode = path + 'lib/highlight/styles/' + ( editor.config.snippet_template || 'default' ) + '.css';

				if ( editor._.snippet.highlighter == defaultHighlighter && !window.hljs ) {
					// Inserting required styles/javascript.
					// Default highlighter was not changed, and hljs is not available, so
					// it wasn't inserted to the document.
					CKEDITOR.scriptLoader.load( path + 'lib/highlight/highlight.pack.js' );
				}

				// Adding css file to config.contentsCss, such logic will most likely
				// go to editor soon with issue #11532.
				if ( editor.config.contentsCss ) {
					if ( CKEDITOR.tools.isArray( editor.config.contentsCss ) )
						editor.config.contentsCss.push( cssCode );
					else
						editor.config.contentsCss = [ cssCode, editor.config.contentsCss ];
				} else
					editor.config.contentsCss = [ cssCode ];
			}
		}
	} );

	// Public interface.
	CKEDITOR.plugins.snippet = {
		/**
		 * Sets custom syntax highlighter function.
		 * @member CKEDITOR.plugins.snippet
		 * @param {CKEDITOR.editor} editor
		 * @param {Object} defaultLanguages Default languages for given highlighter. **Note:** if {@link CKEDITOR.config.snippet_langs} is set, **it will overwrite** languages given with `defaultLanguages`.
		 * @param {Function} highlightHandlerFn
		 *
		 *	Function `highlightHandlerFn` takes 3 parameters:
		 *
		 *	* code - string - plain text code to be formatted
		 *	* lang - string - language identifier taken from {@link CKEDITOR.config.snippet_langs}
		 *	* callback - function - function which takes a string as an argument and writes it as output inside of a snippet widget
		 */
		setHighlighter: function( editor, languages, highlightHandlerFn ) {
			ensurePluginNamespaceExists( editor );

			editor._.snippet.highlighter = highlightHandlerFn;
			editor._.snippet.langs = editor.config.snippet_langs ? editor.config.snippet_langs : languages;
		},

		/**
		 * Restores default syntax highlighter for the plugin, which by default
		 * is highlight.js library.
		 *
		 * @member CKEDITOR.plugins.snippet
		 * @param {CKEDITOR.editor} editor
		 */
		setDefaultHighlighter: function( editor ) {
			this.setHighlighter( editor, defaults, defaultHighlighter );
		}
	};

	// Default languages object.
	var defaultHighlighter = function( code, lang, callback ) {
			var hljs = window.hljs,
				// Ensure that language is supported by hljs.
				snippetLang = hljs.getLanguage( lang ) ? [ lang ] : undefined,
				result = hljs.highlightAuto( code, snippetLang );

			if ( result )
				callback( result.value );
		}, defaults = {
			bash: 'Bash',
			cs: 'C#',
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

	// Encapsulates snippet widget registration code.
	// @param {CKEDITOR.editor} editor
	function registerWidget( editor ) {

		var preClass = editor.config.snippet_class || 'hljs';

		editor.widgets.add( 'snippet', {
			allowedContent: 'pre; code(*)',
			template: '<div class="cke_snippet_wrapper"><pre class="' + preClass + '"></pre></div>',
			dialog: 'snippet',
			mask: true,
			defaults: {
				lang: '',
				code: ''
			},

			parts: {
				pre: 'pre'
			},

			doReformat: function() {
				var that = this,
					widgetData = this.data,
					callback = function( formattedCode ) {
						that.parts.pre.setHtml( formattedCode );
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
					this.parts.pre.setHtml( CKEDITOR.tools.htmlEncode( curData.code ) );
			},

			// Upcasts <pre><code [class="language-*"]>...</code></pre>
			upcast: function( el, data ) {
				var	langs = editor._.snippet.langs,
					code,
					l;

				// Check el.parent to prevent upcasting loop of hell. If not checked,
				// widgets system will attempt to upcast nested editables.
				if ( el.name != 'pre' || !el.parent || !( code = el.getFirst( 'code' ) ) )
					return;

				// Read language-* from <code> class attribute.
				for ( l in langs ) {
					if ( code.hasClass( 'language-' + l ) ) {
						data.lang = l;
						break;
					}
				}

				data.code = code.getHtml();

				el.classes.push( preClass );
				el.attributes[ 'class' ] = el.classes.join( ' ' );

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
	}

	function ensurePluginNamespaceExists( editor ) {
		// Create a protected namespace if it's not already there.
		if ( !editor._.snippet )
			editor._.snippet = {};
	}
} )();

/**
 * Allows to setup custom class for pre element inside editor editable.
 *
 * @since 4.4
 * @cfg {String} [snippet_class='hljs']
 * @member CKEDITOR.config
 */

/**
 * Allows to set a template for highlihgt.js, you can browse templates at http://highlightjs.org/static/test.html
 *
 *		config.snippet_template = 'pojoaque';
 *
 * @since 4.4
 * @cfg {String} [snippet_template='default']
 * @member CKEDITOR.config
 */

/**
 * An object listing available languages.
 *
 *		config.snippet_langs = {
 *			javascript: 'JavaScript',
 *			php: 'PHP'
 *		};
 *
 * @since 4.4
 * @cfg {Object} [snippet_langs=null]
 * @member CKEDITOR.config
 */