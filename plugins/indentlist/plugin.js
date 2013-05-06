/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows list indentation.
 */

(function() {
	function isListItem( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.is( 'li' );
	}

	var isNotWhitespaces = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );

	CKEDITOR.plugins.add( 'indentlist', {
		requires: 'indent',
		init: function( editor ) {
			var indentListCommand = CKEDITOR.tools.createClass( {
				base: CKEDITOR.plugins.indent.indentSomeCommand,

				$: function( editor, name ) {
					this.base.apply( this, arguments );

					this.allowedContent = {
						'ol ul': {
							// Do not add elements, but only text-align style if element is validated by other rule.
							propertiesOnly: true,
							styles: !this.useIndentClasses ? 'margin-left,margin-right' : null,
							classes: this.useIndentClasses ? this.indentClasses : null
						}
					};

					var requiredParams = ( this.useIndentClasses ? '(' + this.indentClasses.join( ',' ) + ')' : '{margin-left}' );

					this.requiredContent = [
						'ul' + requiredParams,
						'ol' + requiredParams
					];
				},

				proto: {
					// Elements that, if in an elementpath, will be handled by this
					// command. They restrict the scope of the plugin.
					indentedContent: { ol: 1, ul: 1 },

					refresh: function( editor, path ) {
						// console.log( '	\\-> refreshing ', this.name );

						var list = this.getIndentScope( path );

						//	- List in the path
						//
						// 		\-> Then this command makes no longer sense.
						if ( !list )
							this.setState( CKEDITOR.TRISTATE_DISABLED );

						//	+ List in the path
						//
						// 		\->	So it can always be outdented - i.e. collapsed
						//		    into a paragraph.
						else if ( !this.isIndent )
							this.setState( CKEDITOR.TRISTATE_OFF );

						// 	+ List in the path
						//	+ Indenting
						//	+ IndentClasses
						//
						// 		\-> If reached the topmost level of indentation,
						// 		    disable the command.
						else if ( this.useIndentClasses && !this.checkIndentClassLeft( list ) )
							this.setState( CKEDITOR.TRISTATE_DISABLED );

						// 	+ List in the path
						//	+ Indenting
						//	- IndentClasses
						//
						// 		\-> So we can always indent list a little bit more.
						else
							this.setState( CKEDITOR.TRISTATE_OFF );
					},

					exec: function( editor ) {
						var that = this,
							database = this.database,
							indentedContent = this.indentedContent;

						function indentList( listNode ) {
							// Our starting and ending points of the range might be inside some blocks under a list item...
							// So before playing with the iterator, we need to expand the block to include the list items.
							var startContainer = range.startContainer,
								endContainer = range.endContainer;
							while ( startContainer && !startContainer.getParent().equals( listNode ) )
								startContainer = startContainer.getParent();
							while ( endContainer && !endContainer.getParent().equals( listNode ) )
								endContainer = endContainer.getParent();

							if ( !startContainer || !endContainer )
								return;

							// Now we can iterate over the individual items on the same tree depth.
							var block = startContainer,
								itemsToMove = [],
								stopFlag = false;

							while ( !stopFlag ) {
								if ( block.equals( endContainer ) )
									stopFlag = true;

								itemsToMove.push( block );
								block = block.getNext();
							}

							if ( itemsToMove.length < 1 )
								return;

							// Do indent or outdent operations on the array model of the list, not the
							// list's DOM tree itself. The array model demands that it knows as much as
							// possible about the surrounding lists, we need to feed it the further
							// ancestor node that is still a list.
							var listParents = listNode.getParents( true );
							for ( var i = 0; i < listParents.length; i++ ) {
								if ( listParents[ i ].getName && indentedContent[ listParents[ i ].getName() ] ) {
									listNode = listParents[ i ];
									break;
								}
							}

							var indentOffset = that.isIndent ? 1 : -1,
								startItem = itemsToMove[ 0 ],
								lastItem = itemsToMove[ itemsToMove.length - 1 ],

								// Convert the list DOM tree into a one dimensional array.
								listArray = CKEDITOR.plugins.list.listToArray( listNode, database ),

								// Apply indenting or outdenting on the array.
								baseIndent = listArray[ lastItem.getCustomData( 'listarray_index' ) ].indent;

							for ( i = startItem.getCustomData( 'listarray_index' ); i <= lastItem.getCustomData( 'listarray_index' ); i++ ) {
								listArray[ i ].indent += indentOffset;
								// Make sure the newly created sublist get a brand-new element of the same type. (#5372)
								if ( indentOffset > 0 ) {
									var listRoot = listArray[ i ].parent;
									listArray[ i ].parent = new CKEDITOR.dom.element( listRoot.getName(), listRoot.getDocument() );
								}
							}

							for ( i = lastItem.getCustomData( 'listarray_index' ) + 1; i < listArray.length && listArray[ i ].indent > baseIndent; i++ )
								listArray[ i ].indent += indentOffset;

							// Convert the array back to a DOM forest (yes we might have a few subtrees now).
							// And replace the old list with the new forest.
							var newList = CKEDITOR.plugins.list.arrayToList( listArray, database, null, editor.config.enterMode, listNode.getDirection() );

							// Avoid nested <li> after outdent even they're visually same,
							// recording them for later refactoring.(#3982)
							if ( !that.isIndent ) {
								var parentLiElement;
								if ( ( parentLiElement = listNode.getParent() ) && parentLiElement.is( 'li' ) ) {
									var children = newList.listNode.getChildren(),
										pendingLis = [],
										count = children.count(),
										child;

									for ( i = count - 1; i >= 0; i-- ) {
										if ( ( child = children.getItem( i ) ) && child.is && child.is( 'li' ) )
											pendingLis.push( child );
									}
								}
							}

							if ( newList )
								newList.listNode.replace( listNode );

							// Move the nested <li> to be appeared after the parent.
							if ( pendingLis && pendingLis.length ) {
								for ( i = 0; i < pendingLis.length; i++ ) {
									var li = pendingLis[ i ],
										followingList = li;

									// Nest preceding <ul>/<ol> inside current <li> if any.
									while ( ( followingList = followingList.getNext() ) && followingList.is && followingList.getName() in indentedContent ) {
										// IE requires a filler NBSP for nested list inside empty list item,
										// otherwise the list item will be inaccessiable. (#4476)
										if ( CKEDITOR.env.ie && !li.getFirst( function( node ) {
											return isNotWhitespaces( node ) && isNotBookmark( node );
										}))
											li.append( range.document.createText( '\u00a0' ) );

										li.append( followingList );
									}

									li.insertAfter( parentLiElement );
								}
							}
						}

						var selection = editor.getSelection(),
							ranges = selection && selection.getRanges( 1 ),
							iterator = ranges.createIterator(),
							range;

						while ( ( range = iterator.getNextRange() ) ) {
							var rangeRoot = range.getCommonAncestor(),
								nearestListBlock = rangeRoot;

							while ( nearestListBlock && !( nearestListBlock.type == CKEDITOR.NODE_ELEMENT && indentedContent[ nearestListBlock.getName() ] ) )
								nearestListBlock = nearestListBlock.getParent();

							// Avoid having selection enclose the entire list. (#6138)
							// [<ul><li>...</li></ul>] =><ul><li>[...]</li></ul>
							if ( !nearestListBlock ) {
								var selectedNode = range.getEnclosedNode();
								if ( selectedNode && selectedNode.type == CKEDITOR.NODE_ELEMENT && selectedNode.getName() in indentedContent ) {
									range.setStartAt( selectedNode, CKEDITOR.POSITION_AFTER_START );
									range.setEndAt( selectedNode, CKEDITOR.POSITION_BEFORE_END );
									nearestListBlock = selectedNode;
								}
							}

							// Avoid selection anchors under list root.
							// <ul>[<li>...</li>]</ul> =>	<ul><li>[...]</li></ul>
							if ( nearestListBlock && range.startContainer.type == CKEDITOR.NODE_ELEMENT && range.startContainer.getName() in indentedContent ) {
								var walker = new CKEDITOR.dom.walker( range );
								walker.evaluator = isListItem;
								range.startContainer = walker.next();
							}

							if ( nearestListBlock && range.endContainer.type == CKEDITOR.NODE_ELEMENT && range.endContainer.getName() in indentedContent ) {
								walker = new CKEDITOR.dom.walker( range );
								walker.evaluator = isListItem;
								range.endContainer = walker.previous();
							}

							if ( nearestListBlock ) {
								var firstListItem = nearestListBlock.getFirst( isListItem ),
									hasMultipleItems = !!firstListItem.getNext( isListItem ),
									rangeStart = range.startContainer,
									indentWholeList = firstListItem.equals( rangeStart ) || firstListItem.contains( rangeStart );

								// Indent the entire list if cursor is inside the first list item. (#3893)
								// Only do that for indenting or when using indent classes or when there is something to outdent. (#6141)
								if ( !indentWholeList || !( that.isIndent || that.useIndentClasses || parseInt( nearestListBlock.getStyle( that.getIndentCssProperty( nearestListBlock ) ), 10 ) ) )
									indentList( nearestListBlock );
								else if ( !this.indentElement( nearestListBlock, !hasMultipleItems && firstListItem.getDirection() ) )
									indentList( nearestListBlock );

								return true;
							}

							return false;
						}
					}
				}
			});

			// Register commands.
			CKEDITOR.plugins.indent.registerIndentCommands( editor, {
				indentlist: new indentListCommand( editor, 'indentlist' ),
				outdentlist: new indentListCommand( editor, 'outdentlist' )
			});
		}
	});
})();