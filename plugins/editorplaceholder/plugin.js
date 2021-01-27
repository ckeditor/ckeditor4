/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
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
	 * Namespace providing the configuration for the Editor Placeholder plugin.
	 *
	 * @singleton
	 * @class CKEDITOR.plugins.editorplaceholder
	 * @since 4.15.0
	 * @member CKEDITOR.plugins
	 */
	CKEDITOR.plugins.editorplaceholder = {
		/**
		 * Styles that would be applied to the editor by the placeholder text when visible.
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
		// We need to include newline in the regex, as htmlwriter returns nicely formatted HTML.
		// We need to also account for <body>'s attributes (#4249).
		var fullPageRegex = /<body.*?>((?:.|[\n\r])*?)<\/body>/i,
			isFullPage = editor.config.fullPage,
			data = editor.getData();

		if ( isFullPage ) {
			var bodyDataMatched = data.match( fullPageRegex );

			// Check if body element exists in editor HTML (#4253).
			if ( bodyDataMatched && bodyDataMatched.length > 1 ) {
				data = bodyDataMatched[ 1 ];
			}
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
	 * The text that will be used as a placeholder inside the editor.
	 *
	 * ```js
	 * config.editorplaceholder = 'Type your comment…';
	 * ```
	 *
	 * If it is set to a falsy value like an empty string, it will disable the placeholder.
	 *
	 * ```js
	 * // Disable the placeholder.
	 * config.editorplaceholder = '';
	 * ```
	 *
	 * @cfg {String} [editorplaceholder='']
	 * @since 4.15.0
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.editorplaceholder = '';
}() );
