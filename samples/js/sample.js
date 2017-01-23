/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported initSample */

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
	CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
//CKEDITOR.config.height = 150;
//CKEDITOR.config.width = 'auto';

var initSample = ( function() {
	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );

		editorElement.setAttribute( 'contenteditable', 'true' );
		CKEDITOR.inline( 'editor' );
	};
} )();

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
