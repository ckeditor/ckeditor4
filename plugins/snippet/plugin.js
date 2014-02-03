/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

(function() {

	// Default languages object.
	var defaults = {
		javascript: 'JavaScript',
		php: 'PHP',
		html4strict: 'HTML',
		html5: 'HTML5',
		css: 'CSS'
	};

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

		init: function( editor ) {

			var langs = editor.config.snippet_langs || defaults,
				path = CKEDITOR.getUrl( this.path );

			// Creates snippet plugin private area where languages list will be
			// stored (per editor instance).
			editor._.snippet = {
				langs: langs
			};

			editor.widgets.add( 'snippet', {
				allowedContent: 'pre; code(*)',

				dialog: 'snippet',

				defaults: {
					lang: '',
					code: ''
				},

				template: '<div class="cke_snippet_wrapper"></div>',

				doReformat: function() {
					var that = this;

					CKEDITOR.ajax.post( path + 'lib/geshi/colorize.php', {
							lang: this.data.lang,
							html: decodeHtml( this.data.code )
						}, function( data ) {
							that.element.setHtml( data );
						} );
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

			enableMouseInBar( editor );

			editor.ui.addButton && editor.ui.addButton( 'snippet', {
				label: 'Gimme snippet!',
				command: 'snippet',
				toolbar: 'insert,10'
			} );
		}
	} );

	function decodeHtml( stringToDecode ) {
		return stringToDecode.replace( /&amp;/g, '&' ).replace( /&gt;/g, '>' ).replace( /&lt;/g, '<' );
	}

	function enableMouseInBar( editor ) {
		// If evt target belongs to any widget's bar, allow clicking
		// there.
		function callback( evt ) {
			var target = evt.data.getTarget(),
				parents = target.getParents( true ),
				parent;

			while ( ( parent = parents.shift() ) && !parent.equals( this ) ) {
				if ( parent.hasClass( 'cke_snippet_bar' ) )
					evt.stop();
			}
		}

		editor.on( 'contentDom', function() {
			var editable = editor.editable(),
				evtRoot = editable.isInline() ? editable : editor.document;

			// This one overwrites editable's listener.
			editable.attachListener( editable, 'mousedown', callback, editable, null, 0 );

			// This one overwrites widget system's listener.
			if ( !editable.isInline() )
				editable.attachListener( editor.document, 'mousedown', callback, editable, null, 0 );
		} );
	}
})();