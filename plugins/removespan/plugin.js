CKEDITOR.plugins.add( 'removespan', {
	icons: 'removespan',
	hidpi: false,
	init: function( editor ) {
		var pluginName = 'removespan';
        editor.ui.addButton('RemoveSpan',
		{
			label: 'Remove <span> tags',
			command: 'ClearSpan'
			//icon: CKEDITOR.plugins.getPath('removespan') + 'btn-remove-span.png'
		});
		editor.addCommand( 'ClearSpan', CKEDITOR.plugins.removeSpan.commands.removespan );
	}
} );

CKEDITOR.plugins.removeSpan = {
	commands: {
		removespan: {
			exec: function( editor ) {
				var tagsRegex = editor._.removeSpanRegex || ( editor._.removeSpanRegex = new RegExp( '^(?:' + editor.config.removeSpanTags.replace( /,/g, '|' ) + ')$', 'i' ) );
				var removeAttributes = editor._.removeAttributes || ( editor._.removeAttributes = editor.config.removeSpanAttributes.split( ',' ) );

				var filter = CKEDITOR.plugins.removeSpan.filter;
				var ranges = editor.getSelection().getRanges( 1 ),
					iterator = ranges.createIterator(),
					range;

				while ( ( range = iterator.getNextRange() ) ) {
					if ( !range.collapsed )
						range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

					// Bookmark the range so we can re-select it after processing.
					var bookmark = range.createBookmark(),
						// The style will be applied within the bookmark boundaries.
						startNode = bookmark.startNode,
						endNode = bookmark.endNode,
						currentNode;

					// We need to check the selection boundaries (bookmark spans) to break
					// the code in a way that we can properly remove partially selected nodes.
					// For example, removing a <b> style from
					//		<b>This is [some text</b> to show <b>the] problem</b>
					// ... where [ and ] represent the selection, must result:
					//		<b>This is </b>[some text to show the]<b> problem</b>
					// The strategy is simple, we just break the partial nodes before the
					// removal logic, having something that could be represented this way:
					//		<b>This is </b>[<b>some text</b> to show <b>the</b>]<b> problem</b>

					var breakParent = function( node ) {
							// Let's start checking the start boundary.
							var path = editor.elementPath( node ),
								pathElements = path.elements;

							for ( var i = 1, pathElement; pathElement = pathElements[ i ]; i++ ) {
								if ( pathElement.equals( path.block ) || pathElement.equals( path.blockLimit ) )
									break;

								// If this element can be removed (even partially).
								if ( tagsRegex.test( pathElement.getName() ) && filter( editor, pathElement ) )
									node.breakParent( pathElement );
							}
						};

					breakParent( startNode );
					if ( endNode ) {
						breakParent( endNode );

						// Navigate through all nodes between the bookmarks.
						currentNode = startNode.getNextSourceNode( true, CKEDITOR.NODE_ELEMENT );

						while ( currentNode ) {
							// If we have reached the end of the selection, stop looping.
							if ( currentNode.equals( endNode ) )
								break;

							// Cache the next node to be processed. Do it now, because
							// currentNode may be removed.
							var nextNode = currentNode.getNextSourceNode( false, CKEDITOR.NODE_ELEMENT );

							// This node must not be a fake element.
							if ( !( currentNode.getName() == 'img' && currentNode.data( 'cke-realelement' ) ) && filter( editor, currentNode ) ) {
								// Remove elements nodes that match with this style rules.
								if ( tagsRegex.test( currentNode.getName() ) )
									currentNode.remove( 1 );
								else {
									currentNode.removeAttributes( removeAttributes );
									editor.fire( 'removeSpanCleanup', currentNode );
								}
							}

							currentNode = nextNode;
						}
					}

					range.moveToBookmark( bookmark );
				}

				// The selection path may not changed, but we should force a selection
				// change event to refresh command states, due to the above attribution change. (#9238)
				editor.forceNextSelectionCheck();
				editor.getSelection().selectRanges( ranges );
			}
		}
	},

	// Perform the remove format filters on the passed element.
	// @param {CKEDITOR.editor} editor
	// @param {CKEDITOR.dom.element} element
	filter: function( editor, element ) {
		var filters = editor._.removeSpanFilters || [];
		for ( var i = 0; i < filters.length; i++ ) {
			if ( filters[ i ]( element ) === false )
				return false;
		}
		return true;
	}
};

CKEDITOR.editor.prototype.addremoveSpanFilter = function( func ) {
	if ( !this._.removeSpanFilters )
		this._.removeSpanFilters = [];

	this._.removeSpanFilters.push( func );
};

// Remove apenas tags <span>
CKEDITOR.config.removeSpanTags = 'span';
CKEDITOR.config.removeSpanAttributes = 'class,style,lang,width,height,align,hspace,valign';
