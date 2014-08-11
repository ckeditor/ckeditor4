/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "linkutils" plugin.
 *
 */

// add click to open link in new tab in ready only mode
// add ctrl + click to open link in new tab in editing mode, except IE
// Based on https://github.com/mlewand/ckeditor-plugin-openlink/blob/master/plugin.js
// http://dev.ckeditor.com/ticket/7145
// http://dev.ckeditor.com/ticket/11842
'use strict';

( function() {

	CKEDITOR.plugins.add( 'linkutils', {
		lang: 'en', // %REMOVE_LINE_CORE%
		requires: 'link',

		init: function( editor ) {
			// A quick workaround for issue #11842.
			editor.on( 'contentDom', function( evt ) {
				var editable = editor.editable();

				// We want to be able to open links also in read-only mode. This
				// listener will open link in new tab.
				editable.attachListener( editable, 'click', function( evt ) {
					// This feature should be available in:
					// * wysywigmode in read-only
					// * wysywigmode when ctrl key is down

					// FF handles it by itself. Var is inited few lines below.
					ctrlClickHandlingNeeded = evt.data.$.ctrlKey && !CKEDITOR.env.gecko;

					if ( !editor.readOnly && !ctrlClickHandlingNeeded )
						return;

					var target = evt.data.getTarget(),
						clickedAnchor = ( new CKEDITOR.dom.elementPath( target, editor.editable() ) ).contains( 'a' ),
						href = clickedAnchor && clickedAnchor.getAttribute( 'href' ),
						ctrlClickHandlingNeeded;

					if ( href )
						window.open( href, '_blank' );
				} );
			} );
		}
	} );

} )();
