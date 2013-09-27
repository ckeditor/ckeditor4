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
		requires: 'widget,ajax',

		onLoad: function( editor ) {
			CKEDITOR.addCss( '.cke_snippet_bar {' +
				'background: #eee;' +
				'line-height: 45px;' +
				'padding: 0 20px;' +
				'text-align: right;' +
				'height: 45px;' +
			'}' +
			'.cke_snippet_wrapper {' +
			'}' +
			'.cke_snippet_wrapper > pre {' +
				'background: #fafafa;' +
				'border-top: 1px solid #ccc;' +
				'border-bottom: 1px solid #ccc;' +
				'margin: 0;' +
				'padding: 10px;' +
			'}'	);
		},

		init: function( editor ) {
			var langs = editor.config.snippet_langs || defaults,
				path = CKEDITOR.getUrl( this.path );

			editor.widgets.add( 'snippet', {
				allowedContent: 'pre; code(*)',

				editables: {
					pre: {
						selector: 'pre',
						allowedContent: {}
					}
				},

				defaults: {
					lang: ''
				},

				parts: {
					pre: 'pre'
				},

				template: '<div class="cke_snippet_wrapper">' +
						'<pre><code></code></pre>' +
					'</div>',

				init: function() {
					appendSettingsBar( this );
					appendLanguagesSel( this, langs );
					appendSaveBtn( this, path );
					appendFancyView( this );
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
			doc = editor.document;

		widget.bar = doc.createElement( 'div', {
			attributes: {
				'class': 'cke_snippet_bar'
			}
		} );

		function showBar() {
			widget.bar.show();
		}

		function hideBar() {
			widget.bar.hide();
		}

		// widget.on( 'focus', showBar );
		// widget.editables.pre.on( 'focus', showBar );
		// widget.on( 'blur', hideBar );
		// widget.editables.pre.on( 'blur', hideBar );

		// widget.bar.hide();
		widget.bar.appendTo( widget.element );
	}

	function appendLanguagesSel( widget, langs ) {
		var editor = widget.editor,
			doc = editor.document,
			option;

		function appendLangSelOption( value, text ) {
			var option = doc.createElement( 'option', {
				attributes: { value: value }
			} );

			option.setText( text );
			option.appendTo( widget.langSel );
		}

		widget.langSel = doc.createElement( 'select' );

		appendLangSelOption( '', 'Plain text' );

		for ( var l in langs )
			appendLangSelOption( l, langs[ l ] );

		widget.langSel.on( 'change', function( evt ) {
			widget.setData( 'lang', widget.langSel.getValue() );
		} );

		widget.langSel.appendTo( widget.bar );
	}

	function appendSaveBtn( widget, path ) {
		var editor = widget.editor,
			doc = editor.document;

		widget.saveBtn = doc.createElement( 'button', {
			attributes: {
				type: 'button'
			}
		} );

		widget.saveBtn.setHtml( '<strong>Unicorns!</strong>' );
		widget.saveBtn.appendTo( widget.bar, true );
		widget.saveBtn.on( 'click', function() {
			CKEDITOR.ajax.post( path + 'lib/geshi/colorize.php', {
				lang: widget.data.lang,
				html: widget.editables.pre.getData()
			}, function( data ) {
				widget.fancyView.setHtml( data );
			} );
		} );
	}

	function appendFancyView( widget ) {
		var editor = widget.editor,
			doc = editor.document;

		widget.fancyView = doc.createElement( 'div', {
			attributes: {
				class: 'cke_snippet_fancyview'
			}
		} );

		widget.fancyView.appendTo( widget.element, true );
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