/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	CKEDITOR.plugins.add( 'enterkey', {
		init: function( editor ) {
			editor.addCommand( 'enter', {
				modes: { wysiwyg: 1 },
				editorFocus: false,
				exec: function( editor ) {
					enter( editor );
				}
			} );

			editor.addCommand( 'shiftEnter', {
				modes: { wysiwyg: 1 },
				editorFocus: false,
				exec: function( editor ) {
					shiftEnter( editor );
				}
			} );

			editor.setKeystroke( [
				[ 13, 'enter' ],
				[ CKEDITOR.SHIFT + 13, 'shiftEnter' ]
			] );
		}
	} );

	var whitespaces = CKEDITOR.dom.walker.whitespaces(),
		bookmark = CKEDITOR.dom.walker.bookmark(),
		plugin,
		enterBr,
		enterBlock,
		headerTagRegex;

	CKEDITOR.plugins.enterkey = {
		enterBlock: function( editor, mode, range, forceMode ) {
			// Get the range for the current selection.
			range = range || getRange( editor );

			// We may not have valid ranges to work on, like when inside a
			// contenteditable=false element.
			if ( !range )
				return;

			// When range is in nested editable, we have to replace range with this one,
			// which have root property set to closest editable, to make auto paragraphing work. (https://dev.ckeditor.com/ticket/12162)
			range = replaceRangeWithClosestEditableRoot( range );

			var doc = range.document;

			var atBlockStart = range.checkStartOfBlock(),
				atBlockEnd = range.checkEndOfBlock(),
				path = editor.elementPath( range.startContainer ),
				block = path.block,

				// Determine the block element to be used.
				blockTag = ( mode == CKEDITOR.ENTER_DIV ? 'div' : 'p' ),

				newBlock;

			if ( block && atBlockStart && atBlockEnd ) {
				var blockParent = block.getParent();

				// Block placeholder breaks list structure (#2205).
				if ( blockParent.is( 'li' ) && blockParent.getChildCount() > 1 ) {
					var placeholder = new CKEDITOR.dom.element( 'li' ),
						newRange = editor.createRange();

					placeholder.insertAfter( blockParent );

					block.remove();

					newRange.setStart( placeholder, 0 );
					editor.getSelection().selectRanges( [ newRange ] );

					return;
				}
				// Exit the list when we're inside an empty list item block. (https://dev.ckeditor.com/ticket/5376).
				else if ( block.is( 'li' ) || block.getParent().is( 'li' ) ) {
					// Make sure to point to the li when dealing with empty list item.
					if ( !block.is( 'li' ) ) {
						block = block.getParent();
						blockParent = block.getParent();
					}

					var blockGrandParent = blockParent.getParent(),

						firstChild = !block.hasPrevious(),
						lastChild = !block.hasNext(),

						selection = editor.getSelection(),
						bookmarks = selection.createBookmarks(),

						orgDir = block.getDirection( 1 ),
						className = block.getAttribute( 'class' ),
						style = block.getAttribute( 'style' ),
						dirLoose = blockGrandParent.getDirection( 1 ) != orgDir,

						enterMode = editor.enterMode,
						needsBlock = enterMode != CKEDITOR.ENTER_BR || dirLoose || style || className,

						child;

					if ( blockGrandParent.is( 'li' ) ) {

						// If block is the first or the last child of the parent
						// list, degrade it and move to the outer list:
						// before the parent list if block is first child and after
						// the parent list if block is the last child, respectively.
						//
						//  <ul>                         =>      <ul>
						//      <li>                     =>          <li>
						//          <ul>                 =>              <ul>
						//              <li>x</li>       =>                  <li>x</li>
						//              <li>^</li>       =>              </ul>
						//          </ul>                =>          </li>
						//      </li>                    =>          <li>^</li>
						//  </ul>                        =>      </ul>
						//
						//                              AND
						//
						//  <ul>                         =>      <ul>
						//      <li>                     =>          <li>^</li>
						//          <ul>                 =>          <li>
						//              <li>^</li>       =>              <ul>
						//              <li>x</li>       =>                  <li>x</li>
						//          </ul>                =>              </ul>
						//      </li>                    =>          </li>
						//  </ul>                        =>      </ul>

						if ( firstChild || lastChild ) {

							// If it's only child, we don't want to keep perent ul anymore.
							if ( firstChild && lastChild ) {
								blockParent.remove();
							}

							block[lastChild ? 'insertAfter' : 'insertBefore']( blockGrandParent );

							// If the empty block is neither first nor last child
							// then split the list and the block as an element
							// of outer list.
							//
							//                              =>      <ul>
							//                              =>          <li>
							//  <ul>                        =>              <ul>
							//      <li>                    =>                  <li>x</li>
							//          <ul>                =>              </ul>
							//              <li>x</li>      =>          </li>
							//              <li>^</li>      =>          <li>^</li>
							//              <li>y</li>      =>          <li>
							//          </ul>               =>              <ul>
							//      </li>                   =>                  <li>y</li>
							//  </ul>                       =>              </ul>
							//                              =>          </li>
							//                              =>      </ul>

						} else {
							block.breakParent( blockGrandParent );
						}
					}

					else if ( !needsBlock ) {
						block.appendBogus( true );

						// If block is the first or last child of the parent
						// list, move all block's children out of the list:
						// before the list if block is first child and after the list
						// if block is the last child, respectively.
						//
						//  <ul>                       =>      <ul>
						//      <li>x</li>             =>          <li>x</li>
						//      <li>^</li>             =>      </ul>
						//  </ul>                      =>      ^
						//
						//                            AND
						//
						//  <ul>                       =>      ^
						//      <li>^</li>             =>      <ul>
						//      <li>x</li>             =>          <li>x</li>
						//  </ul>                      =>      </ul>

						if ( firstChild || lastChild ) {
							while ( ( child = block[ firstChild ? 'getFirst' : 'getLast' ]() ) )
								child[ firstChild ? 'insertBefore' : 'insertAfter' ]( blockParent );
						}

						// If the empty block is neither first nor last child
						// then split the list and put all the block contents
						// between two lists.
						//
						//  <ul>                       =>      <ul>
						//      <li>x</li>             =>          <li>x</li>
						//      <li>^</li>             =>      </ul>
						//      <li>y</li>             =>      ^
						//  </ul>                      =>      <ul>
						//                             =>          <li>y</li>
						//                             =>      </ul>

						else {
							block.breakParent( blockParent );

							while ( ( child = block.getLast() ) )
								child.insertAfter( blockParent );
						}

						block.remove();
					} else {
						// Original path block is the list item, create new block for the list item content.
						if ( path.block.is( 'li' ) ) {
							// Use <div> block for ENTER_BR and ENTER_DIV.
							newBlock = doc.createElement( mode == CKEDITOR.ENTER_P ? 'p' : 'div' );

							if ( dirLoose )
								newBlock.setAttribute( 'dir', orgDir );

							style && newBlock.setAttribute( 'style', style );
							className && newBlock.setAttribute( 'class', className );

							// Move all the child nodes to the new block.
							block.moveChildren( newBlock );
						}
						// The original path block is not a list item, just copy the block to out side of the list.
						else {
							newBlock = path.block;
						}

						// If block is the first or last child of the parent
						// list, move it out of the list:
						// before the list if block is first child and after the list
						// if block is the last child, respectively.
						//
						//  <ul>                       =>      <ul>
						//      <li>x</li>             =>          <li>x</li>
						//      <li>^</li>             =>      </ul>
						//  </ul>                      =>      <p>^</p>
						//
						//                            AND
						//
						//  <ul>                       =>      <p>^</p>
						//      <li>^</li>             =>      <ul>
						//      <li>x</li>             =>          <li>x</li>
						//  </ul>                      =>      </ul>

						if ( firstChild || lastChild )
							newBlock[ firstChild ? 'insertBefore' : 'insertAfter' ]( blockParent );

						// If the empty block is neither first nor last child
						// then split the list and put the new block between
						// two lists.
						//
						//                             =>       <ul>
						//     <ul>                    =>           <li>x</li>
						//         <li>x</li>          =>       </ul>
						//         <li>^</li>          =>       <p>^</p>
						//         <li>y</li>          =>       <ul>
						//     </ul>                   =>           <li>y</li>
						//                             =>       </ul>

						else {
							block.breakParent( blockParent );
							newBlock.insertAfter( blockParent );
						}

						block.remove();
					}

					selection.selectBookmarks( bookmarks );

					return;
				}

				if ( block && block.getParent().is( 'blockquote' ) ) {
					block.breakParent( block.getParent() );

					// If we were at the start of <blockquote>, there will be an empty element before it now.
					if ( !block.getPrevious().getFirst( CKEDITOR.dom.walker.invisible( 1 ) ) )
						block.getPrevious().remove();

					// If we were at the end of <blockquote>, there will be an empty element after it now.
					if ( !block.getNext().getFirst( CKEDITOR.dom.walker.invisible( 1 ) ) )
						block.getNext().remove();

					range.moveToElementEditStart( block );
					range.select();
					return;
				}
			}
			// Don't split <pre> if we're in the middle of it, act as shift enter key.
			else if ( block && block.is( 'pre' ) ) {
				if ( !atBlockEnd ) {
					enterBr( editor, mode, range, forceMode );
					return;
				}
			}

			// Split the range.
			var splitInfo = range.splitBlock( blockTag );

			if ( !splitInfo )
				return;

			// Get the current blocks.
			var previousBlock = splitInfo.previousBlock,
				nextBlock = splitInfo.nextBlock;

			var isStartOfBlock = splitInfo.wasStartOfBlock,
				isEndOfBlock = splitInfo.wasEndOfBlock;

			var node;

			// If this is a block under a list item, split it as well. (https://dev.ckeditor.com/ticket/1647)
			if ( nextBlock ) {
				node = nextBlock.getParent();
				if ( node.is( 'li' ) ) {
					nextBlock.breakParent( node );
					nextBlock.move( nextBlock.getNext(), 1 );
				}
			} else if ( previousBlock && ( node = previousBlock.getParent() ) && node.is( 'li' ) ) {
				previousBlock.breakParent( node );
				node = previousBlock.getNext();
				range.moveToElementEditStart( node );
				previousBlock.move( previousBlock.getPrevious() );
			}
			// If we have both the previous and next blocks, it means that the
			// boundaries were on separated blocks, or none of them where on the
			// block limits (start/end).
			if ( !isStartOfBlock && !isEndOfBlock ) {
				// If the next block is an <li> with another list tree as the first
				// child, we'll need to append a filler (<br>/NBSP) or the list item
				// wouldn't be editable. (https://dev.ckeditor.com/ticket/1420)
				if ( nextBlock.is( 'li' ) ) {
					var walkerRange = range.clone();
					walkerRange.selectNodeContents( nextBlock );
					var walker = new CKEDITOR.dom.walker( walkerRange );
					walker.evaluator = function( node ) {
						return !( bookmark( node ) || whitespaces( node ) || node.type == CKEDITOR.NODE_ELEMENT && node.getName() in CKEDITOR.dtd.$inline && !( node.getName() in CKEDITOR.dtd.$empty ) );
					};

					node = walker.next();
					if ( node && node.type == CKEDITOR.NODE_ELEMENT && node.is( 'ul', 'ol' ) )
						( CKEDITOR.env.needsBrFiller ? doc.createElement( 'br' ) : doc.createText( '\xa0' ) ).insertBefore( node );
				}

				// Move the selection to the end block.
				if ( nextBlock )
					range.moveToElementEditStart( nextBlock );
			}
			// Handle differently when content of table cell was erased by pressing enter (#1816).
			// We don't want to add new block, because it was created with range.splitBlock().
			else if ( preventExtraLineInsideTable( mode ) ) {
				range.moveToElementEditStart( range.getTouchedStartNode() );
			} else {

				var newBlockDir;

				if ( previousBlock ) {
					// Do not enter this block if it's a header tag, or we are in
					// a Shift+Enter (https://dev.ckeditor.com/ticket/77). Create a new block element instead
					// (later in the code).
					if ( previousBlock.is( 'li' ) || !( headerTagRegex.test( previousBlock.getName() ) || previousBlock.is( 'pre' ) ) ) {
						// Otherwise, duplicate the previous block.
						newBlock = previousBlock.clone();
					}
				} else if ( nextBlock ) {
					newBlock = nextBlock.clone();
				}

				if ( !newBlock ) {
					// We have already created a new list item. (https://dev.ckeditor.com/ticket/6849)
					if ( node && node.is( 'li' ) )
						newBlock = node;
					else {
						newBlock = doc.createElement( blockTag );
						if ( previousBlock && ( newBlockDir = previousBlock.getDirection() ) )
							newBlock.setAttribute( 'dir', newBlockDir );
					}
				}
				// Force the enter block unless we're talking of a list item.
				else if ( forceMode && !newBlock.is( 'li' ) ) {
					newBlock.renameNode( blockTag );
				}

				// Recreate the inline elements tree, which was available
				// before hitting enter, so the same styles will be available in
				// the new block.
				var elementPath = splitInfo.elementPath;
				if ( elementPath ) {
					for ( var i = 0, len = elementPath.elements.length; i < len; i++ ) {
						var element = elementPath.elements[ i ];

						if ( element.equals( elementPath.block ) || element.equals( elementPath.blockLimit ) )
							break;

						if ( CKEDITOR.dtd.$removeEmpty[ element.getName() ] ) {
							element = element.clone();
							newBlock.moveChildren( element );
							newBlock.append( element );
						}
					}
				}

				newBlock.appendBogus();

				if ( !newBlock.getParent() )
					range.insertNode( newBlock );

				// list item start number should not be duplicated (https://dev.ckeditor.com/ticket/7330), but we need
				// to remove the attribute after it's onto the DOM tree because of old IEs (https://dev.ckeditor.com/ticket/7581).
				newBlock.is( 'li' ) && newBlock.removeAttribute( 'value' );

				// This is tricky, but to make the new block visible correctly
				// we must select it.
				// The previousBlock check has been included because it may be
				// empty if we have fixed a block-less space (like ENTER into an
				// empty table cell).
				if ( CKEDITOR.env.ie && isStartOfBlock && ( !isEndOfBlock || !previousBlock.getChildCount() ) ) {
					// Move the selection to the new block.
					range.moveToElementEditStart( isEndOfBlock ? previousBlock : newBlock );
					range.select();
				}

				// Move the selection to the new block.
				range.moveToElementEditStart( isStartOfBlock && !isEndOfBlock ? nextBlock : newBlock );
			}

			range.select();
			range.scrollIntoView();

			// ===== HELPERS =====
			function preventExtraLineInsideTable( mode ) {
				// #1816
				// We want to have behaviour after pressing enter like this:
				// 1. <td>^</td> -> <td><p> </p></td>
				// 2. <td>Foo^</td> -> <td><p>Foo</p><p> </p></td>
				// 3. <td>Foo^Bar</td> -> <td><p>Foo</p><p>Bar</p></td>
				// We need to separate 1. case to not add extra line. Like it happen for 2nd or 3rd option.

				var innerElement,
					bogus;

				if ( mode === CKEDITOR.ENTER_BR ) {
					return false;
				}

				if ( CKEDITOR.tools.indexOf( [ 'td', 'th' ], path.lastElement.getName() ) === -1 ) {
					return false;
				}
				if ( path.lastElement.getChildCount() !== 1 ) {
					return false;
				}

				innerElement = path.lastElement.getChild( 0 ).clone( true );
				bogus = innerElement.getBogus();
				if ( bogus ) {
					bogus.remove();
				}

				if ( innerElement.getText().length ) {
					return false;
				}

				return true;
			}
		},

		enterBr: function( editor, mode, range, forceMode ) {
			// Get the range for the current selection.
			range = range || getRange( editor );

			// We may not have valid ranges to work on, like when inside a
			// contenteditable=false element.
			if ( !range )
				return;

			var doc = range.document;

			var isEndOfBlock = range.checkEndOfBlock();

			var elementPath = new CKEDITOR.dom.elementPath( editor.getSelection().getStartElement() );

			var startBlock = elementPath.block,
				startBlockTag = startBlock && elementPath.block.getName();

			if ( !forceMode && startBlockTag == 'li' ) {
				enterBlock( editor, mode, range, forceMode );
				return;
			}

			// If we are at the end of a header block.
			if ( !forceMode && isEndOfBlock && headerTagRegex.test( startBlockTag ) ) {
				var newBlock, newBlockDir;

				if ( ( newBlockDir = startBlock.getDirection() ) ) {
					newBlock = doc.createElement( 'div' );
					newBlock.setAttribute( 'dir', newBlockDir );
					newBlock.insertAfter( startBlock );
					range.setStart( newBlock, 0 );
				} else {
					// Insert a <br> after the current paragraph.
					doc.createElement( 'br' ).insertAfter( startBlock );

					// A text node is required by Gecko only to make the cursor blink.
					if ( CKEDITOR.env.gecko )
						doc.createText( '' ).insertAfter( startBlock );

					// IE has different behaviors regarding position.
					range.setStartAt( startBlock.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START );
				}
			} else {
				var lineBreak;

				// IE<8 prefers text node as line-break inside of <pre> (https://dev.ckeditor.com/ticket/4711).
				if ( startBlockTag == 'pre' && CKEDITOR.env.ie && CKEDITOR.env.version < 8 )
					lineBreak = doc.createText( '\r' );
				else
					lineBreak = doc.createElement( 'br' );

				range.deleteContents();
				range.insertNode( lineBreak );

				// Old IEs have different behavior regarding position.
				if ( !CKEDITOR.env.needsBrFiller )
					range.setStartAt( lineBreak, CKEDITOR.POSITION_AFTER_END );
				else {
					// A text node is required by Gecko only to make the cursor blink.
					// We need some text inside of it, so the bogus <br> is properly
					// created.
					doc.createText( '\ufeff' ).insertAfter( lineBreak );

					// If we are at the end of a block, we must be sure the bogus node is available in that block.
					if ( isEndOfBlock ) {
						// In most situations we've got an elementPath.block (e.g. <p>), but in a
						// blockless editor or when autoP is false that needs to be a block limit.
						( startBlock || elementPath.blockLimit ).appendBogus();
					}

					// Now we can remove the text node contents, so the caret doesn't
					// stop on it.
					lineBreak.getNext().$.nodeValue = '';

					range.setStartAt( lineBreak.getNext(), CKEDITOR.POSITION_AFTER_START );

				}
			}

			// This collapse guarantees the cursor will be blinking.
			range.collapse( true );

			range.select();
			range.scrollIntoView();
		}
	};

	plugin = CKEDITOR.plugins.enterkey;
	enterBr = plugin.enterBr;
	enterBlock = plugin.enterBlock;
	headerTagRegex = /^h[1-6]$/;

	function shiftEnter( editor ) {
		// On SHIFT+ENTER:
		// 1. We want to enforce the mode to be respected, instead
		// of cloning the current block. (https://dev.ckeditor.com/ticket/77)
		return enter( editor, editor.activeShiftEnterMode, 1 );
	}

	function enter( editor, mode, forceMode ) {
		forceMode = editor.config.forceEnterMode || forceMode;

		// Only effective within document.
		if ( editor.mode != 'wysiwyg' )
			return;

		if ( !mode )
			mode = editor.activeEnterMode;

		// TODO this should be handled by setting editor.activeEnterMode on selection change.
		// Check path block specialities:
		// 1. Cannot be a un-splittable element, e.g. table caption;
		var path = editor.elementPath();

		if ( path && !path.isContextFor( 'p' ) ) {
			mode = CKEDITOR.ENTER_BR;
			forceMode = 1;
		}

		editor.fire( 'saveSnapshot' ); // Save undo step.

		if ( mode == CKEDITOR.ENTER_BR )
			enterBr( editor, mode, null, forceMode );
		else
			enterBlock( editor, mode, null, forceMode );

		editor.fire( 'saveSnapshot' );
	}

	function getRange( editor ) {
		// Get the selection ranges.
		var ranges = editor.getSelection().getRanges( true );

		// Delete the contents of all ranges except the first one.
		for ( var i = ranges.length - 1; i > 0; i-- ) {
			ranges[ i ].deleteContents();
		}

		// Return the first range.
		return ranges[ 0 ];
	}

	function replaceRangeWithClosestEditableRoot( range ) {
		var closestEditable = range.startContainer.getAscendant( function( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT && node.getAttribute( 'contenteditable' ) == 'true';
		}, true );

		if ( range.root.equals( closestEditable ) ) {
			return range;
		} else {
			var newRange = new CKEDITOR.dom.range( closestEditable );

			newRange.moveToRange( range );
			return newRange;
		}
	}
} )();
