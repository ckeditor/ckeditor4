/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Simple CKEditor 4 plugin that adds placeholder text to the editor.
 */
( function() {
	/**
	 * Namespace providing configuration for placeholdertext plugin..
	 *
	 * @singleton
	 * @class CKEDITOR.plugins.placeholdertext
	 */
	var pluginNamespace = {
		/**
		 * Template, which will be used to create placeholder element.
		 *
		 * `{PLACEHOLDER}` is replaced by the value of CKEDITOR.config.placeholdertext.
		 *
		 * @property {String}
		 */
		template: '<p data-cke-placeholdertext>{PLACEHOLDER}</p>',

		/**
		 * Styles that would be applied to the placeholder element.
		 *
		 * @property {String}
		 */
		styles: '[data-cke-placeholdertext] {' +
				'opacity: .8;' +
				'color: #aaa;' +
			'}'
	};

	function isEditorEmpty( editor ) {
		return editor.getData().length === 0;
	}

	function applyPlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			placeholder = pluginNamespace.template.replace( '{PLACEHOLDER}', editor.config.placeholdertext );

		if ( isEditorEmpty( editor ) ) {
			editor.editable().setHtml( placeholder );
		}
	}

	function removePlaceholder( evt ) {
		var editor = evt.listenerData.editor,
			editable = editor.editable(),
			range = editor.createRange(),
			placeholder = editable.findOne( '[data-cke-placeholdertext]' );

		if ( !placeholder) {
			return;
		}

		editor.fire( 'lockSnapshot' );
		placeholder.remove();
		range.moveToElementEditStart( editable );
		range.select();
		editor.fire( 'unlockSnapshot' );
	}

	function fixGetData( evt ) {
		var fragment = evt.data.dataValue,
			children = fragment.children;


		if ( children.length !== 1 ||
			typeof children[ 0 ].attributes[ 'data-cke-placeholdertext' ] === 'undefined' ) {
			return;
		}

		children[ 0 ].remove();
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

			editor.on( 'toDataFormat', fixGetData, null, null, 9 );
		}
	} );

	CKEDITOR.plugins.placeholdertext = pluginNamespace;

	/**
	 * Text that will be used as a placeholder inside the editor.
	 *
	 * If set to falsy value, it will disable placeholder.
	 *
	 * ```js
	 * // Disable placeholder.
	 * config.placeholdertext = false;
	 * ```
	 *
	 * @cfg {String} placeholdertext
	 * @member CKEDITOR.config
	 */
	 CKEDITOR.config.placeholdertext = '';
}() );
