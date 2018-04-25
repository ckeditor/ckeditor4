/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'caretposition', {} );

	var isMSSelection = typeof window.getSelection != 'function';

	/**
	 * Returns the position of the caret.
	 *
	 * **Note:** In IE8 this method always returns the position of the real selection,
	 * while in other browsers it will stick to the position of the range returned
	 * by {@link #getRanges}, which may be one for a {@link #lock locked} or a {@link #fake fake} selection.
	 *
	 * **Note:** See {@link CKEDITOR.dom.range#getClientPosition} for information about possible issues
	 * that may be caused by serious browser bugs.
	 *
	 * @returns {Object} The caret position
	 * @returns {Number} return.left
	 * @returns {Number} return.top
	 * @returns {Number} return.height
	 * @member CKEDITOR.dom.selection
	 */
	CKEDITOR.dom.selection.prototype.getCaretPosition = function() {
		// In IE8 it's nearly impossible to move its textRange to the position
		// of our range, so we get the textRange directly from the selection.
		if ( isMSSelection ) {
			var $range = this.document.$.selection.createRange(),
				rect = $range.getBoundingClientRect();

			return {
				left: rect.left,
				top: rect.top,
				height: rect.bottom - rect.top
			};
		} else {
			// TODO Based on the selection direction collapse the range to the left or right,
			// so we really return the caret position. Currently we always collapse to the left.
			return this.getRanges()[ 0 ].getClientPosition();
		}
	};

	/**
	 * Returns the position of this range. This method works **only on collapsed ranges**.
	 *
	 * **Note:** The native `range.getBoundingClientRect` is seriously buggy in most browsers &mdash; i.e.
	 * it very often returns position `0, 0` for collapsed ranges. Therefore, if possible,
	 * this facade tries to extend the range one character to the left or to the right and it returns the position
	 * for such range. If extending is not possible, then, due to the bug, it may return the position `0, 0`.
	 *
	 * This workaround works most of the time for ranges anchored in text (or close to the text)
	 * except the case when the range is at the beginning of 2nd+ line of text.
	 * In such case extending the range to the left selects a character in the
	 * previous line and the position of this character is then returned.
	 *
	 * @returns {Object} The position.
	 * @returns {Number} return.left
	 * @returns {Number} return.top
	 * @returns {Number} return.height
	 * @member CKEDITOR.dom.range
	 */
	CKEDITOR.dom.range.prototype.getClientPosition = function() {
		var $range = this.document.$.createRange(),
			clone = this.clone(),
			extendedLeft;

		// Webkit, Blink and IE<11 have a bug (are you surprised?) and very often return 0,0,0,0
		// when range is collapsed and we are in a contenteditable element.
		// FF has the same problem although less often.

		// Workaround - we try to extend the range so it contains one character.

		// To do that we first try to move it to the closest text node which is not
		// the filling char. E.g.:
		// bar<strong>[]foo -> bar{}<strong>foo
		// <em>bar</em>{}u200b<em>foo</em> -> <em>bar{}</em>\u200b<em>foo</em>
		// <p>x</p><p>[]<em>foo... -> <p>x</p><p><em>{}foo...
		moveToTextNode( clone );

		$range.setStart( clone.startContainer.$, clone.startOffset );
		$range.setEnd( clone.endContainer.$, clone.endOffset );

		// Then we check whether we can extend the range to the left or to the right.
		if ( clone.startOffset > 0 ) {
			$range.setStart( clone.startContainer.$, clone.startOffset - 1 );
			extendedLeft = true;
		} else if ( getLength( clone.startContainer ) > clone.startOffset ) {
			$range.setEnd( clone.startContainer.$, clone.startOffset + 1 );
		}

		var rect = $range.getBoundingClientRect(),
			left = rect.left;

		// If we extended the range to the left, then the right side of the
		// bounding rect is the original range position.
		if ( extendedLeft ) {
			left = rect.right;
		}

		return { left: left, top: rect.top, height: rect.height };
	};

	// Tries to move the range to the closest text node that is not a
	// filling char. The range will not leave the current block and will
	// not be moved over empty elements like <br> or <img>.
	//
	// @param {CKEDITOR.dom.range} range The range to move.
	// @param {Boolean} [searchRight] If not given, searches left
	// and if nothing was found, then right by calling this function
	// with `searchRight` set to `true`.
	function moveToTextNode( range, searchRight ) {
		if ( isValidContainer( range.startContainer ) ) {
			return;
		}

		var clone = range.clone(),
			node, walker;

		if ( searchRight ) {
			clone.setEndAt( clone.root, CKEDITOR.POSITION_BEFORE_END );
		} else {
			clone.setStart( clone.root, 0 );
		}

		walker = new CKEDITOR.dom.walker( clone );
		walker.guard = guard;

		while ( ( node = walker[ searchRight ? 'next' : 'previous' ]() ) ) {
			if ( isValidContainer( node ) ) {
				range.moveToPosition( node, searchRight ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END );
				return;
			}
		}

		if ( !searchRight ) {
			moveToTextNode( range, true );
		}
	}

	var isWhitespace = CKEDITOR.dom.walker.whitespaces();

	function isValidContainer( node ) {
		return node.type == CKEDITOR.NODE_TEXT && !isWhitespace( node );
	}

	function guard( node ) {
		// If not an element, we can move over it.
		if ( node.type != CKEDITOR.NODE_ELEMENT ) {
			return true;
		}
		// Move only over inline elements that are not empty (like <img>).
		if ( !node.is( CKEDITOR.dtd.$inline ) || node.is( CKEDITOR.dtd.$empty ) ) {
			return false;
		}
		return true;
	}

	function getLength( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT ? node.getChildCount() : node.getLength();
	}

} )();
