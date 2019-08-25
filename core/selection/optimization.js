( function() {
	var preventListener = true;

	/**
	 * Setups editor listeners to optimize selection.
	 *
	 * @since 4.13.0
	 * @static
	 * @see CKEDITOR.dom.selection.optimizeInElementEnds
	 * @param editor
	 */
	CKEDITOR.dom.selection.prototype.setupEditorOptimization = function( editor ) {
		// (#3175)
		editor.on( 'selectionCheck', function( evt ) {
			if ( evt.data ) {
				evt.data.optimizeInElementEnds();
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
	 * Checks if needed and performs optimization to selection.
	 *
	 * The general idea is to shrink range to text, when
	 * - range starts at the end,
	 * - range ends at the start of an element,
	 * - one of range end is anchored in a text node and another in an element.
	 *
	 * Example:
	 *
	 * ```html
	 * <p>{foo</p>
	 * <p>]bar</p>
	 * ```
	 *
	 * is optimized too
	 * ```html
	 * <p>{foo}</p>
	 * <p>bar</p>
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

		range.shrink( CKEDITOR.SHRINK_TEXT, false, { skipBogus: true } );

		preventListener = false;

		preventRecurrency( editor, range );

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
	function preventRecurrency( editor, range ) {
		editor.once( 'selectionCheck', function( evt ) {
			if ( preventListener ) {
				return;
			}

			var newRange = evt.data.getRanges()[ 0 ];

			if ( range.equals( newRange ) ) {
				evt.cancel();
			}
		}, null, null, -1 );
	}
} )();
