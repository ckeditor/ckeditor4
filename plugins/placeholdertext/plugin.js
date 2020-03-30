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

	function togglePlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			hasFocus = editor.focusManager.hasFocus,
			editable = editor.editable(),
			placeholder = editor.config.placeholdertext;

		if ( !isEditorEmpty( editor ) || hasFocus ) {
			return editable.removeAttribute( ATTRIBUTE_NAME );
		}

		editable.setAttribute( ATTRIBUTE_NAME, placeholder );
	}

	CKEDITOR.plugins.add( 'placeholdertext', {
		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie || CKEDITOR.env.version >= 9;
		},

		onLoad: function() {
			CKEDITOR.addCss( pluginNamespace.styles );
		},

		init: function( editor ) {
			if ( !editor.config.placeholdertext ) {
				return;
			}

			editor.on( 'contentDom', togglePlaceholder, null, { editor: editor } );
			editor.on( 'focus', togglePlaceholder, null, { editor: editor } );
			editor.on( 'blur', togglePlaceholder, null, { editor: editor } );
			editor.on( 'change', togglePlaceholder, null, { editor: editor } );
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
