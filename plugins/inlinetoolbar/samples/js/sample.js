/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported initSample */

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
	CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 150;
CKEDITOR.config.width = 'auto';
CKEDITOR.config.extraPlugins = 'inlinetoolbar';
CKEDITOR.on( 'instanceReady', function( e ) {
	var editor = e.editor;
	editor.addCommand( 'testInlineToolbar', {
		exec: function( editor ) {
			var img = editor.editable().findOne( 'img' );
			if ( img ) {
				var panel = new CKEDITOR.ui.inlineToolbarView( editor );
				panel.addMenuItems( {
					iamge: {
						label: editor.lang.common.image,
						command: 'image',
						toolbar: 'insert,10'
					},
					image2: {
						label: editor.lang.common.image,
						command: 'image',
						toolbar: 'insert,10'
					},
					imag3: {
						label: editor.lang.common.image,
						command: 'image',
						toolbar: 'insert,10'
					}
				} );
				panel.create( img );
			}
		}
	} );
	document.getElementById( 'test-inline-toolbar' ).addEventListener( 'click', function() {
		editor.execCommand( 'testInlineToolbar' );
	} );
} );

var initSample = ( function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable();

	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );

		// Depending on the wysiwygare plugin availability initialize classic or inline editor.
		if ( wysiwygareaAvailable ) {
			CKEDITOR.replace( 'editor' );
		} else {
			editorElement.setAttribute( 'contenteditable', 'true' );
			CKEDITOR.inline( 'editor' );

			// TODO we can consider displaying some info box that
			// without wysiwygarea the classic editor may not work.
		}
	};

	function isWysiwygareaAvailable() {
		// If in development mode, then the wysiwygarea must be available.
		// Split REV into two strings so builder does not replace it :D.
		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}

		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
	}
} )();

// %LEAVE_UNMINIFIED% %REMOVE_LINE%