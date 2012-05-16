/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "sourcearea" plugin. It registers the "source" editing
 *		mode, which displays the raw data being edited in the editor.
 */

(function() {
	CKEDITOR.plugins.add( 'sourcearea', {
		init: function( editor ) {
			var sourcearea = CKEDITOR.plugins.sourcearea;

			editor.addMode( 'source', function( callback ) {
				var contentsSpace = editor.ui.space( 'contents' ),
					textarea = contentsSpace.getDocument().createElement( 'textarea' );

				textarea.setStyles({
					// IE7 has overflow the <textarea> from wrapping table cell.
					width: CKEDITOR.env.ie7Compat ? '99%' : '100%',
					height: '100%',
					resize: 'none',
					outline: 'none',
					'text-align': 'left'
				});

				textarea.setAttributes({
					dir: 'ltr',
					tabIndex: CKEDITOR.env.webkit ? -1 : editor.tabIndex,
					'role': 'textbox',
					'aria-label': editor.lang.editorTitle.replace( '%1', editor.name )
				});

				textarea.addClass( 'cke_source' );
				textarea.addClass( 'cke_enable_context_menu' );

				editor.ui.space( 'contents' ).append( textarea );

				var editable = editor.editable( new sourceEditable( editor, textarea ) );

				// Fill the textarea with the current editor data.
				editable.setData( editor.getData( 1 ) );

				// Having to make <textarea> fixed sized to conquer the following bugs:
				// 1. The textarea height/width='100%' doesn't constraint to the 'td' in IE6/7.
				// 2. Unexpected vertical-scrolling behavior happens whenever focus is moving out of editor
				// if text content within it has overflowed. (#4762)
				if ( CKEDITOR.env.ie ) {
					editable.attachListener( editor, 'resize', onResize, editable );
					editable.attachListener( CKEDITOR.document.getWindow(), 'resize', onResize, editable );
					CKEDITOR.tools.setTimeout( onResize, 0, editable );
				}

				editor.fire( 'ariaWidget', this );

				callback();
			});

			editor.addCommand( 'source', sourcearea.commands.source );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'Source', {
					label: editor.lang.source,
					command: 'source'
				});
			}

			editor.on( 'mode', function() {
				editor.getCommand( 'source' ).setState( editor.mode == 'source' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
			});
		}
	});

	var sourceEditable = CKEDITOR.tools.createClass({
		base: CKEDITOR.editable,
		proto: {
			setData: function( data ) {
				this.setValue( data );
				this.editor.fire( 'dataReady' );
			},

			getData: function() {
				return this.getValue();
			},

			// Insertions are not supported in source editable.
			insertHtml: function() {},
			insertElement: function() {},
			insertText: function() {},

			// Read-only support for textarea.
			setReadOnly: function( isReadOnly ) {
				this[ ( isReadOnly ? 'set' : 'remove' ) + 'Attribute' ]( 'readOnly', 'readonly' )
			},

			detach: function() {
				sourceEditable.baseProto.detach.call( this );
				this.clearCustomData();
				this.remove();
			}
		}
	});

	function onResize() {
		// Holder rectange size is stretched by textarea,
		// so hide it just for a moment.
		this.hide();
		this.setStyle( 'height', this.getParent().$.clientHeight + 'px' );
		this.setStyle( 'width', this.getParent().$.clientWidth + 'px' );
		// When we have proper holder size, show textarea again.
		this.show();
	}
})();

/**
 * Holds the definition of commands an UI elements included with the sourcearea
 * plugin.
 * @example
 */
CKEDITOR.plugins.sourcearea = {
	commands: {
		source: { modes:{wysiwyg:1,source:1 },
			editorFocus: false,
			readOnly: 1,
			exec: function( editor ) {
				if ( editor.mode == 'wysiwyg' )
					editor.fire( 'saveSnapshot' );
				editor.getCommand( 'source' ).setState( CKEDITOR.TRISTATE_DISABLED );
				editor.setMode( editor.mode == 'source' ? 'wysiwyg' : 'source' );
			},

			canUndo: false
		}
	}
};
