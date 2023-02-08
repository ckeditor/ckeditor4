/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Insert and remove numbered and bulleted lists.
 */

( function() {
	var listNodeNames = { ol: 1, ul: 1 };

	var whitespaces = CKEDITOR.dom.walker.whitespaces(),
		bookmarks = CKEDITOR.dom.walker.bookmark(),
		nonEmpty = function( node ) {
			return !( whitespaces( node ) || bookmarks( node ) );
		},
		blockBogus = CKEDITOR.dom.walker.bogus();

	function cleanUpDirection( element ) {
		var dir, parent, parentDir;
		if ( ( dir = element.getDirection() ) ) {
			parent = element.getParent();
			while ( parent && !( parentDir = parent.getDirection() ) )
				parent = parent.getParent();

			if ( dir == parentDir )
				element.removeAttribute( 'dir' );
		}
	}

	// Inherit inline styles from another element.
	function inheritInlineStyles( parent, el ) {
		var style = parent.getAttribute( 'style' );

		// Put parent styles before child styles.
		style && el.setAttribute( 'style', style.replace( /([^;])$/, '$1;' ) + ( el.getAttribute( 'style' ) || '' ) );
	}

	CKEDITOR.plugins.list = {
		/**
		 * Convert a DOM list tree into a data structure that is easier to
		 * manipulate. This operation should be non-intrusive in the sense that it
		 * does not change the DOM tree, with the exception that it may add some
		 * markers to the list item nodes when database is specified.
		 *
		 * @member CKEDITOR.plugins.list
		 * @todo params
		 */
		listToArray: function( listNode, database, baseArray, baseIndentLevel, grandparentNode ) {
			if ( !listNodeNames[ listNode.getName() ] )
				return [];

			if ( !baseIndentLevel )
				baseIndentLevel = 0;
			if ( !baseArray )
				baseArray = [];

			// Iterate over all list items to and look for inner lists.
			for ( var i = 0, count = listNode.getChildCount(); i < count; i++ ) {
				var listItem = listNode.getChild( i );

				// Fixing malformed nested lists by moving it into a previous list item. (https://dev.ckeditor.com/ticket/6236)
				if ( listItem.type == CKEDITOR.NODE_ELEMENT && listItem.getName() in CKEDITOR.dtd.$list )
					CKEDITOR.plugins.list.listToArray( listItem, database, baseArray, baseIndentLevel + 1 );

				// It may be a text node or some funny stuff.
				if ( listItem.$.nodeName.toLowerCase() != 'li' )
					continue;

				var itemObj = { 'parent': listNode, indent: baseIndentLevel, element: listItem, contents: [] };
				if ( !grandparentNode ) {
					itemObj.grandparent = listNode.getParent();
					if ( itemObj.grandparent && itemObj.grandparent.$.nodeName.toLowerCase() == 'li' )
						itemObj.grandparent = itemObj.grandparent.getParent();
				} else {
					itemObj.grandparent = grandparentNode;
				}

				if ( database )
					CKEDITOR.dom.element.setMarker( database, listItem, 'listarray_index', baseArray.length );
				baseArray.push( itemObj );

				for ( var j = 0, itemChildCount = listItem.getChildCount(), child; j < itemChildCount; j++ ) {
					child = listItem.getChild( j );
					if ( child.type == CKEDITOR.NODE_ELEMENT && listNodeNames[ child.getName() ] )
					// Note the recursion here, it pushes inner list items with
					// +1 indentation in the correct order.
					CKEDITOR.plugins.list.listToArray( child, database, baseArray, baseIndentLevel + 1, itemObj.grandparent );
					else
						itemObj.contents.push( child );
				}
			}
			return baseArray;
		},

		/**
		 * Convert our internal representation of a list back to a DOM forest.
		 *
		 * @member CKEDITOR.plugins.list
		 * @todo params
		 */
		arrayToList: function( listArray, database, baseIndex, paragraphMode, dir ) {
			if ( !baseIndex )
				baseIndex = 0;
			if ( !listArray || listArray.length < baseIndex + 1 )
				return null;

			var i,
				doc = listArray[ baseIndex ].parent.getDocument(),
				retval = new CKEDITOR.dom.documentFragment( doc ),
				rootNode = null,
				currentIndex = baseIndex,
				indentLevel = Math.max( listArray[ baseIndex ].indent, 0 ),
				currentListItem = null,
				orgDir, block,
				paragraphName = ( paragraphMode == CKEDITOR.ENTER_P ? 'p' : 'div' );

			while ( 1 ) {
				var item = listArray[ currentIndex ],
					itemGrandParent = item.grandparent;

				orgDir = item.element.getDirection( 1 );

				if ( item.indent == indentLevel ) {
					if ( !rootNode || listArray[ currentIndex ].parent.getName() != rootNode.getName() ) {
						rootNode = listArray[ currentIndex ].parent.clone( false, 1 );
						dir && rootNode.setAttribute( 'dir', dir );
						retval.append( rootNode );
					}
					currentListItem = rootNode.append( item.element.clone( 0, 1 ) );

					if ( orgDir != rootNode.getDirection( 1 ) )
						currentListItem.setAttribute( 'dir', orgDir );

					for ( i = 0; i < item.contents.length; i++ )
						currentListItem.append( item.contents[ i ].clone( 1, 1 ) );
					currentIndex++;
				} else if ( item.indent == Math.max( indentLevel, 0 ) + 1 ) {
					// Maintain original direction (https://dev.ckeditor.com/ticket/6861).
					var currDir = listArray[ currentIndex - 1 ].element.getDirection( 1 ),
						listData = CKEDITOR.plugins.list.arrayToList( listArray, null, currentIndex, paragraphMode, currDir != orgDir ? orgDir : null );

					// If the next block is an <li> with another list tree as the first
					// child, we'll need to append a filler (<br>/NBSP) or the list item
					// wouldn't be editable. (https://dev.ckeditor.com/ticket/6724)
					if ( !currentListItem.getChildCount() && CKEDITOR.env.needsNbspFiller && doc.$.documentMode <= 7 )
						currentListItem.append( doc.createText( '\xa0' ) );
					currentListItem.append( listData.listNode );
					currentIndex = listData.nextIndex;
				} else if ( item.indent == -1 && !baseIndex && itemGrandParent ) {
					if ( listNodeNames[ itemGrandParent.getName() ] ) {
						currentListItem = item.element.clone( false, true );
						if ( orgDir != itemGrandParent.getDirection( 1 ) )
							currentListItem.setAttribute( 'dir', orgDir );
					} else {
						currentListItem = new CKEDITOR.dom.documentFragment( doc );
					}

					// Migrate all children to the new container,
					// apply the proper text direction.
					var dirLoose = itemGrandParent.getDirection( 1 ) != orgDir,
						li = item.element,
						className = li.getAttribute( 'class' ),
						style = li.getAttribute( 'style' );

					var needsBlock = currentListItem.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && ( paragraphMode != CKEDITOR.ENTER_BR || dirLoose || style || className );

					var child,
						count = item.contents.length,
						cachedBookmark;

					for ( i = 0; i < count; i++ ) {
						child = item.contents[ i ];

						// Append bookmark if we can, or cache it and append it when we'll know
						// what to do with it. Generally - we want to keep it next to its original neighbour.
						// Exception: if bookmark is the only child it hasn't got any neighbour, so handle it normally
						// (wrap with block if needed).
						if ( bookmarks( child ) && count > 1 ) {
							// If we don't need block, it's simple - append bookmark directly to the current list item.
							if ( !needsBlock )
								currentListItem.append( child.clone( 1, 1 ) );
							else
								cachedBookmark = child.clone( 1, 1 );
						}
						// Block content goes directly to the current list item, without wrapping.
						else if ( child.type == CKEDITOR.NODE_ELEMENT && child.isBlockBoundary() ) {
							// Apply direction on content blocks.
							if ( dirLoose && !child.getDirection() )
								child.setAttribute( 'dir', orgDir );

							inheritInlineStyles( li, child );

							className && child.addClass( className );

							// Close the block which we started for inline content.
							block = null;
							// Append bookmark directly before current child.
							if ( cachedBookmark ) {
								currentListItem.append( cachedBookmark );
								cachedBookmark = null;
							}
							// Append this block element to the list item.
							currentListItem.append( child.clone( 1, 1 ) );
						}
						// Some inline content was found - wrap it with block and append that
						// block to the current list item or append it to the block previously created.
						else if ( needsBlock ) {
							// Establish new block to hold text direction and styles.
							if ( !block ) {
								block = doc.createElement( paragraphName );
								currentListItem.append( block );
								dirLoose && block.setAttribute( 'dir', orgDir );
							}

							// Copy over styles to new block;
							style && block.setAttribute( 'style', style );
							className && block.setAttribute( 'class', className );

							// Append bookmark directly before current child.
							if ( cachedBookmark ) {
								block.append( cachedBookmark );
								cachedBookmark = null;
							}
							block.append( child.clone( 1, 1 ) );
						}
						// E.g. BR mode - inline content appended directly to the list item.
						else {
							currentListItem.append( child.clone( 1, 1 ) );
						}
					}

					// No content after bookmark - append it to the block if we had one
					// or directly to the current list item if we finished directly in the current list item.
					if ( cachedBookmark ) {
						( block || currentListItem ).append( cachedBookmark );
						cachedBookmark = null;
					}

					if ( currentListItem.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && currentIndex != listArray.length - 1 ) {
						var last;

						// Remove bogus <br> if this browser uses them.
						if ( CKEDITOR.env.needsBrFiller ) {
							last = currentListItem.getLast();
							if ( last && last.type == CKEDITOR.NODE_ELEMENT && last.is( 'br' ) )
								last.remove();
						}

						// If the last element is not a block, append <br> to separate merged list items.
						last = currentListItem.getLast( nonEmpty );
						if ( !( last && last.type == CKEDITOR.NODE_ELEMENT && last.is( CKEDITOR.dtd.$block ) ) )
							currentListItem.append( doc.createElement( 'br' ) );
					}

					var currentListItemName = currentListItem.$.nodeName.toLowerCase();
					if ( currentListItemName == 'div' || currentListItemName == 'p' ) {
						currentListItem.appendBogus();
					}
					retval.append( currentListItem );
					rootNode = null;
					currentIndex++;
				} else {
					return null;
				}

				block = null;

				if ( listArray.length <= currentIndex || Math.max( listArray[ currentIndex ].indent, 0 ) < indentLevel )
					break;
			}

			if ( database ) {
				var currentNode = retval.getFirst();

				while ( currentNode ) {
					if ( currentNode.type == CKEDITOR.NODE_ELEMENT ) {
						// Clear marker attributes for the new list tree made of cloned nodes, if any.
						CKEDITOR.dom.element.clearMarkers( database, currentNode );

						// Clear redundant direction attribute specified on list items.
						if ( currentNode.getName() in CKEDITOR.dtd.$listItem )
							cleanUpDirection( currentNode );
					}

					currentNode = currentNode.getNextSourceNode();
				}
			}

			return { listNode: retval, nextIndex: currentIndex };
		}
	};

	function changeListType( editor, groupObj, database, listsCreated ) {
		// This case is easy...
		// 1. Convert the whole list into a one-dimensional array.
		// 2. Change the list type by modifying the array.
		// 3. Recreate the whole list by converting the array to a list.
		// 4. Replace the original list with the recreated list.
		var listArray = CKEDITOR.plugins.list.listToArray( groupObj.root, database ),
			selectedListItems = [];

		for ( var i = 0; i < groupObj.contents.length; i++ ) {
			var itemNode = groupObj.contents[ i ];
			itemNode = itemNode.getAscendant( 'li', true );
			if ( !itemNode || itemNode.getCustomData( 'list_item_processed' ) )
				continue;
			selectedListItems.push( itemNode );
			CKEDITOR.dom.element.setMarker( database, itemNode, 'list_item_processed', true );
		}

		var root = groupObj.root,
			doc = root.getDocument(),
			listNode, newListNode;

		for ( i = 0; i < selectedListItems.length; i++ ) {
			var listIndex = selectedListItems[ i ].getCustomData( 'listarray_index' );
			listNode = listArray[ listIndex ].parent;

			// Switch to new list node for this particular item.
			if ( !listNode.is( this.type ) ) {
				newListNode = doc.createElement( this.type );
				// Copy all attributes, except from 'start' and 'type'.
				listNode.copyAttributes( newListNode, { start: 1, type: 1 } );
				// The list-style-type property should be ignored.
				newListNode.removeStyle( 'list-style-type' );
				listArray[ listIndex ].parent = newListNode;
			}
		}

		var newList = CKEDITOR.plugins.list.arrayToList( listArray, database, null, editor.config.enterMode );
		var child,
			length = newList.listNode.getChildCount();
		for ( i = 0; i < length && ( child = newList.listNode.getChild( i ) ); i++ ) {
			if ( child.getName() == this.type )
				listsCreated.push( child );
		}
		newList.listNode.replace( groupObj.root );

		editor.fire( 'contentDomInvalidated' );
	}

	function createList( editor, groupObj, listsCreated ) {
		var contents = groupObj.contents,
			doc = groupObj.root.getDocument(),
			listContents = [];

		// It is possible to have the contents returned by DomRangeIterator to be the same as the root.
		// e.g. when we're running into table cells.
		// In such a case, enclose the childNodes of contents[0] into a <div>.
		if ( contents.length == 1 && contents[ 0 ].equals( groupObj.root ) ) {
			var divBlock = doc.createElement( 'div' );
			contents[ 0 ].moveChildren && contents[ 0 ].moveChildren( divBlock );
			contents[ 0 ].append( divBlock );
			contents[ 0 ] = divBlock;
		}

		// Calculate the common parent node of all content blocks.
		var commonParent = groupObj.contents[ 0 ].getParent();
		for ( var i = 0; i < contents.length; i++ )
			commonParent = commonParent.getCommonAncestor( contents[ i ].getParent() );

		var useComputedState = editor.config.useComputedState,
			listDir, explicitDirection;

		// We want to insert things that are in the same tree level only, so calculate the contents again
		// by expanding the selected blocks to the same tree level.
		for ( i = 0; i < contents.length; i++ ) {
			var contentNode = contents[ i ],
				parentNode;
			while ( ( parentNode = contentNode.getParent() ) ) {
				if ( parentNode.equals( commonParent ) ) {
					listContents.push( contentNode );

					// Determine the lists's direction.
					if ( !explicitDirection && contentNode.getDirection() )
						explicitDirection = 1;

					var itemDir = contentNode.getDirection( useComputedState );

					if ( listDir !== null ) {
						// If at least one LI have a different direction than current listDir, we can't have listDir.
						if ( listDir && listDir != itemDir )
							listDir = null;
						else
							listDir = itemDir;
					}

					break;
				}
				contentNode = parentNode;
			}
		}

		if ( listContents.length < 1 )
			return;

		// Insert the list to the DOM tree.
		var insertAnchor = listContents[ listContents.length - 1 ].getNext(),
			listNode = doc.createElement( this.type );

		listsCreated.push( listNode );

		var contentBlock, listItem;

		while ( listContents.length ) {
			contentBlock = listContents.shift();
			listItem = doc.createElement( 'li' );

			// If current block should be preserved, append it to list item instead of
			// transforming it to <li> element.
			if ( shouldPreserveBlock( contentBlock ) )
				contentBlock.appendTo( listItem );
			else {
				contentBlock.copyAttributes( listItem );
				// Remove direction attribute after it was merged into list root. (https://dev.ckeditor.com/ticket/7657)
				if ( listDir && contentBlock.getDirection() ) {
					listItem.removeStyle( 'direction' );
					listItem.removeAttribute( 'dir' );
				}
				contentBlock.moveChildren( listItem );
				contentBlock.remove();
			}

			listItem.appendTo( listNode );
		}

		// Apply list root dir only if it has been explicitly declared.
		if ( listDir && explicitDirection )
			listNode.setAttribute( 'dir', listDir );

		if ( insertAnchor )
			listNode.insertBefore( insertAnchor );
		else
			listNode.appendTo( commonParent );
	}

	function removeList( editor, groupObj, database ) {
		// This is very much like the change list type operation.
		// Except that we're changing the selected items' indent to -1 in the list array.
		var listArray = CKEDITOR.plugins.list.listToArray( groupObj.root, database ),
			selectedListItems = [];

		for ( var i = 0; i < groupObj.contents.length; i++ ) {
			var itemNode = groupObj.contents[ i ];
			itemNode = itemNode.getAscendant( 'li', true );
			if ( !itemNode || itemNode.getCustomData( 'list_item_processed' ) )
				continue;
			selectedListItems.push( itemNode );
			CKEDITOR.dom.element.setMarker( database, itemNode, 'list_item_processed', true );
		}

		var lastListIndex = null;
		for ( i = 0; i < selectedListItems.length; i++ ) {
			var listIndex = selectedListItems[ i ].getCustomData( 'listarray_index' );
			listArray[ listIndex ].indent = -1;
			lastListIndex = listIndex;
		}

		// After cutting parts of the list out with indent=-1, we still have to maintain the array list
		// model's nextItem.indent <= currentItem.indent + 1 invariant. Otherwise the array model of the
		// list cannot be converted back to a real DOM list.
		for ( i = lastListIndex + 1; i < listArray.length; i++ ) {
			if ( listArray[ i ].indent > listArray[ i - 1 ].indent + 1 ) {
				var indentOffset = listArray[ i - 1 ].indent + 1 - listArray[ i ].indent;
				var oldIndent = listArray[ i ].indent;
				while ( listArray[ i ] && listArray[ i ].indent >= oldIndent ) {
					listArray[ i ].indent += indentOffset;
					i++;
				}
				i--;
			}
		}

		var newList = CKEDITOR.plugins.list.arrayToList( listArray, database, null, editor.config.enterMode, groupObj.root.getAttribute( 'dir' ) );

		// Compensate <br> before/after the list node if the surrounds are non-blocks.(https://dev.ckeditor.com/ticket/3836)
		var docFragment = newList.listNode,
			boundaryNode, siblingNode;

		function compensateBrs( isStart ) {
			if (
				( boundaryNode = docFragment[ isStart ? 'getFirst' : 'getLast' ]() ) &&
				!( boundaryNode.is && boundaryNode.isBlockBoundary() ) &&
				( siblingNode = groupObj.root[ isStart ? 'getPrevious' : 'getNext' ]( CKEDITOR.dom.walker.invisible( true ) ) ) &&
				!( siblingNode.is && siblingNode.isBlockBoundary( { br: 1 } ) )
			) {
				editor.document.createElement( 'br' )[ isStart ? 'insertBefore' : 'insertAfter' ]( boundaryNode );
			}
		}
		compensateBrs( true );
		compensateBrs();

		docFragment.replace( groupObj.root );

		editor.fire( 'contentDomInvalidated' );
	}

	var headerTagRegex = /^h[1-6]$/;

	// Checks wheather this block should be element preserved (not transformed to <li>) when creating list.
	function shouldPreserveBlock( block ) {
		return (
			// https://dev.ckeditor.com/ticket/5335
			block.is( 'pre' ) ||
			// https://dev.ckeditor.com/ticket/5271 - this is a header.
			headerTagRegex.test( block.getName() ) ||
			// 11083 - this is a non-editable element.
			block.getAttribute( 'contenteditable' ) == 'false'
		);
	}

	function listCommand( name, type ) {
		this.name = name;
		this.type = type;
		this.context = type;
		this.allowedContent = type + ' li';
		this.requiredContent = type;
	}

	var elementType = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_ELEMENT );

	// Merge child nodes with direction preserved. (https://dev.ckeditor.com/ticket/7448)
	function mergeChildren( from, into, refNode, forward ) {
		var child, itemDir;
		while ( ( child = from[ forward ? 'getLast' : 'getFirst' ]( elementType ) ) ) {
			if ( ( itemDir = child.getDirection( 1 ) ) !== into.getDirection( 1 ) )
				child.setAttribute( 'dir', itemDir );

			child.remove();

			refNode ? child[ forward ? 'insertBefore' : 'insertAfter' ]( refNode ) : into.append( child, forward );
			refNode = child;
		}
	}

	listCommand.prototype = {
		exec: function( editor ) {
			// Run state check first of all.
			this.refresh( editor, editor.elementPath() );

			var config = editor.config,
				selection = editor.getSelection(),
				ranges = selection && selection.getRanges();

			// Midas lists rule #1 says we can create a list even in an empty document.
			// But DOM iterator wouldn't run if the document is really empty.
			// So create a paragraph if the document is empty and we're going to create a list.
			if ( this.state == CKEDITOR.TRISTATE_OFF ) {
				var editable = editor.editable();
				if ( !editable.getFirst( nonEmpty ) ) {
					config.enterMode == CKEDITOR.ENTER_BR ? editable.appendBogus() : ranges[ 0 ].fixBlock( 1, config.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' );

					selection.selectRanges( ranges );
				}
				// Maybe a single range there enclosing the whole list,
				// turn on the list state manually(https://dev.ckeditor.com/ticket/4129).
				else {
					var range = ranges.length == 1 && ranges[ 0 ],
						enclosedNode = range && range.getEnclosedNode();
					if ( enclosedNode && enclosedNode.is && this.type == enclosedNode.getName() )
						this.setState( CKEDITOR.TRISTATE_ON );
				}
			}

			var bookmarks = selection.createBookmarks( true );

			// Group the blocks up because there are many cases where multiple lists have to be created,
			// or multiple lists have to be cancelled.
			var listGroups = [],
				database = {},
				rangeIterator = ranges.createIterator(),
				index = 0;

			while ( ( range = rangeIterator.getNextRange() ) && ++index ) {
				var boundaryNodes = range.getBoundaryNodes(),
					startNode = boundaryNodes.startNode,
					endNode = boundaryNodes.endNode;

				if ( startNode.type == CKEDITOR.NODE_ELEMENT && startNode.getName() == 'td' )
					range.setStartAt( boundaryNodes.startNode, CKEDITOR.POSITION_AFTER_START );

				if ( endNode.type == CKEDITOR.NODE_ELEMENT && endNode.getName() == 'td' )
					range.setEndAt( boundaryNodes.endNode, CKEDITOR.POSITION_BEFORE_END );

				var iterator = range.createIterator(),
					block;

				iterator.forceBrBreak = ( this.state == CKEDITOR.TRISTATE_OFF );

				while ( ( block = iterator.getNextParagraph() ) ) {
					// Avoid duplicate blocks get processed across ranges.
					// Avoid processing comments, we don't want to touch it.
					if ( block.getCustomData( 'list_block' ) || hasCommentsChildOnly( block ) )
						continue;
					else
						CKEDITOR.dom.element.setMarker( database, block, 'list_block', 1 );

					var path = editor.elementPath( block ),
						pathElements = path.elements,
						pathElementsCount = pathElements.length,
						processedFlag = 0,
						blockLimit = path.blockLimit,
						element;

					// First, try to group by a list ancestor.
					for ( var i = pathElementsCount - 1; i >= 0 && ( element = pathElements[ i ] ); i-- ) {
						// Don't leak outside block limit (https://dev.ckeditor.com/ticket/3940).
						if ( listNodeNames[ element.getName() ] && blockLimit.contains( element ) ) {
							// If we've encountered a list inside a block limit
							// The last group object of the block limit element should
							// no longer be valid. Since paragraphs after the list
							// should belong to a different group of paragraphs before
							// the list. (Bug https://dev.ckeditor.com/ticket/1309)
							blockLimit.removeCustomData( 'list_group_object_' + index );

							var groupObj = element.getCustomData( 'list_group_object' );
							if ( groupObj )
								groupObj.contents.push( block );
							else {
								groupObj = { root: element, contents: [ block ] };
								listGroups.push( groupObj );
								CKEDITOR.dom.element.setMarker( database, element, 'list_group_object', groupObj );
							}
							processedFlag = 1;
							break;
						}
					}

					if ( processedFlag )
						continue;

					// No list ancestor? Group by block limit, but don't mix contents from different ranges.
					var root = blockLimit;
					if ( root.getCustomData( 'list_group_object_' + index ) )
						root.getCustomData( 'list_group_object_' + index ).contents.push( block );
					else {
						groupObj = { root: root, contents: [ block ] };
						CKEDITOR.dom.element.setMarker( database, root, 'list_group_object_' + index, groupObj );
						listGroups.push( groupObj );
					}
				}
			}

			// Now we have two kinds of list groups, groups rooted at a list, and groups rooted at a block limit element.
			// We either have to build lists or remove lists, for removing a list does not makes sense when we are looking
			// at the group that's not rooted at lists. So we have three cases to handle.
			var listsCreated = [];
			while ( listGroups.length > 0 ) {
				groupObj = listGroups.shift();
				if ( this.state == CKEDITOR.TRISTATE_OFF ) {
					if ( isEmptyList( groupObj ) ) {
						continue;
					} else if ( listNodeNames[ groupObj.root.getName() ] ) {
						changeListType.call( this, editor, groupObj, database, listsCreated );
					} else {
						createList.call( this, editor, groupObj, listsCreated );
					}
				} else if ( this.state == CKEDITOR.TRISTATE_ON && listNodeNames[ groupObj.root.getName() ] && !isEmptyList( groupObj ) ) {
					removeList.call( this, editor, groupObj, database );
				}
			}

			// For all new lists created, merge into adjacent, same type lists.
			for ( i = 0; i < listsCreated.length; i++ )
				mergeListSiblings( listsCreated[ i ] );

			// Clean up, restore selection and update toolbar button states.
			CKEDITOR.dom.element.clearAllMarkers( database );
			selection.selectBookmarks( bookmarks );
			editor.focus();

			function isEmptyList( groupObj ) {
				// If list is without any li item, then ignore such element from transformation, because it throws errors in console (#2411, #2438).
				return listNodeNames[ groupObj.root.getName() ] && !getChildCount( groupObj.root, [ CKEDITOR.NODE_COMMENT ] );
			}

			function getChildCount( element, excludeTypes ) {
				return CKEDITOR.tools.array.filter( element.getChildren().toArray(), function( node ) {
					return CKEDITOR.tools.array.indexOf( excludeTypes, node.type ) === -1;
				} ).length;
			}

			function hasCommentsChildOnly( element ) {
				var ret = true;
				if ( element.getChildCount() === 0 ) {
					return false;
				}
				element.forEach( function( node ) {
					if ( node.type !== CKEDITOR.NODE_COMMENT ) {
						ret = false;
						return false;
					}
				}, null, true );
				return ret;
			}
		},

		refresh: function( editor, path ) {
			var list = path.contains( listNodeNames, 1 ),
				limit = path.blockLimit || path.root;

			// 1. Only a single type of list activate.
			// 2. Do not show list outside of block limit.
			if ( list && limit.contains( list ) )
				this.setState( list.is( this.type ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
			else
				this.setState( CKEDITOR.TRISTATE_OFF );
		}
	};

	// Merge list adjacent, of same type lists.
	function mergeListSiblings( listNode ) {

		function mergeSibling( rtl ) {
			var sibling = listNode[ rtl ? 'getPrevious' : 'getNext' ]( nonEmpty );
			if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT && sibling.is( listNode.getName() ) ) {
				// Move children order by merge direction.(https://dev.ckeditor.com/ticket/3820)
				mergeChildren( listNode, sibling, null, !rtl );

				listNode.remove();
				listNode = sibling;
			}
		}

		mergeSibling();
		mergeSibling( 1 );
	}

	// Check if node is block element that recieves text.
	function isTextBlock( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && ( node.getName() in CKEDITOR.dtd.$block || node.getName() in CKEDITOR.dtd.$listItem ) && CKEDITOR.dtd[ node.getName() ][ '#' ];
	}

	// Join visually two block lines.
	function joinNextLineToCursor( editor, cursor, nextCursor ) {
		editor.fire( 'saveSnapshot' );

		// Merge with previous block's content.
		nextCursor.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );
		var frag = nextCursor.extractContents();

		cursor.trim( false, true );
		var bm = cursor.createBookmark();

		// Kill original bogus;
		var currentPath = new CKEDITOR.dom.elementPath( cursor.startContainer ),
				pathBlock = currentPath.block,
				currentBlock = currentPath.lastElement.getAscendant( 'li', 1 ) || pathBlock,
				nextPath = new CKEDITOR.dom.elementPath( nextCursor.startContainer ),
				nextLi = nextPath.contains( CKEDITOR.dtd.$listItem ),
				nextList = nextPath.contains( CKEDITOR.dtd.$list ),
				last;

		// Remove bogus node the current block/pseudo block.
		if ( pathBlock ) {
			var bogus = pathBlock.getBogus();
			bogus && bogus.remove();
		}
		else if ( nextList ) {
			last = nextList.getPrevious( nonEmpty );
			if ( last && blockBogus( last ) )
				last.remove();
		}

		// Kill the tail br in extracted.
		last = frag.getLast();
		if ( last && last.type == CKEDITOR.NODE_ELEMENT && last.is( 'br' ) )
			last.remove();

		// Insert fragment at the range position.
		var nextNode = cursor.startContainer.getChild( cursor.startOffset );
		if ( nextNode )
			frag.insertBefore( nextNode );
		else
			cursor.startContainer.append( frag );

		// Move the sub list nested in the next list item.
		if ( nextLi ) {
			var sublist = getSubList( nextLi );
			if ( sublist ) {
				// If next line is in the sub list of the current list item.
				if ( currentBlock.contains( nextLi ) ) {
					mergeChildren( sublist, nextLi.getParent(), nextLi );
					sublist.remove();
				}
				// Migrate the sub list to current list item.
				else {
					currentBlock.append( sublist );
				}
			}
		}

		var nextBlock, parent;
		// Remove any remaining zombies path blocks at the end after line merged.
		while ( nextCursor.checkStartOfBlock() && nextCursor.checkEndOfBlock() ) {
			nextPath = nextCursor.startPath();
			nextBlock = nextPath.block;

			// Abort when nothing to be removed (https://dev.ckeditor.com/ticket/10890).
			if ( !nextBlock )
				break;

			// Check if also to remove empty list.
			if ( nextBlock.is( 'li' ) ) {
				parent = nextBlock.getParent();
				if ( nextBlock.equals( parent.getLast( nonEmpty ) ) && nextBlock.equals( parent.getFirst( nonEmpty ) ) )
					nextBlock = parent;
			}

			nextCursor.moveToPosition( nextBlock, CKEDITOR.POSITION_BEFORE_START );
			nextBlock.remove();
		}

		// Check if need to further merge with the list resides after the merged block. (https://dev.ckeditor.com/ticket/9080)
		var walkerRng = nextCursor.clone(), editable = editor.editable();
		walkerRng.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );
		var walker = new CKEDITOR.dom.walker( walkerRng );
		walker.evaluator = function( node ) {
			return nonEmpty( node ) && !blockBogus( node );
		};
		var next = walker.next();
		if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.getName() in CKEDITOR.dtd.$list )
			mergeListSiblings( next );

		cursor.moveToBookmark( bm );

		// Make fresh selection.
		cursor.select();

		editor.fire( 'saveSnapshot' );
	}

	function getSubList( li ) {
		var last = li.getLast( nonEmpty );
		return last && last.type == CKEDITOR.NODE_ELEMENT && last.getName() in listNodeNames ? last : null;
	}

	CKEDITOR.plugins.add( 'list', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'bulletedlist,bulletedlist-rtl,numberedlist,numberedlist-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'indentlist',
		init: function( editor ) {
			if ( editor.blockless )
				return;

			// Register commands.
			editor.addCommand( 'numberedlist', new listCommand( 'numberedlist', 'ol' ) );
			editor.addCommand( 'bulletedlist', new listCommand( 'bulletedlist', 'ul' ) );

			// Register the toolbar button.
			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'NumberedList', {
					isToggle: true,
					label: editor.lang.list.numberedlist,
					command: 'numberedlist',
					directional: true,
					toolbar: 'list,10'
				} );
				editor.ui.addButton( 'BulletedList', {
					isToggle: true,
					label: editor.lang.list.bulletedlist,
					command: 'bulletedlist',
					directional: true,
					toolbar: 'list,20'
				} );
			}

			// Handled backspace/del key to join list items. (https://dev.ckeditor.com/ticket/8248,https://dev.ckeditor.com/ticket/9080)
			editor.on( 'key', function( evt ) {
				// Use getKey directly in order to ignore modifiers.
				// Justification: https://dev.ckeditor.com/ticket/11861#comment:13
				var key = evt.data.domEvent.getKey(), li;

				// DEl/BACKSPACE
				if ( editor.mode == 'wysiwyg' && key in { 8: 1, 46: 1 } ) {
					var sel = editor.getSelection(),
						range = sel.getRanges()[ 0 ],
						path = range && range.startPath();

					if ( !range || !range.collapsed )
						return;

					var isBackspace = key == 8;
					var editable = editor.editable();
					var walker = new CKEDITOR.dom.walker( range.clone() );
					walker.evaluator = function( node ) {
						return nonEmpty( node ) && !blockBogus( node );
					};
					// Backspace/Del behavior at the start/end of table is handled in core.
					walker.guard = function( node, isOut ) {
						return !( isOut && node.type == CKEDITOR.NODE_ELEMENT && node.is( 'table' ) );
					};

					var cursor = range.clone();

					if ( isBackspace ) {
						var previous, joinWith;

						// Join a sub list's first line, with the previous visual line in parent.
						if (
							( previous = path.contains( listNodeNames ) ) &&
							range.checkBoundaryOfElement( previous, CKEDITOR.START ) &&
							( previous = previous.getParent() ) && previous.is( 'li' ) &&
							( previous = getSubList( previous ) )
						) {
							joinWith = previous;
							previous = previous.getPrevious( nonEmpty );
							// Place cursor before the nested list.
							cursor.moveToPosition(
								previous && blockBogus( previous ) ? previous : joinWith,
								CKEDITOR.POSITION_BEFORE_START );
						}
						// Join any line following a list, with the last visual line of the list.
						else {
							walker.range.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );
							walker.range.setEnd( range.startContainer, range.startOffset );

							previous = walker.previous();

							if (
								previous && previous.type == CKEDITOR.NODE_ELEMENT &&
								( previous.getName() in listNodeNames ||
								previous.is( 'li' ) )
							) {
								if ( !previous.is( 'li' ) ) {
									walker.range.selectNodeContents( previous );
									walker.reset();
									walker.evaluator = isTextBlock;
									previous = walker.previous();
								}

								joinWith = previous;
								// Place cursor at the end of previous block.
								cursor.moveToElementEditEnd( joinWith );

								// And then just before end of closest block element (https://dev.ckeditor.com/ticket/12729).
								cursor.moveToPosition( cursor.endPath().block, CKEDITOR.POSITION_BEFORE_END );
							}
						}

						if ( joinWith ) {
							joinNextLineToCursor( editor, cursor, range );
							evt.cancel();
						}
						else {
							var list = path.contains( listNodeNames );
							// Backspace pressed at the start of list outdents the first list item. (https://dev.ckeditor.com/ticket/9129)
							if ( list && range.checkBoundaryOfElement( list, CKEDITOR.START ) ) {
								li = list.getFirst( nonEmpty );

								if ( range.checkBoundaryOfElement( li, CKEDITOR.START ) ) {
									previous = list.getPrevious( nonEmpty );

									// Only if the list item contains a sub list, do nothing but
									// simply move cursor backward one character.
									if ( getSubList( li ) ) {
										if ( previous ) {
											range.moveToElementEditEnd( previous );
											range.select();
										}

										evt.cancel();
									}
									else {
										editor.execCommand( 'outdent' );
										evt.cancel();
									}
								}
							}
						}

					} else {
						var next, nextLine;

						li = path.contains( 'li' );

						if ( li ) {
							walker.range.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );

							var last = li.getLast( nonEmpty );
							var block = last && isTextBlock( last ) ? last : li;

							// Indicate cursor at the visual end of an list item.
							var isAtEnd = 0;

							next = walker.next();

							// When list item contains a sub list.
							if (
								next && next.type == CKEDITOR.NODE_ELEMENT &&
								next.getName() in listNodeNames &&
								next.equals( last )
							) {
								isAtEnd = 1;

								// Move to the first item in sub list.
								next = walker.next();
							}
							// Right at the end of list item.
							else if ( range.checkBoundaryOfElement( block, CKEDITOR.END ) ) {
								isAtEnd = 2;
							}

							if ( isAtEnd && next ) {
								// Put cursor range there.
								nextLine = range.clone();
								nextLine.moveToElementEditStart( next );

								// https://dev.ckeditor.com/ticket/13409
								// For the following case and similar
								//
								// <ul>
								// 	<li>
								// 		<p><a href="#one"><em>x^</em></a></p>
								// 		<ul>
								// 			<li><span>y</span></li>
								// 		</ul>
								// 	</li>
								// </ul>
								if ( isAtEnd == 1 ) {
									// Move the cursor to <em> if attached to "x" text node.
									cursor.optimize();

									// Abort if the range is attached directly in <li>, like
									//
									// <ul>
									// 	<li>
									// 		x^
									// 		<ul>
									// 			<li><span>y</span></li>
									// 		</ul>
									// 	</li>
									// </ul>
									if ( !cursor.startContainer.equals( li ) ) {
										var node = cursor.startContainer,
											farthestInlineAscendant;

										// Find <a>, which is farthest from <em> but still inline element.
										while ( node.is( CKEDITOR.dtd.$inline ) ) {
											farthestInlineAscendant = node;
											node = node.getParent();
										}

										// Move the range so it does not contain inline elements.
										// It prevents <span> from being included in <em>.
										//
										// <ul>
										// 	<li>
										// 		<p><a href="#one"><em>x</em></a>^</p>
										// 		<ul>
										// 			<li><span>y</span></li>
										// 		</ul>
										// 	</li>
										// </ul>
										//
										// so instead of
										//
										// <ul>
										// 	<li>
										// 		<p><a href="#one"><em>x^<span>y</span></em></a></p>
										// 	</li>
										// </ul>
										//
										// pressing DELETE produces
										//
										// <ul>
										// 	<li>
										// 		<p><a href="#one"><em>x</em></a>^<span>y</span></p>
										// 	</li>
										// </ul>
										if ( farthestInlineAscendant ) {
											cursor.moveToPosition( farthestInlineAscendant, CKEDITOR.POSITION_AFTER_END );
										}
									}
								}

								// Moving `cursor` and `next line` only when at the end literally (https://dev.ckeditor.com/ticket/12729).
								if ( isAtEnd == 2 ) {
									cursor.moveToPosition( cursor.endPath().block, CKEDITOR.POSITION_BEFORE_END );

									// Next line might be text node not wrapped in block element.
									if ( nextLine.endPath().block ) {
										nextLine.moveToPosition( nextLine.endPath().block, CKEDITOR.POSITION_AFTER_START );
									}
								}

								joinNextLineToCursor( editor, cursor, nextLine );
								evt.cancel();
							}
						} else {
							// Handle Del key pressed before the list.
							walker.range.setEndAt( editable, CKEDITOR.POSITION_BEFORE_END );
							next = walker.next();

							if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.is( listNodeNames ) ) {
								// The start <li>
								next = next.getFirst( nonEmpty );

								// Simply remove the current empty block, move cursor to the
								// subsequent list.
								if ( path.block && range.checkStartOfBlock() && range.checkEndOfBlock() ) {
									path.block.remove();
									range.moveToElementEditStart( next );
									range.select();
									evt.cancel();
								}
								// Preventing the default (merge behavior), but simply move
								// the cursor one character forward if subsequent list item
								// contains sub list.
								else if ( getSubList( next )  ) {
									range.moveToElementEditStart( next );
									range.select();
									evt.cancel();
								}
								// Merge the first list item with the current line.
								else {
									nextLine = range.clone();
									nextLine.moveToElementEditStart( next );
									joinNextLineToCursor( editor, cursor, nextLine );
									evt.cancel();
								}
							}
						}

					}

					// The backspace/del could potentially put cursor at a bad position,
					// being it handled or not, check immediately the selection to have it fixed.
					setTimeout( function() {
						editor.selectionChange( 1 );
					} );
				}
			} );
		}
	} );
} )();
