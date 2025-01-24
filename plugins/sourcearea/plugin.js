﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview The Source Editing Area plugin. It registers the "source" editing
 *		mode, which displays raw  HTML data being edited in the editor.
 */

( function() {
	CKEDITOR.plugins.add( 'sourcearea', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'source,source-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Source mode in inline editors is only available through the "sourcedialog" plugin.
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				return;

			var sourcearea = CKEDITOR.plugins.sourcearea;

			editor.addMode( 'source', function( callback ) {
				var contentsSpace = editor.ui.space( 'contents' ),
					textarea = contentsSpace.getDocument().createElement( 'textarea' );

				textarea.setStyles(
					CKEDITOR.tools.extend( {
						// IE7 has overflow the <textarea> from wrapping table cell.
						width: CKEDITOR.env.ie7Compat ? '99%' : '100%',
						height: '100%',
						resize: 'none',
						outline: 'none',
						'text-align': 'left'
					},
					CKEDITOR.tools.cssVendorPrefix( 'tab-size', editor.config.sourceAreaTabSize || 4 ) ) );

				// Make sure that source code is always displayed LTR,
				// regardless of editor language (https://dev.ckeditor.com/ticket/10105).
				textarea.setAttribute( 'dir', 'ltr' );

				textarea.addClass( 'cke_source' ).addClass( 'cke_reset' ).addClass( 'cke_enable_context_menu' );

				editor.ui.space( 'contents' ).append( textarea );

				var editable = editor.editable( new sourceEditable( editor, textarea ) );

				// Fill the textarea with the current editor data.
				editable.setData( editor.getData( 1 ) );

				// Having to make <textarea> fixed sized to conquer the following bugs:
				// 1. The textarea height/width='100%' doesn't constraint to the 'td' in IE6/7.
				// 2. Unexpected vertical-scrolling behavior happens whenever focus is moving out of editor
				// if text content within it has overflowed. (https://dev.ckeditor.com/ticket/4762)
				if ( CKEDITOR.env.ie ) {
					editable.attachListener( editor, 'resize', onResize, editable );
					editable.attachListener( CKEDITOR.document.getWindow(), 'resize', onResize, editable );
					CKEDITOR.tools.setTimeout( onResize, 0, editable );
				}

				editor.fire( 'ariaWidget', this );

				callback();
			} );

			editor.addCommand( 'source', sourcearea.commands.source );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'Source', {
					isToggle: true,
					label: editor.lang.sourcearea.toolbar,
					command: 'source',
					toolbar: 'mode,10'
				} );
			}

			editor.on( 'mode', function() {
				editor.getCommand( 'source' ).setState( editor.mode == 'source' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
			} );

			var needsFocusHack = CKEDITOR.env.ie && CKEDITOR.env.version == 9;

			function onResize() {
				// We have to do something with focus on IE9, because if sourcearea had focus
				// before being resized, the caret ends somewhere in the editor UI (https://dev.ckeditor.com/ticket/11839).
				var wasActive = needsFocusHack && this.equals( CKEDITOR.document.getActive() );

				// Holder rectange size is stretched by textarea,
				// so hide it just for a moment.
				this.hide();
				this.setStyle( 'height', this.getParent().$.clientHeight + 'px' );
				this.setStyle( 'width', this.getParent().$.clientWidth + 'px' );
				// When we have proper holder size, show textarea again.
				this.show();

				if ( wasActive )
					this.focus();
			}
		}
	} );

	var sourceEditable = CKEDITOR.tools.createClass( {
		base: CKEDITOR.editable,
		proto: {
			setData: function( data ) {
				this.setValue( data );
				this.status = 'ready';
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
				this[ ( isReadOnly ? 'set' : 'remove' ) + 'Attribute' ]( 'readOnly', 'readonly' );
			},

			detach: function() {
				sourceEditable.baseProto.detach.call( this );
				this.clearCustomData();
				this.remove();
			}
		}
	} );
} )();

CKEDITOR.plugins.sourcearea = {
	commands: {
		source: {
			modes: { wysiwyg: 1, source: 1 },
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

/**
 * Controls the `tab-size` CSS property of the source editing area. Use it to set the width
 * of the tab character in the source view. Enter an integer to denote the number of spaces
 * that the tab will contain.
 *
 * **Note:** Works only with {@link #dataIndentationChars}
 * set to `'\t'`. Please consider that not all browsers support the `tab-size` CSS
 * property yet.
 *
 *		// Set tab-size to 10 characters.
 *		config.sourceAreaTabSize = 10;
 *
 * @cfg {Number} [sourceAreaTabSize=4]
 * @member CKEDITOR.config
 * @see CKEDITOR.config#dataIndentationChars
 */
