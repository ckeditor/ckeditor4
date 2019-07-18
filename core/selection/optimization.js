( function() {
	var preventListener = true,
		arrowKeyCodeMap = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};

	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		var range = this.getRanges()[ 0 ],
			editor = this.root.editor,
			oldRange,
			keyCode;

		if ( editor._lastKeyStrokeSelection ) {
			keyCode = editor._lastKeyStrokeSelection.keyCode;
			oldRange = editor._lastKeyStrokeSelection.range;

			editor._lastKeyStrokeSelection = null;
		}

		if ( !shouldOptimize( range, this ) ) {
			return;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );

		preventListener = false;

		preventRecurrency( editor, range );

		if ( keyCode && range.equals( oldRange ) ) {
			var key =  arrowKeyCodeMap[ keyCode ];
			// We need to move selection by one index to the right.
			if ( key === 'left' || key === 'up' ) {
				var prev = range.getPreviousNode( isText ),
					offset = prev.getChildCount ? prev.getChildCount() : prev.getLength();

				range.setStart( prev , --offset );
			} else {
				range.setEnd( range.getNextNode( isText ), 1 );
			}
		}

		range.select();

		preventListener = true;
	};

	function isText( node ) {
		return node.type === CKEDITOR.NODE_TEXT;
	}

	// Returns whether any condition is met:
	// - range starts at the end of an element.
	// - range ends at the beginning of an element.
	// - one end of range is in text, and another is not.
	function shouldOptimize( range, selection ) {
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

			if ( !CKEDITOR.tools.objectCompare( newRange, range ) ) {
				evt.cancel();
			}
		}, null, null, -1 );
	}
} )();
