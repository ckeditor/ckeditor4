/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Applies a workaround to iOS scrolling issue. The issue occurs when typing into scrolled editor.
 *                 Editable area gets scrolled to the bottom when typing so input text is not visible on screen.
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'iosscroll', {
		init: function( editor ) {
			if ( CKEDITOR.env.iOS ) {
				editor.on( 'contentDom', function() {
					fixTypingScroll( editor );
				} );
			}
		}
	} );

	function fixTypingScroll( editor ) {
		var editable = editor.editable();

		// the bug occurs only in iframe-based editors, so don't do anything for inline editors
		if ( editable && !editable.isInline() ) {
			editable.attachListener( editable, 'input', function() {
				var selection = editor.getSelection();

				if ( !selection ) {
					return;
				}

				var range = selection.getRanges()[ 0 ];
				var nativeSelection = selection.getNative();
				var nativeRange = getNativeRange( range );

				// there's a collapsed selection when typing on iOS; removing ranges from the selection prevents
				// weird bug where editable is scrolled on typing and typed text is not visible
				nativeSelection.removeAllRanges();

				// postpone further execution to let everything what's causing the iOS scrolling bug happen
				setTimeout( function() {
					// restore the caret to where it was when typing
					nativeSelection.addRange( nativeRange );

					// additional scrolling may be needed in case of pasting
					scrollIfNeeded( range, selection, editor );
				}, 0 );
			} );
		}
	}

	function getNativeRange( range ) {
		var nativeRange = document.createRange();
		nativeRange.setStart( range.startContainer.$, range.startOffset );
		nativeRange.setEnd( range.endContainer.$, range.endOffset );

		return nativeRange;
	}

	function scrollIfNeeded( range, selection, editor ) {
		var clonedRange = range.clone();
		var nativeRange = getNativeRange( clonedRange );
		var boundingRect;
		var wrapper;
		var currentPos;

		// getBoundingClientRect in order to know caret's position
		boundingRect = nativeRange.getBoundingClientRect();

		// Safari has a bug where getBoundingClientRect returns all zeroes for collapsed ranges
		// in such case, expand the range by 1 to the left and then call getBoundingClientRect
		// expanding to the left is possible because caret is right after input text
		if ( isBoundingRectZeroed( boundingRect ) && clonedRange.startOffset > 0 ) {
			clonedRange.setStart( clonedRange.startContainer, clonedRange.startOffset - 1 );
			nativeRange = getNativeRange( clonedRange );
			boundingRect = nativeRange.getBoundingClientRect();
		}

		wrapper = editor.container.findOne( '.cke_contents' );

		if ( !wrapper ) {
			return;
		}

		currentPos = wrapper.$.scrollTop + wrapper.$.clientHeight;

		// if caret's position is below editor wrapper's visible area (which is scrollTop + height)
		if ( boundingRect && currentPos < boundingRect.top ) {
			selection.scrollIntoView();
		}
	}

	function isBoundingRectZeroed( rect ) {
		for ( var prop in rect ) {
			if ( !rect.hasOwnProperty( prop ) ) {
				continue;
			}

			if ( rect[ prop ] > 0 ) {
				return false;
			}
		}

		return true;
	}
} )();
