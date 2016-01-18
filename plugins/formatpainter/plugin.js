/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var commandDefinition = {
		startDisabled: true,
		exec: function() {

		},
		refresh: function() {

		}
	};

	CKEDITOR.plugins.add( 'formatpainter', {
		requires: 'contextmenu',
		lang: 'en',
		icons: 'formatpainter',
		hidpi: true,
		init: function( editor ) {
			var command = editor.addCommand( 'formatPainter', commandDefinition );

			editor.ui.addButton( 'formatPainter', {
				label: editor.lang.formatpainter.label,
				command: 'formatPainter',
				toolbar: 'basicstyles,90'
			} );
		}
	} );
} )();
