/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.inline = function( element, instanceConfig ) {
		var editor = new CKEDITOR.editor( instanceConfig );

		// Set the editor instance name. It'll be set at CKEDITOR.add if it
		// remain null here.
		editor.name = element.getId() || element.getNameAtt();

		editor.element = element;
		editor.elementMode = CKEDITOR.ELEMENT_MODE_INLINE;

		// Add this new editor to the CKEDITOR.instances collections.
		CKEDITOR.add( editor );

		// Initial editor data.
		editor.setData( element.getHtml(), null, true );

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			// Enable editing on the element.
			editor.editable( element );

			// Inline editing defaults to "wysiwyg" mode, so plugins don't
			// need to make special handling for this "mode-less" environment.
			editor.mode = 'wysiwyg';
			editor.fire( 'mode' );

			// The editor is completely loaded for interaction.
			editor.fireOnce( 'instanceReady' );
			CKEDITOR.fire( 'instanceReady', null, editor );
		});

		return editor;
	};

	// Initialize all elements with contenteditable=true.
	function inlineAll() {
		var elements = CKEDITOR.dtd.$editable,
			el, data;

		for ( var name in elements ) {
			var elements = CKEDITOR.document.getElementsByTag( name );

			for ( var i = 0, len = elements.count(); i < len; i++ ) {
				el = elements.getItem( i );

				if ( el.getAttribute( 'contenteditable' ) == 'true' ) {
					// Fire the "inline" event, making it possible to customize
					// the instance settings and eventually cancel the creation.

					data = {
						element: el, config: {} };

					if ( CKEDITOR.fire( 'inline', data ) !== false )
						CKEDITOR.inline( el, data.config );
				}
			}
		}
	}

	function fireInlineAll() {
		if ( !CKEDITOR.disableAutoInline )
			inlineAll();
	}

	if ( document.readyState == 'complete' )
		fireInlineAll();
	else
		CKEDITOR.document.getWindow().on( 'load', fireInlineAll );
})();


/**
 * Avoid creating editor automatically on element which has attribute "contenteditable" set to the value "true".
 * @name CKEDITOR.disableAutoInline
 * @type Boolean
 * @default false
 * @example
 * <b>CKEDITOR.disableAutoInline</b> = true;
 */

/**
 * The editor is to be attached to the element, using it as the editing block.
 * @constant
 * @example
 */
CKEDITOR.ELEMENT_MODE_INLINE = 3;
