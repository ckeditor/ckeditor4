/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

( function() {
	var isBrowserSupported = !CKEDITOR.env.ie || CKEDITOR.env.version > 8;

	CKEDITOR.plugins.add( 'codesnippet', {
		requires: 'widget,dialog',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'codesnippet', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		beforeInit: function( editor ) {
			editor._.codesnippet = {};

			/**
			 * Sets custom syntax highlighter. See {@link CKEDITOR.plugins.codesnippet.highlighter}
			 * to know how to register a custom highlighter.
			 *
			 * @since 4.4
			 * @member CKEDITOR.plugins.codesnippet
			 * @param {CKEDITOR.plugins.codesnippet.highlighter} highlighter
			 */
			this.setHighlighter = function( highlighter ) {
				editor._.codesnippet.highlighter = highlighter;

				var langs = editor._.codesnippet.langs =
					editor.config.codeSnippet_languages || highlighter.languages;

				// We might escape special regex chars below, but we expect that there
				// should be no crazy values used as lang keys.
				editor._.codesnippet.langsRegex = new RegExp( '(?:^|\\s)language-(' +
					CKEDITOR.tools.objectKeys( langs ).join( '|' ) + ')(?:\\s|$)' );
			};
		},

		onLoad: function( editor ) {
			CKEDITOR.dialog.add( 'codeSnippet', this.path + 'dialogs/codesnippet.js' );
		},

		init: function( editor ) {
			editor.ui.addButton && editor.ui.addButton( 'CodeSnippet', {
				label: editor.lang.codesnippet.button,
				command: 'codeSnippet',
				toolbar: 'insert,10'
			} );
		},

		afterInit: function( editor ) {
			var path = this.path;

			registerWidget( editor );

			// At the very end, if no custom highlighter was set so far (by plugin#setHighlighter)
			// we will set default one.
			if ( !editor._.codesnippet.highlighter ) {
				var hljsHighlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
					languages: {
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
					},

					init: function( callback ) {
						var that = this;

						if ( isBrowserSupported ) {
							CKEDITOR.scriptLoader.load( path + 'lib/highlight/highlight.pack.js', function() {
								that.hljs = window.hljs;
								callback();
							} );
						}

						// Note: This will work for framed editor only.
						editor.addContentsCss( path + 'lib/highlight/styles/' + editor.config.codeSnippet_theme + '.css' );
					},

					highlighter: function( code, language, callback ) {
						var highlighted = this.hljs.highlightAuto( code,
								this.hljs.getLanguage( language ) ? [ language ] : undefined );

						if ( highlighted )
							callback( highlighted.value );
					}
				} );

				this.setHighlighter( hljsHighlighter );
			}
		}
	} );

	/**
	 * Global helpers and classes of Code Snippet plugin.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.codesnippet = {
		highlighter: Highlighter
	};

	/**
	 * A Code Snippet highlighter. It can be set as a default highlighter
	 * using {@link CKEDITOR.plugins.codesnippet#setHighlighter}, i.e.:
	 *
	 *		// Create a new plugin, which registers custom code highlighter
	 *		// based on customEngine in order to replace the one that comes
	 *		// with Code Snippet plugin.
	 *		CKEDITOR.plugins.add( 'myCustomHighlighter', {
	 *			afterInit: function( editor ) {
	 *				// Create a new instance of highlighter.
	 *				var myHighlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
	 *					init: function( ready ) {
	 *						// Asynchronous code to load resources and libraries for customEngine.
	 *						customEngine.loadResources( function() {
	 *							// Let the editor know that everything is ready.
	 *							ready();
	 *						} );
	 *					},
	 *					highlighter: function( code, language, callback ) {
	 *						// Let the customEngine highlight the code.
	 *						customEngine.highlight( code, language, function() {
	 *							callback( highlightedCode );
	 *						} );
	 *					}
	 *				} );
	 *
	 *				// Check how does it perform.
	 *				myHighlighter.highlight( 'foo()', 'javascript', function( highlightedCode ) {
	 *					console.log( highlightedCode ); // -> <span class="pretty">foo()</span>
	 *				} );
	 *
	 *				// From now on, myHighlighter will be used as a Code Snippet
	 *				// highlighter, overwriting the default engine.
	 *				editor.plugins.codesnippet.setHighlighter( myHighlighter );
	 *			}
	 *		} );
	 *
	 * @since 4.4
	 * @class CKEDITOR.plugins.codesnippet.highlighter
	 * @extends CKEDITOR.plugins.codesnippet
	 * @param {Object} def Highlighter definition. See {@link #highlighter}, {@link #init} and {@link #languages}.
	 */
	function Highlighter( def ) {
		CKEDITOR.tools.extend( this, def );

		/**
		 * A queue of {@link #highlight}
		 * jobs to be done once highlighter is {@link #ready}.
		 *
		 * @readonly
		 * @property {Array} [=[]]
		 */
		this.queue = [];

		// Async init – execute jobs when ready.
		if ( this.init ) {
			this.init( CKEDITOR.tools.bind( function() {
				// Execute pending jobs.
				var job;

				while ( ( job = this.queue.pop() ) )
					job.call( this );

				this.ready = true;
			}, this ) );
		} else
			this.ready = true;

		/**
		 * If specified, this function should asynchronously load highlighter-specific
		 * resources and execute `ready` once highlighter is ready.
		 *
		 * @property {Function} [init]
		 * @param {Function} ready Function to be called once
		 * highlighter is @{link #ready}.
		 */

		/**
		 * A function which highlights given plain-text `code` of given `language` and, once done,
		 * calls the `callback` function with highlighted markup as an argument.
		 *
		 * @property {Function} [highlighter]
		 * @param {String} code Code to be formatted.
		 * @param {String} lang Language to be used ({@link CKEDITOR.config#codeSnippet_languages}).
		 * @param {Function} callback Function which accepts highlighted String as an argument.
		 */

		/**
		 * Defines languages supported by the highlighter.
		 * They can be restricted with {@link CKEDITOR.config#codeSnippet_languages}.
		 *
		 * **Note**: If {@link CKEDITOR.config#codeSnippet_languages} is set, **it will
		 * overwrite** languages given in `languages`.
		 *
		 *		languages: {
		 *			coffeescript: 'CoffeeScript',
		 *			cpp: 'C++',
		 *			cs: 'C#',
		 *			css: 'CSS'
		 *		}
		 *
		 * @property {Object} languages
		 */

		/**
		 * A flag which indicates whether the highlighter is ready to do jobs
		 * in the {@link #queue}.
		 *
		 * @readonly
		 * @property {Boolean} ready
		 */
	}

	/**
	 * Executes {@link #highlighter}. If highlighter is not ready, defers the job ({@link #queue})
	 * and executes is once highlighter is {@link #ready}.
	 *
	 * @param {String} code Code to be formatted.
	 * @param {String} lang Language to be used ({@link CKEDITOR.config#codeSnippet_languages}).
	 * @param {Function} callback Function which accepts highlighted String as an argument.
	 */
	Highlighter.prototype.highlight = function() {
		var arg = arguments;

		// Highlighter is ready – do it now.
		if ( this.ready )
			this.highlighter.apply( this, arg );
		// Queue the job. It will be done once ready.
		else {
			this.queue.push( function() {
				this.highlighter.apply( this, arg );
			} );
		}
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
					callback = function( formatted ) {
						// IE8 (not supported browser) have issue with new line chars, when using innerHTML.
						// It will simply strip it.
						that.parts.code.setHtml( isBrowserSupported ?
							formatted : formatted.replace( newLineRegex, '<br>' ) );
					};

				// Set plain code first, so even if custom handler will not call it the code will be there.
				callback( CKEDITOR.tools.htmlEncode( widgetData.code ) );

				// Call higlighter to apply its custom highlighting.
				editor._.codesnippet.highlighter.highlight( widgetData.code, widgetData.lang, function( formatted ) {
					callback.apply( this, arguments );

					// Update snapshot – highlighted code should not
					// produce additional undoManager snapshot.
					editor.fire( 'updateSnapshot' );
				} );
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
 * **Note**: [themes](http://highlightjs.org/static/test.html)
 * must be loaded manually to be applied inside of [inline editor instance](#!/guide/dev_inline), e.g.
 * `codeSnippet_theme` will not work in such case. Include the stylesheet in `<head>`
 * section of the page instead, i.e.:
 *
 *		<head>
 *			...
 *			<link href="path/to/highlight.js/styles/theme_stylesheet.css" rel="stylesheet">
 *		</head>
 *
 * @since 4.4
 * @cfg {String} [codeSnippet_theme='default']
 * @member CKEDITOR.config
 */
CKEDITOR.config.codeSnippet_theme = 'default';