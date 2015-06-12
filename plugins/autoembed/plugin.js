/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'autoembed', {
		requires: 'autolink,undo',

		init: function( editor ) {
			var currentId = 1;

			editor.on( 'paste', function( evt ) {
				if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					return;
				}

				var data = evt.data.dataValue,
					parsedData,
					link;

				// Expecting exactly one <a> tag spanning the whole pasted content.
				if ( data.match( /^<a [^<]+<\/a>$/i ) ) {
					parsedData = CKEDITOR.htmlParser.fragment.fromHtml( data );

					// Embed only links with a single text node with a href attr which equals its text.
					if ( parsedData.children.length != 1 )
						return;

					link = parsedData.children[ 0 ];

					if ( link.type == CKEDITOR.NODE_ELEMENT && link.getHtml() == link.attributes.href ) {
						evt.data.dataValue = '<a data-cke-autoembed="' + ( ++currentId ) + '"' + data.substr( 2 );
					}
				}

			}, null, null, 20 ); // Execute after autolink.

			editor.on( 'afterPaste', function() {
				autoEmbedLink( editor, currentId );
			} );
		}
	} );

	function autoEmbedLink( editor, id ) {
		var anchor = editor.editable().findOne( 'a[data-cke-autoembed="' + id + '"]' );

		if ( !anchor || !anchor.data( 'cke-saved-href' ) ) {
			return;
		}

			// TODO Make this configurable (see http://dev.ckeditor.com/ticket/13214#comment:2).
		var widgetDef = editor.widgets.registered.embed,
			// TODO Move this to a method in the widget plugin.
			defaults = typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults,
			element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( defaults ) ),
			instance,
			wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
			temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

		temp.append( wrapper );
		instance = editor.widgets.initOn( element, widgetDef );

		if ( !instance ) {
			finalizeCreation();
			return;
		}

		instance.loadContent( anchor.data( 'cke-saved-href' ), {
			callback: function() {
					// DOM might be invalidated in the meantime, so find the anchor again.
				var anchor = editor.editable().findOne( 'a[data-cke-autoembed="' + id + '"]' ),
					range = editor.createRange();

				// Anchor might be removed in the meantime.
				if ( anchor ) {
					range.setStartAt( anchor, CKEDITOR.POSITION_BEFORE_START );
					range.setEndAt( anchor, CKEDITOR.POSITION_AFTER_END );

					editor.editable().insertElementIntoRange( wrapper, range );
				}

				finalizeCreation();
			},

			error: finalizeCreation
		} );

		function finalizeCreation() {
			editor.widgets.finalizeCreation( temp );
		}
	}
} )();