/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview POC of the line and paragraph numbering plugin.
 */

( function() {
	CKEDITOR.plugins.add( 'linenumbering', {
		lang: 'en',
		icons: 'linenumbering', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		isSupportedEnvironment: function() {
			return !CKEDITOR.env.ie;
		},

		init: function( editor ) {
			if ( !this.isSupportedEnvironment() ) {
				return;
			}

			editor.addCommand( 'showLineNumbering', {
				exec: function( editor ) {

				},
				modes: { wysiwyg: 1 },
				readOnly: 1,
				canUndo: false
			} );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'LineNumbering', {
					label: editor.lang.linenumbering.toolbar,
					command: 'showLineNumbering',
					toolbar: 'document,30'
				} );
			}

		},

	} );

	/**
	 * Line Numbering plugin namespace exposing helpers used by the plugin.
	 *
	 * @class CKEDITOR.plugins.linenumbering
	 * @singleton
	 */
	CKEDITOR.plugins.linenumbering = {

	};
} )();
