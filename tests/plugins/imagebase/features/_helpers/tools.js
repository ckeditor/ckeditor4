/* exported imageBaseFeaturesTools */
/* global pasteFiles */

( function() {
	'use strict';

	function objToArray( obj ) {
		var tools = CKEDITOR.tools;

		return tools.array.map( tools.objectKeys( obj ), function( key ) {
			return obj[ key ];
		} );
	}

	window.imageBaseFeaturesTools = {
		/*
		 * Main assertion for pasting files.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {Object} options
		 * @param {File[]} [options.files=[]] Files to be dropped.
		 * @param {Function} options.callback Function to be called after the paste event.
		 * Params:
		 *
		 * * `CKEDITOR.plugins.widget[]` widgets - Array of widgets in a given editor.
		 * * `CKEDITOR.eventInfo` evt - Paste event.
		 */
		assertPasteFiles: function( editor, options ) {
			var files = options.files || [],
				callback = options.callback;

			editor.once( 'paste', function( evt ) {
				// Unfortunately at the time being we need to do additional timeout here, as
				// the paste event gets cancelled.
				setTimeout( function() {
					resume( function() {
						callback( objToArray( editor.widgets.instances ), evt );
					} );
				}, 0 );
			}, null, null, -1 );

			// pasteFiles is defined in filetools plugin helper.
			pasteFiles( editor, files );

			wait();
		}
	};
} )();
