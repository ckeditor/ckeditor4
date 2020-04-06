/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Simple CKEditor 4 plugin that adds placeholder text to the editor.
 */
( function() {
	CKEDITOR.plugins.add( 'placeholdertext', {
		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie || CKEDITOR.env.version >= 9;
		},

		onLoad: function() {
			CKEDITOR.addCss( CKEDITOR.plugins.placeholdertext.styles );
		},

		init: function( editor ) {
			if ( !this.isSupportedEnvironment() || !editor.config.placeholdertext ) {
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

	var ATTRIBUTE_NAME = 'data-cke-placeholdertext';

	/**
	 * Namespace providing configuration for placeholdertext plugin..
	 *
	 * @singleton
	 * @class CKEDITOR.plugins.placeholdertext
	 * @member CKEDITOR.plugins
	 */
	CKEDITOR.plugins.placeholdertext = {
		/**
		 * Styles that would be applied to the placeholder element.
		 *
		 * @property {String}
		 */
		styles: '[' + ATTRIBUTE_NAME + ']::before {' +
				'display: block;' +
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

	/**
	 * Text that will be used as a placeholder inside the editor.
	 *
	 * ```js
	 * config.placeholdertext = 'Type your comment…';
	 * ```
	 *
	 * If it is set to a falsy value like an empty string, it will disable placeholder.
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
