/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file AutoGrow plugin
 */ ( function() {

	var parts = [ "margin-top", "margin-bottom", "border-top-width", "border-bottom-width", "padding-top", "padding-bottom" ];

	function nonContentHeight( element ) {
		var adjustment = 0;
		for ( var i = 0, len = parts.length; i < len; i++ )
			adjustment += parseInt( element.getComputedStyle( parts[ i ] ) || 0, 10 ) || 0;
		return adjustment;
	}

	// Count for spaces outside of  the actual content.
	function extra( element ) {
		var margin = 0;
		margin += nonContentHeight( element );
		if ( element.is( 'html' ) )
			margin += nonContentHeight( element.getDocument().getBody() );
		return margin;
	}

	// Actual content height, figured out by simply check the last element's document position.
	function docContentHeight( doc ) {
		var last = doc.getBody().getLast();

		// Last node is not measurable,  create a temporary marker element.
		if ( !last || last.type != CKEDITOR.NODE_ELEMENT || last.is( 'br' ) ) {
			last = CKEDITOR.dom.element.createFromHtml( '<span>' + ( CKEDITOR.env.webkit ? '&nbsp;' : '' ) + '</span>', doc );
			doc.getBody().append( last );
			last.isMarker = 1;
		}

		var height = last.getDocumentPosition( doc ).y + last.$.offsetHeight;
		last.isMarker && last.remove();
		return height;
	}

	CKEDITOR.plugins.add( 'autogrow', {
		init: function( editor ) {
			var contentMargin = 0;
			var resizeEditor = function( editor ) {
					if ( !editor.window )
						return;

					var doc = editor.document,
						resizeable = editor.getResizable( 1 ),
						body = doc.getBody(),
						htmlElement = doc.getDocumentElement(),
						currentHeight = resizeable.$.offsetHeight,
						newHeight;

					// Quirks mode overflows body except for IE9, standards overflows document element.
					var scrollable = !CKEDITOR.env.ie9Compat && doc.$.compatMode == 'BackCompat' ? body : htmlElement,
						contentHeight = docContentHeight( doc ),
						delta = contentHeight - scrollable.$.clientHeight + extra( scrollable );

					// Delta height from either increasing or decreasing.
					if ( delta ) {
						newHeight = currentHeight + delta;
						var min = editor.config.autoGrow_minHeight,
							max = editor.config.autoGrow_maxHeight;

						( min == undefined ) && ( editor.config.autoGrow_minHeight = min = 200 );
						if ( min )
							newHeight = Math.max( newHeight, min );
						if ( max )
							newHeight = Math.min( newHeight, max );

						if ( newHeight != currentHeight ) {
							newHeight = editor.fire( 'autoGrow', { currentHeight: currentHeight, newHeight: newHeight } ).newHeight;
							resizeable.setStyle( 'height', newHeight + 'px' );
							editor.fire( 'resize' );
							// Calculate and record now the margin between the actual content size and page size.
							setTimeout( function() {
								contentMargin = scrollable.scrollHeight - body.offsetHeight;
							}, 0 );

						}
					}
				};

			for ( var eventName in { contentDom:1,key:1,selectionChange:1,insertElement:1 } ) {
				editor.on( eventName, function( evt ) {
					var maximize = editor.getCommand( 'maximize' );
					// Some time is required for insertHtml, and it gives other events better performance as well.
					if ( evt.editor.mode == 'wysiwyg' &&
						// Disable autogrow when the editor is maximized .(#6339)
						( !maximize || maximize.state != CKEDITOR.TRISTATE_ON ) ) {
						setTimeout( function() {
							resizeEditor( evt.editor );
						}, 100 );
					}
				});
			}
		}
	});
})();
/**
 * The minimum height to which the editor can reach using AutoGrow.
 * @name CKEDITOR.config.autoGrow_minHeight
 * @type Number
 * @default 200
 * @since 3.4
 * @example
 * config.autoGrow_minHeight = 300;
 */

/**
 * The maximum height to which the editor can reach using AutoGrow. Zero means unlimited.
 * @name CKEDITOR.config.autoGrow_maxHeight
 * @type Number
 * @default 0
 * @since 3.4
 * @example
 * config.autoGrow_maxHeight = 400;
 */

/**
 * Fired when the AutoGrow plugin is about to change the size of the editor.
 * @name CKEDITOR.editor#autogrow
 * @event
 * @param {Number} data.currentHeight The current height of the editor (before the resizing).
 * @param {Number} data.newHeight The new height of the editor (after the resizing). It can be changed
 *				to determine another height to be used instead.
 */
