( function() {
	var preventListener = true,
		preventOptimization = false;

	/**
	 * Setups editor listeners to optimize selection.
	 *
	 * **Note**: This method is called automatically during editor initialization and shouldn't be called manually.
	 *
	 * @since 4.13.0
	 * @static
	 * @see CKEDITOR.dom.selection.optimizeInElementEnds
	 * @param {CKEDITOR.editor} editor
	 */
	CKEDITOR.dom.selection.setupEditorOptimization = function( editor ) {
		editor.on( 'selectionCheck', function( evt ) {
			if ( evt.data && !preventOptimization ) {
				evt.data.optimizeInElementEnds();
			} else {
				preventOptimization = false;
			}
		} );

		editor.on( 'instanceReady', function() {
			this.editable().on( 'keydown', function( evt ) {
				this._.shiftPressed = evt.data.$.shiftKey;
			}, this );

			this.editable().on( 'keyup', function( evt ) {
				this._.shiftPressed = evt.data.$.shiftKey;
			}, this );
		} );
	};

	/**
	 * Performs optimization on current selection if necessary.
	 *
	 * The general idea is to shrink range to text, when:
	 *
	 * - Range starts at the end of an element,
	 * - Range ends at the start of an element,
	 * - One of range ends is anchored in a text node and another in an element.
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
	 */
	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		var range = this.getRanges()[ 0 ],
			editor = this.root.editor;

		if ( !shouldOptimize( range, this ) ) {
			return;
		}

		var oldRange = range.clone();

		range.shrink( CKEDITOR.SHRINK_TEXT, false, { skipBogus: true } );

		preventListener = false;

		preventRecurrency( editor, range, oldRange );

		range.select();

		preventListener = true;
	};

	function isText( node ) {
		return node.type === CKEDITOR.NODE_TEXT;
	}

	// Returns true if any condition is met:
	// - Range starts at the end of an element.
	// - Range ends at the beginning of an element.
	// - One end of range is in text, and another one is not.
	//
	// Always returns false when:
	// - Shift key is pressed.
	// - Selection is fake.
	// - Range is collapsed.
	// - Range start and end container is the same element.
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

	// Prevent infinite recurrency when browser doesn't allow expected selection.
	// There are two cases to handle
	// - When browser modified the range in a way that it is the same as before optimization.
	// 		Second event is cancelled, we don't need to fire listeners two time with exact same selection.
	// - When browser doesn't modify the range.
	// 		Event is not cancelled, as selection changed, however next optimization is prevented.
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
