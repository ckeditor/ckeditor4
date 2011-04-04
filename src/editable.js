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

		// Gecko needs a key event to 'wake up' editing when the document is
		// empty. (#3864, #5781)
		CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout( activateEditing, 0, element, editor );

		// Fire doubleclick event for double-clicks.
		element.on( 'dblclick', function( evt ) {
			var data = { element: evt.data.getTarget() };
			editor.fire( 'doubleclick', data );

			// TODO: Make the following work at the proper place (from v3).
			// data.dialog && editor.openDialog( data.dialog );
		});

		// TODO: check if this is effective.
		// Prevent automatic submission in IE #6336
		CKEDITOR.env.ie && element.on( 'click', blockInputClick );

		// Gecko/Webkit need some help when selecting control type elements. (#3448)
		if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
			element.on( 'mousedown', function( ev ) {
				var control = ev.data.getTarget();
				if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
					editor.getSelection().selectElement( control );
			});
		}
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

	function activateEditing( editor ) {
		// TODO: Check whether this is needed on inline mode.
		// Needed for full page only.
		if ( !this.is( 'body' ) )
			return;

		var win = editor.window,
			doc = editor.document,
			body = editor.document.getBody(),
			bodyFirstChild = body.getFirst(),
			bodyChildsNum = body.getChildren().count();

		if ( !bodyChildsNum || bodyChildsNum == 1 && bodyFirstChild.type == CKEDITOR.NODE_ELEMENT && bodyFirstChild.hasAttribute( '_moz_editor_bogus_node' ) ) {
			restoreDirty( editor );

			// Memorize scroll position to restore it later (#4472).
			var hostDocument = editor.element.getDocument();
			var hostDocumentElement = hostDocument.getDocumentElement();
			var scrollTop = hostDocumentElement.$.scrollTop;
			var scrollLeft = hostDocumentElement.$.scrollLeft;

			// Simulating keyboard character input by dispatching a keydown of white-space text.
			var keyEventSimulate = doc.$.createEvent( "KeyEvents" );
			keyEventSimulate.initKeyEvent( 'keypress', true, true, win.$, false, false, false, false, 0, 32 );
			doc.$.dispatchEvent( keyEventSimulate );

			if ( scrollTop != hostDocumentElement.$.scrollTop || scrollLeft != hostDocumentElement.$.scrollLeft )
				hostDocument.getWindow().$.scrollTo( scrollLeft, scrollTop );

			// Restore the original document status by placing the cursor before a bogus br created (#5021).
			bodyChildsNum && body.getFirst().remove();
			doc.getBody().appendBogus();
			var nativeRange = new CKEDITOR.dom.range( doc );
			nativeRange.setStartAt( body, CKEDITOR.POSITION_AFTER_START );
			nativeRange.select();
		}
	}

	// DOM modification here should not bother dirty flag.(#4385)
	function restoreDirty( editor ) {
		if ( !editor.checkDirty() )
			setTimeout( function() {
			editor.resetDirty();
		}, 0 );
	}

	function blockInputClick( evt ) {
		var element = evt.data.getTarget();
		if ( element.is( 'input' ) ) {
			var type = element.getAttribute( 'type' );
			if ( type == 'submit' || type == 'reset' )
				evt.data.preventDefault();
		}
	}
})();
