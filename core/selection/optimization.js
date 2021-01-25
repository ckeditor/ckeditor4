/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines methods used for selection optimization.
 */

( function() {
	var preventListener = true,
		preventOptimization = false;

	/**
	 * Sets editor listeners up to optimize the selection.
	 *
	 * **Note**: This method is called automatically during the editor initialization and should not be called manually.
	 *
	 * @since 4.13.0
	 * @static
	 * @see CKEDITOR.dom.selection.optimizeInElementEnds
	 * @param {CKEDITOR.editor} editor
	 * @member CKEDITOR.dom.selection
	 */
	CKEDITOR.dom.selection.setupEditorOptimization = function( editor ) {
		editor.on( 'selectionCheck', function( evt ) {
			if ( evt.data && !preventOptimization ) {
				evt.data.optimizeInElementEnds();
			}
			preventOptimization = false;
		} );

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			if ( !editable ) {
				return;
			}

			editable.attachListener( editable, 'keydown', function( evt ) {
				this._.shiftPressed = evt.data.$.shiftKey;
			}, this );

			editable.attachListener( editable, 'keyup', function( evt ) {
				this._.shiftPressed = evt.data.$.shiftKey;
			}, this );
		} );
	};

	/**
	 * Performs an optimization on the current selection if necessary.
	 *
	 * The general idea is to shrink the range to text when:
	 *
	 * * The range starts at the end of an element.
	 * * The range ends at the start of an element.
	 * * One of the range ends is anchored in a text node and another in an element.
	 *
	 * For example:
	 *
	 * ```html
	 *  <p>{foo</p>
	 *  <p>]bar</p>
	 * ```
	 *
	 * is optimized too:
	 *
	 * ```html
	 *  <p>{foo}</p>
	 *  <p>bar</p>
	 * ```
	 *
	 * @since 4.13.0
	 * @member CKEDITOR.dom.selection
	 */
	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		var range = this.getRanges()[ 0 ],
			editor = this.root.editor;

		if ( !shouldOptimize( range, this ) ) {
			return;
		}

		var oldRange = range.clone();

		range.shrink( CKEDITOR.SHRINK_TEXT, false, { skipBogus: !CKEDITOR.env.webkit } );

		preventListener = false;

		preventRecurrency( editor, range, oldRange );

		range.select();

		preventListener = true;
	};

	function isText( node ) {
		return node.type === CKEDITOR.NODE_TEXT;
	}

	// Returns `true` if any condition is met:
	// * The range starts at the end of an element.
	// * The range ends at the start of an element.
	// * One end of the range is in text and another one is not.
	//
	// Always returns `false` when:
	// * The Shift key is pressed.
	// * The selection is fake.
	// * The range is collapsed.
	// * The range start and end container is the same element.
	function shouldOptimize( range, selection ) {
		if ( selection.root.editor._.shiftPressed ) {
			return false;
		}

		if ( selection.isFake || range.isCollapsed || range.startContainer.equals( range.endContainer ) ) {
			return false;
		}

		if ( range.endOffset === 0 ) {
			return true;
		}

		var startsInText = isText( range.startContainer ),
			endsInText = isText( range.endContainer ),
			limit = startsInText ? range.startContainer.getLength() : range.startContainer.getChildCount();

		return range.startOffset === limit || startsInText ^ endsInText;
	}

	// Prevent infinite recurrency when the browser does not allow the expected selection.
	// There are two cases to handle:
	// - When the browser modified the range in a way that it is the same as before the optimization.
	// 		The second event is canceled, we do not need to fire listeners two times with the exact same selection.
	// - When the browser does not modify the range.
	// 		The event is not canceled, as the selection changed, however, the next optimization is prevented.
	function preventRecurrency( editor, targetRange, initialRange ) {
		editor.once( 'selectionCheck', function( evt ) {
			if ( preventListener ) {
				return;
			}

			var newRange = evt.data.getRanges()[ 0 ];

			if ( initialRange.equals( newRange ) ) {
				evt.cancel();
			} else if ( targetRange.equals( newRange ) ) {
				preventOptimization = true;
			}

		}, null, null, -1 );
	}
} )();
