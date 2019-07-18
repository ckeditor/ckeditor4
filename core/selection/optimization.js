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
			oldRange, key, keyCode;

		if ( editor._lastKeystrokeSelection ) {
			keyCode = editor._lastKeystrokeSelection.keyCode;

			key = arrowKeyCodeMap[ keyCode ];

			oldRange = editor._lastKeystrokeSelection.range;

			editor._lastKeystrokeSelection = null;
		}

		if ( !shouldOptimize( range, this, key ) ) {
			return;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );

		preventListener = false;

		preventRecurrency( editor, range );

		// Update range only if optimization restored previous range.
		if ( keyCode && range.equals( oldRange ) ) {
			// We need to move selection by one index to the right.
			if ( key === 'left' || key === 'up' ) {
				var prev = range.getPreviousNode( isText ),
					offset = prev.getChildCount ? prev.getChildCount() : prev.getLength();

				range.setStart( prev, --offset );
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
	// - selection change is triggered by shift+left or shift+up on Firefox/IE/Edge
	// - range starts at the end of an element.
	// - range ends at the beginning of an element.
	// - one end of range is in text, and another is not.
	function shouldOptimize( range, selection, key ) {
		if ( ( key === 'left' || key === 'up' ) && ( CKEDITOR.env.gecko || CKEDITOR.env.ie ) ) {
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

			if ( !CKEDITOR.tools.objectCompare( newRange, range ) ) {
				evt.cancel();
			}
		}, null, null, -1 );
	}
} )();
