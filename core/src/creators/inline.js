/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.inline = function( element, instanceConfig ) {
		var editor = new CKEDITOR.editor( instanceConfig );

		// Activate the editable element.
		element = editor.editable( element );

		// Set the editor instance name. It'll be set at CKEDITOR.add if it
		// remain null here.
		editor.name = element.getId() || element.getNameAtt();

		// Set the basic data manipulation functions.

		var isHandlingData;

		editor.on( 'beforeGetData', function() {
			// TODO : Implement the real code here.
			if ( !isHandlingData ) {
				isHandlingData = 1;
				var editable = this.editable();
				editor.setData( editable && editable.getHtml() || '' );
				isHandlingData = 0;
			}
		});

		editor.on( 'afterSetData', function() {
			// TODO : Implement the real code here.
			if ( !isHandlingData ) {
				isHandlingData = 1;
				var editable = this.editable();
				editable && editable.setHtml( editor.getData() );
				isHandlingData = 0;
			}
		});

		editor.on( 'getSnapshot', function( event ) {
			var editable = this.editable();
			event.data = editable && editable.getHtml() || '';
		});

		editor.on( 'loadSnapshot', function( event ) {
			var editable = this.editable();
			editable && editable.setHtml( event.data );
		});

		// Add this new editor to the CKEDITOR.instances collections.
		CKEDITOR.add( editor );

		// Tell the world that this instance is ready.
		editor.fire( 'instanceReady' );

		return editor;
	}

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
