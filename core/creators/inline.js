/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	/** @class CKEDITOR */

	/**
	 * Turns a DOM element with the `contenteditable` attribute set to `true` into a
	 * CKEditor instance. Check {@link CKEDITOR.dtd#$editable} for a list of
	 * allowed element names.
	 *
	 * **Note:** If the DOM element for which inline editing is being enabled does not have
	 * the `contenteditable` attribute set to `true` or the {@link CKEDITOR.config#readOnly `config.readOnly`}
	 * configuration option is set to `false`, the editor will start in read-only mode.
	 *
	 *		<div contenteditable="true" id="content">...</div>
	 *		...
	 *		CKEDITOR.inline( 'content' );
	 *
	 * It is also possible to create an inline editor from the `<textarea>` element.
	 * If you do so, an additional `<div>` element with editable content will be created
	 * directly after the `<textarea>` element and the `<textarea>` element will be hidden.
	 *
	 * @param {Object/String} element The DOM element or its ID.
	 * @param {Object} [instanceConfig] The specific configurations to apply to this editor instance.
	 * See {@link CKEDITOR.config}.
	 * @returns {CKEDITOR.editor} The editor instance created.
	 */
	CKEDITOR.inline = function( element, instanceConfig ) {
		element = CKEDITOR.editor._getEditorElement( element );

		if ( !element ) {
			return null;
		}

		var editor = new CKEDITOR.editor( instanceConfig, element, CKEDITOR.ELEMENT_MODE_INLINE ),
			textarea = element.is( 'textarea' ) ? element : null;

		if ( textarea ) {
			editor.setData( textarea.getValue(), null, true );

			//Change element from textarea to div
			element = CKEDITOR.dom.element.createFromHtml(
				'<div contenteditable="' + !!editor.readOnly + '" class="cke_textarea_inline">' +
					textarea.getValue() +
				'</div>',
				CKEDITOR.document );

			element.insertAfter( textarea );
			textarea.hide();

			// Attaching the concrete form.
			if ( textarea.$.form )
				editor._attachToForm();
		} else {
			// If editor element does not have contenteditable attribute, but config.readOnly
			// is explicitly set to false, set the contentEditable property to true (#3866).
			if ( instanceConfig && typeof instanceConfig.readOnly !== 'undefined' && !instanceConfig.readOnly ) {
				element.setAttribute( 'contenteditable', 'true' );
			}

			// Initial editor data is simply loaded from the page element content to make
			// data retrieval possible immediately after the editor creation.
			editor.setData( element.getHtml(), null, true );
		}

		// Once the editor is loaded, start the UI.
		editor.on( 'loaded', function() {
			editor.fire( 'uiReady' );

			// Enable editing on the element.
			editor.editable( element );

			// Editable itself is the outermost element.
			editor.container = element;
			editor.ui.contentsElement = element;

			// Load and process editor data.
			editor.setData( editor.getData( 1 ) );

			// Clean on startup.
			editor.resetDirty();

			editor.fire( 'contentDom' );

			// Inline editing defaults to "wysiwyg" mode, so plugins don't
			// need to make special handling for this "mode-less" environment.
			editor.mode = 'wysiwyg';
			editor.fire( 'mode' );

			// The editor is completely loaded for interaction.
			editor.status = 'ready';
			editor.fireOnce( 'instanceReady' );
			CKEDITOR.fire( 'instanceReady', null, editor );

			// give priority to plugins that relay on editor#loaded for bootstrapping.
		}, null, null, 10000 );

		// Handle editor destroying.
		editor.on( 'destroy', function() {
			var container = editor.container;
			// Remove container from DOM if inline-textarea editor.
			// Show <textarea> back again.
			// Editor can be destroyed before container is created (#3115).
			if ( textarea && container ) {
				container.clearCustomData();
				container.remove();
			}

			if ( textarea ) {
				textarea.show();
			}

			editor.element.clearCustomData();

			delete editor.element;
		} );

		return editor;
	};

	/**
	 * Calls the {@link CKEDITOR#inline `CKEDITOR.inline()`} method for all page elements with the `contenteditable` attribute set to
	 * `true` that are allowed in the {@link `CKEDITOR.dtd#$editable`} object.
	 */
	CKEDITOR.inlineAll = function() {
		var el,
			data;

		for ( var name in CKEDITOR.dtd.$editable ) {
			var elements = CKEDITOR.document.getElementsByTag( name );

			for ( var i = 0, len = elements.count(); i < len; i++ ) {
				el = elements.getItem( i );

				// Check whether an element is editable and if an editor attached is not to it already (#4293).
				if ( el.getAttribute( 'contenteditable' ) == 'true' && !el.getEditor() ) {
					// Fire the "inline" event, making it possible to customize
					// the instance settings and eventually cancel the creation.

					data = {
						element: el,
						config: {}
					};

					if ( CKEDITOR.fire( 'inline', data ) !== false ) {
						CKEDITOR.inline( el, data.config );
					}
				}
			}
		}
	};

	CKEDITOR.domReady( function() {
		!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll();
	} );
} )();

/**
 * Disables creating the inline editor automatically for elements with
 * the `contenteditable` attribute set to `true`.
 *
 *		CKEDITOR.disableAutoInline = true;
 *
 * @cfg {Boolean} [disableAutoInline=false]
 */
