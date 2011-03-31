/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var Editable = CKEDITOR.tools.createClass({
		base: CKEDITOR.dom.element,

		$: function( editor, element ) {
			// Transform the element into a CKEDITOR.dom.element instance.
			element = CKEDITOR.dom.element.get( element );
			element._ = { editor: editor };

			element.addClass( 'ckeditor-editable' );

			// Start the CKEditor magic for this element.
			if ( editor.loaded )
				attach( editor, element );
			else {
				editor.on( 'loaded', function() {
					attach( editor, element );
				});
			}

			return CKEDITOR.dom.element.get( element );
		}
	});

	// This method is being defined here because we want to keep the Editable
	// class contructor private, avoiding having it's entire code into editor.js.
	CKEDITOR.editor.prototype.editable = function( element ) {
		var editable = this._.editable;

		if ( arguments.length )
			editable = this._.editable = element ? new Editable( this, element ) : ( detach( editable ), null );

		return editable;
	}

	function attach( editor, element ) {
		editor.document = element.getDocument();

		// TODO: A lot of things are supposed to happen her (good part of the
		// v3 wywiwygarea plugin code).
		// For now, we have just a small part of it, to check if things work.

		var focusElement = element;
		if ( focusElement.is( 'body' ) )
			focusElement = element.getDocument().getWindow();

		focusElement.on( 'focus', editorFocus, editor );
		focusElement.on( 'blur', editorBlur, editor );

		// ## START : disableNativeTableHandles and disableObjectResizing settings.

		// Note that these settings are applied "document wide". It's not
		// possible to limit them to specific editables only.

		// IE, Opera and Safari may not support it and throw errors.
		try {
			editor.document.$.execCommand( 'enableInlineTableEditing', false, !editor.config.disableNativeTableHandles );
		} catch ( e ) {}

		if ( editor.config.disableObjectResizing ) {
			try {
				element.getDocument().$.execCommand( 'enableObjectResizing', false, false );
			} catch ( e ) {
				// For browsers in which the above method failed, we can cancel the resizing on the fly (#4208)
				element.on( CKEDITOR.env.ie ? 'resizestart' : 'resize', function( evt ) {
					evt.data.preventDefault();
				});
			}
		}

		// ## END
	}

	function detach( editable ) {
		editable.removeClass( 'ckeditor-editable' );
		editable.removeListener( 'focus', editorFocus );

		delete editable._.editor;
	}

	function editorFocus() {
		this.focusManager.focus();
	}

	function editorBlur() {
		this.focusManager.blur();
	}
})();
