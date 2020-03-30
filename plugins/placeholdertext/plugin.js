/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Simple CKEditor 4 plugin that adds placeholder text to the editor.
 */
( function() {
	var ATTRIBUTE_NAME = 'data-cke-placeholdertext',
		/**
		 * Namespace providing configuration for placeholdertext plugin..
		 *
		 * @singleton
		 * @class CKEDITOR.plugins.placeholdertext
		 * @member CKEDITOR.plugins
		 */
		pluginNamespace = {
			/**
			 * Styles that would be applied to the placeholder element.
			 *
			 * @property {String}
			 */
			styles: '[' + ATTRIBUTE_NAME + ']::before {' +
					'opacity: .8;' +
					'color: #aaa;' +
					'content: attr( ' + ATTRIBUTE_NAME + ' );' +
				'}'
		};

	function isEditorEmpty( editor ) {
		return editor.getData().length === 0;
	}

	function applyPlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			placeholder = editor.config.placeholdertext;

		if ( isEditorEmpty( editor ) ) {
			editor.editable().setAttribute( ATTRIBUTE_NAME, placeholder );
		}
	}

	function removePlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			editable = editor.editable(),
			placeholder = editable.hasAttribute( ATTRIBUTE_NAME );

		if ( !placeholder ) {
			return;
		}

		editable.removeAttribute( ATTRIBUTE_NAME );
	}

	CKEDITOR.plugins.add( 'placeholdertext', {
		onLoad: function() {
			CKEDITOR.addCss( pluginNamespace.styles );
		},

		init: function( editor ) {
			if ( !editor.config.placeholdertext ) {
				return;
			}

			editor.on( 'contentDom', applyPlaceholder, null, { editor: editor } );
			editor.on( 'focus', removePlaceholder, null, { editor: editor } );
			editor.on( 'blur', applyPlaceholder, null, { editor: editor } );
		}
	} );

	CKEDITOR.plugins.placeholdertext = pluginNamespace;

	/**
	 * Text that will be used as a placeholder inside the editor.
	 *
	 * ```js
	 * config.placeholdertext = 'Type your comment…'
	 * ```
	 *
	 * If it is set to an empty string, it will disable placeholder.
	 *
	 * ```js
	 * // Disable placeholder.
	 * config.placeholdertext = '';
	 * ```
	 *
	 * @cfg {String} [placeholdertext='']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.placeholdertext = '';
}() );
