( function() {
	var preventListener = true;

	CKEDITOR.dom.selection.prototype.optimizeInElementEnds = function() {
		if ( this.isFake ) {
			return;
		}

		var range = this.getRanges()[ 0 ];

		if ( range.isCollapsed ) {
			return;
		}

		if ( range.startContainer.equals( range.endContainer ) ) {
			return;
		}

		if ( !shouldOptimize( range ) ) {
			return;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );

		preventListener = false;

		preventRecurrency( this.root.editor, range );

		range.select();

		preventListener = true;
	};

	// Returns whether any condition is met:
	// - range starts at the end of an element.
	// - range ends at the beginning of an element.
	// - one end of range is in text, and another is not.
	function shouldOptimize( range ) {
		if ( range.endOffset === 0 ) {
			return true;
		}

		var startsInText = range.startContainer.type === CKEDITOR.NODE_TEXT,
			limit = startsInText ? range.startContainer.getLength() : range.startContainer.getChildCount();

		if ( range.startOffset === limit ) {
			return true;
		}

		var endsInText = range.endContainer.type === CKEDITOR.NODE_TEXT;

		return startsInText ^ endsInText;
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
