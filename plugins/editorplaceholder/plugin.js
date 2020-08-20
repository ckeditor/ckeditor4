/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Simple CKEditor 4 plugin that adds placeholder text to the editor.
 */
( function() {
	CKEDITOR.plugins.add( 'editorplaceholder', {
		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie || CKEDITOR.env.version >= 9;
		},

		onLoad: function() {
			CKEDITOR.addCss( CKEDITOR.plugins.editorplaceholder.styles );
		},

		init: function( editor ) {
			if ( !this.isSupportedEnvironment() || !editor.config.editorplaceholder ) {
				return;
			}

			bindPlaceholderEvents( editor, [
				'contentDom',
				'focus',
				'blur',
				'change'
			] );

		}
	} );

	var ATTRIBUTE_NAME = 'data-cke-editorplaceholder';

	/**
	 * Namespace providing configuration for editorplaceholder plugin.
	 *
	 * @singleton
	 * @class CKEDITOR.plugins.editorplaceholder
	 * @since 4.15.0
	 * @member CKEDITOR.plugins
	 */
	CKEDITOR.plugins.editorplaceholder = {
		/**
		 * Styles that would be applied to the editor by placeholder text when visible.
		 *
		 * @property {String}
		 */
		styles: '[' + ATTRIBUTE_NAME + ']::before {' +
				'position: absolute;' +
				'opacity: .8;' +
				'color: #aaa;' +
				'content: attr( ' + ATTRIBUTE_NAME + ' );' +
			'}' +
			'.cke_wysiwyg_div[' + ATTRIBUTE_NAME + ']::before {' +
				'margin-top: 1em;' +
			'}'
	};

	function bindPlaceholderEvents( editor, events ) {
		CKEDITOR.tools.array.forEach( events, function( event ) {
			editor.on( event, togglePlaceholder, null, { editor: editor } );
		} );
	}

	function isEditorEmpty( editor ) {
		var fullPageRegex = /<body>(.*?)<\/body>/i,
			isFullPage = editor.config.fullPage,
			data = editor.getData();

		if ( isFullPage ) {
			data = data.match( fullPageRegex )[ 1 ];
		}

		return data.length === 0;
	}

	function togglePlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			hasFocus = editor.focusManager.hasFocus,
			editable = editor.editable(),
			placeholder = editor.config.editorplaceholder;

		if ( !isEditorEmpty( editor ) || hasFocus ) {
			return editable.removeAttribute( ATTRIBUTE_NAME );
		}

		editable.setAttribute( ATTRIBUTE_NAME, placeholder );
	}

	/**
	 * Text that will be used as a placeholder inside the editor.
	 *
	 * ```js
	 * config.editorplaceholder = 'Type your comment…';
	 * ```
	 *
	 * If it is set to a falsy value like an empty string, it will disable placeholder.
	 *
	 * ```js
	 * // Disable placeholder.
	 * config.editorplaceholder = '';
	 * ```
	 *
	 * @cfg {String} [editorplaceholder='']
	 * @since 4.15.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.editorplaceholder = '';
}() );
