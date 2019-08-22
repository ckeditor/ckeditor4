( function() {
	var preventListener = true;

	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		var range = this.getRanges()[ 0 ],
			editor = this.root.editor;

		if ( !shouldOptimize( range, this ) ) {
			return;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );

		preventListener = false;

		preventRecurrency( editor, range );

		range.select();

		preventListener = true;
	};

	function isText( node ) {
		return node.type === CKEDITOR.NODE_TEXT;
	}

	// Returns true any condition is met:
	// - range starts at the end of an element.
	// - range ends at the beginning of an element.
	// - one end of range is in text, and another is not.
	// Exceptions that will always return false:
	// - shift key is pressed.
	// - selection is fake.
	// - range is collapsed or start and end container is same element.
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

			if ( !CKEDITOR.tools.objectCompare( newRange, range ) ) {
				evt.cancel();
			}
		}, null, null, -1 );
	}
} )();
