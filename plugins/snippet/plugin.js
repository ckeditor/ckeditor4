/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

(function() {

	var defaults = {
		js: 'JavaScript',
		php: 'PHP',
		html: 'HTML',
		css: 'CSS'
	};

	CKEDITOR.plugins.add( 'snippet', {
		requires: 'widget',

		onLoad: function( editor ) {
			CKEDITOR.addCss( '.cke_snippet_bar {' +
				'background: #eee;' +
				'border-top: 1px solid #ccc;' +
				'line-height: 45px;' +
				'padding: 0 20px;' +
				'text-align: right;' +
				'height: 45px;' +
			'}' +
			'.cke_snippet_wrapper > pre {' +
				'background: #fafafa;' +
				'border-top: 1px solid #ddd;' +
				'margin: 0;' +
				'padding: 10px;' +
			'}'	);
		},

		init: function( editor ) {
			var langs = editor.config.snippet_langs || defaults;

			editor.widgets.add( 'snippet', {
				allowedContent: 'pre; code(*)',

				editables: {
					pre: {
						selector: 'pre',
						allowedContent: 'strong em'
					}
				},

				defaults: {
					lang: ''
				},

				parts: {
					pre: 'pre'
				},

				init: function() {
					appendSettingsBar( this, langs );
				},

				data: function() {
					this.langSel.setValue( this.data.lang );
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

					// Remove <code>. The internal form is <pre>.
					code.replaceWithChildren();

					// Wrap <pre> with wrapper. It is to hold bar, etc.
					return el.wrapWith( new CKEDITOR.htmlParser.element( 'div', {
						'class': 'cke_snippet_wrapper'
					} ) );
				},

				// Downcasts to <pre><code [class="language-*"]>...</code></pre>
				downcast: function( el ) {
					var pre = el.getFirst( 'pre' ),
						code = new CKEDITOR.htmlParser.element( 'code' );


					var pre = CKEDITOR.htmlParser.fragment.fromHtml( this.editables.pre.getData(), 'pre' ),
						code = new CKEDITOR.htmlParser.element( 'code' );

					code.children = pre.children;
					for ( var i = 0; i < code.children.length; ++i )
						code.children[ i ].parent = code;

					pre.children = [ code ];
					code.parent = pre;

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

	function appendSettingsBar( widget, langs ) {
		var editor = widget.editor,
			doc = editor.document,
			bar = doc.createElement( 'div', {
				attributes: {
					'class': 'cke_snippet_bar'
				}
			} ),
			langSel = doc.createElement( 'select' ),
			option;

		appendLangSelOption( doc, langSel, '', 'Plain text' );

		for ( var l in langs )
			appendLangSelOption( doc, langSel, l, langs[ l ] );

		langSel.on( 'change', function( evt ) {
			widget.setData( 'lang', langSel.getValue() );
		} );

		widget.langSel = langSel;

		langSel.appendTo( bar );
		bar.appendTo( widget.element );
	}

	function appendLangSelOption( doc, langSel, value, text ) {
		var option = doc.createElement( 'option', {
			attributes: { value: value }
		} );

		option.setText( text );
		option.appendTo( langSel );
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