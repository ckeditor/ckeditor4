/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

( function() {
	var isBrowserSupported = !CKEDITOR.env.ie || CKEDITOR.env.version > 8,
		defaultLanguages = {
			apache: 'Apache',
			bash: 'Bash',
			coffeescript: 'CoffeeScript',
			cpp: 'C++',
			cs: 'C#',
			css: 'CSS',
			diff: 'Diff',
			http: 'HTTP',
			ini: 'INI',
			java: 'Java',
			javascript: 'JavaScript',
			json: 'JSON',
			makefile: 'Makefile',
			markdown: 'Markdown',
			nginx: 'Nginx',
			objectivec: 'Objective-C',
			perl: 'Perl',
			php: 'PHP',
			python: 'Python',
			ruby: 'Ruby',
			sql: 'SQL',
			xml: 'XML'
		};

	CKEDITOR.plugins.add( 'codesnippet', {
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'codesnippet', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		beforeInit: function( editor ) {
			editor._.codesnippet = {};

			/**
			 * Sets custom syntax highlighter function.
			 *
			 * **Note**: If {@link CKEDITOR.config#codeSnippet_languages} is set, **it will
			 * overwrite** languages given in `languages`.
			 *
			 * **Note**: Function `highlighterFn` accepts 3 arguments:
			 *
			 *	* `code` (_String_) - plain text code to be formatted
			 *	* `lang` (_String_) - language identifier taken from {@link CKEDITOR.config#codeSnippet_languages}
			 *	* `callback` (_Function_) - function which takes a string as an argument and writes it as output inside of a snippet widget
			 *
			 * @since 4.4
			 * @member CKEDITOR.plugins.codesnippet
			 * @param {Object} languages Languages supported by the highlighter. See {@link CKEDITOR.config#codeSnippet_languages}.
			 * @param {Function} highlighterFn
			 */
			this.setHighlighter = function( languages, highlighterFn ) {
				var scope = editor._.codesnippet;

				scope.highlighter = highlighterFn;
				scope.langs = editor.config.codeSnippet_languages || languages;

				// We might escape special regex chars below, but we expect that there
				// should be no crazy values used as lang keys.
				scope.langsRegex = new RegExp( '(?:^|\\s)language-(' +
					CKEDITOR.tools.objectKeys( scope.langs ).join( '|' ) + ')(?:\\s|$)' );
			};
		},

		onLoad: function( editor ) {
			CKEDITOR.dialog.add( 'codeSnippet', this.path + 'dialogs/codesnippet.js' );
		},

		afterInit: function( editor ) {
			registerWidget( editor );

			editor.ui.addButton && editor.ui.addButton( 'CodeSnippet', {
				label: editor.lang.codesnippet.button,
				command: 'codeSnippet',
				toolbar: 'insert,10'
			} );

			// At the very end, if no custom highlighter was set so far (by plugin#setHighlighter)
			// we will set default one.
			if ( !editor._.codesnippet.highlighter ) {
				this.setHighlighter( defaultLanguages, defaultHighlighter );

				var path = CKEDITOR.getUrl( this.path ),
					cssCode = path + 'lib/highlight/styles/' +
						editor.config.codeSnippet_theme + '.css';

				if ( editor._.codesnippet.highlighter == defaultHighlighter && !window.hljs && isBrowserSupported ) {
					// Inserting required styles/javascript.
					// Default highlighter was not changed, and hljs is not available, so
					// it wasn't inserted to the document.
					CKEDITOR.scriptLoader.load( path + 'lib/highlight/highlight.pack.js' );
				}

				editor.addContentsCss( cssCode );
			}
		}
	} );

	// A default highlighter of the plugin, which uses highlight.js library.
	//
	// @param {String} code Code to be formatted.
	// @param {String} lang Language to be used ({@link CKEDITOR.config#codeSnippet_languages}).
	// @param {Function} callback Function which accepts highlighted String as an argument.
	function defaultHighlighter( code, lang, callback ) {
		if ( !isBrowserSupported )
			return;

		var hljs = window.hljs,
			// Ensure that language is supported by hljs.
			snippetLang = hljs.getLanguage( lang ) ? [ lang ] : undefined,
			result = hljs.highlightAuto( code, snippetLang );

		if ( result )
			callback( result.value );
	};

	// Encapsulates snippet widget registration code.
	// @param {CKEDITOR.editor} editor
	function registerWidget( editor ) {
		var codeClass = editor.config.codeSnippet_class,
			newLineRegex = /\r?\n/g;

		editor.widgets.add( 'codeSnippet', {
			allowedContent: 'pre; code(language-*)',
			template: '<pre><code class="' + codeClass + '"></code></pre>',
			dialog: 'codeSnippet',
			mask: true,

			parts: {
				pre: 'pre',
				code: 'code'
			},

			highlight: function() {
				var that = this,
					widgetData = this.data,
					callback = function( formattedCode ) {
						// IE8 (not supported browser) have issue with new line chars, when using innerHTML.
						// It will simply strip it.
						that.parts.code.setHtml( isBrowserSupported ?
							formattedCode : formattedCode.replace( newLineRegex, '<br>' ) );
					};

				// Set plain code first, so even if custom handler will not call it the code will be there.
				callback( CKEDITOR.tools.htmlEncode( widgetData.code ) );

				// Call higlighter to apply its custom highlighting.
				editor._.codesnippet.highlighter( widgetData.code, widgetData.lang, callback );
			},

			data: function() {
				var newData = this.data,
					oldData = this.oldData;

				if ( newData.code )
					this.parts.code.setHtml( CKEDITOR.tools.htmlEncode( newData.code ) );

				// Lang needs to be specified in order to apply formatting.
				if ( newData.lang ) {
					// Apply new .language-* class.
					this.parts.code.addClass( 'language-' + newData.lang );

					// Remove old .language-* class.
					if ( oldData && newData.lang != oldData.lang )
						this.parts.code.removeClass( 'language-' + oldData.lang );

					this.highlight();
				}

				// Save oldData.
				this.oldData = CKEDITOR.tools.extend( {}, newData );
			},

			// Upcasts <pre><code [class="language-*"]>...</code></pre>
			upcast: function( el, data ) {
				if ( el.name != 'pre' )
					return;

				var childrenArray = getNonEmptyChildren( el ),
					code;

				if ( childrenArray.length !== 1 || ( code = childrenArray[ 0 ] ).name != 'code' )
					return;

				// Read language-* from <code> class attribute.
				var matchResult = editor._.codesnippet.langsRegex.exec( code.attributes[ 'class' ] );

				if ( matchResult )
					data.lang = matchResult[ 1 ];

				data.code = code.getHtml();

				code.addClass( codeClass );

				return el;
			},

			// Downcasts to <pre><code [class="language-*"]>...</code></pre>
			downcast: function( el ) {
				var code = el.getFirst( 'code' );

				// Remove pretty formatting from <code>...</code>.
				code.children.length = 0;

				// Remove config#codeSnippet_class.
				code.removeClass( codeClass );

				// Set raw text inside <code>...</code>.
				code.add( new CKEDITOR.htmlParser.text( CKEDITOR.tools.htmlEncode( this.data.code ) ) );

				return el;
			}
		} );

		// Returns **array** of children elements, with whitespace-only text nodes
		// filtered out.
		// @param {CKEDITOR.htmlParser.element} parentElement
		// @return Array - array of CKEDITOR.htmlParser.node
		var whitespaceOnlyRegex = /^[\s\n\r]*$/;

		function getNonEmptyChildren( parentElement ) {
			var ret = [],
				preChildrenList = parentElement.children,
				curNode;

			// Filter out empty text nodes.
			for ( var i = preChildrenList.length-1; i >= 0; i-- ) {
				curNode = preChildrenList[ i ];

				if ( curNode.type  == CKEDITOR.NODE_TEXT && curNode.value.match( whitespaceOnlyRegex ) )
					continue;

				ret.push( curNode );
			}

			return ret;
		}
	}
} )();

/**
 * A CSS class for `code` element inside of the snippet.
 *
 *		// Changes the class to "myCustomClass".
 *		config.codeSnippet_class = 'myCustomClass';
 *
 * **Note**: This might need to be changed if using custom highlighter
 * (default is [highlight.js](http://highlightjs.org)).
 *
 * @since 4.4
 * @cfg {String} [codeSnippet_class='hljs']
 * @member CKEDITOR.config
 */
CKEDITOR.config.codeSnippet_class = 'hljs';

/**
 * Restricts languages available in the "Code snippet" dialog.
 *
 * **Note**: If using custom highlighter library (default is [highlight.js](http://highlightjs.org)),
 * you may need to refer to external docs to set `config.codeSnippet_languages` properly.
 *
 *		// Restricts languages to JavaScript and PHP.
 *		config.codeSnippet_languages = {
 *			javascript: 'JavaScript',
 *			php: 'PHP'
 *		};
 *
 * @since 4.4
 * @cfg {Object} [codeSnippet_languages=null]
 * @member CKEDITOR.config
 */

/**
 * A theme used to render snippets ([available themes](http://highlightjs.org/static/test.html)).
 *
 * **Note**: This will work only with default highlighter
 * ([highlight.js](http://highlightjs.org/static/test.html)).
 *
 *		// Changes theme "pojoaque".
 *		config.codeSnippet_theme = 'pojoaque';
 *
 * @since 4.4
 * @cfg {String} [codeSnippet_theme='default']
 * @member CKEDITOR.config
 */
CKEDITOR.config.codeSnippet_theme = 'default';