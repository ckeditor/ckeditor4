/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows list indentation.
 */

(function() {
	'use strict';

	var isNotWhitespaces = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true ),
		isListItem, getNumericalIndentLevel, isFirstListItemInPath;

	CKEDITOR.plugins.add( 'indentlist', {
		requires: 'indent',
		init: function( editor ) {
			var globalHelpers = CKEDITOR.plugins.indent,
				editable = editor;

			// Use global helper functions.
			isListItem = globalHelpers.isListItem;
			getNumericalIndentLevel = globalHelpers.getNumericalIndentLevel;
			isFirstListItemInPath = globalHelpers.isFirstListItemInPath;

			// Register commands.
			globalHelpers.registerCommands( editor, {
				indentlist: new commandDefinition( editor, 'indentlist', true ),
				outdentlist: new commandDefinition( editor, 'outdentlist' )
			} );

			function commandDefinition( editor, name ) {
				globalHelpers.specificDefinition.apply( this, arguments );

				this.allowedContent = {
					'ol ul': {
						// Do not add elements, but only text-align style if element is validated by other rule.
						propertiesOnly: true,
						classes: this.useIndentClasses ? this.indentClasses : null
					}
				};

				var requiredParams = this.useIndentClasses ? '(' + this.indentClasses.join( ',' ) + ')' : '';

				this.requiredContent = [
					'ul' + requiredParams,
					'ol' + requiredParams
				];

				// Indent and outdent lists with TAB/SHIFT+TAB key. Indenting can
				// be done for any list item that isn't the first child of the parent.
				editor.on( 'key', function( evt ) {
					if ( editor.mode != 'wysiwyg' )
						return;

					var key = evt.data.keyCode;

					if ( evt.data.keyCode == this.indentKey ) {
						var list = this.getContext( editor.elementPath() );

						if ( list ) {
							// Don't indent if in first list item of the parent.
							// Outdent, however, can always be done to collapse
							// the list into a paragraph (div).
							if ( this.isIndent && isFirstListItemInPath( editor.elementPath(), list ) )
								return;

							// Exec related global indentation command. Global
							// commands take care of bookmarks and selection,
							// so it's much easier to use them instead of
							// content-specific commands.
							editor.execCommand( this.relatedGlobal );

							// Cancel the key event so editor doesn't lose focus.
							evt.cancel();
						}
					}
				}, this );

				this.jobs = {};

				if ( this.isIndent ) {
					this.jobs[ 10 ] = {
						refresh: function( editor, path ) {
							var list = this.getContext( path ),
								inFirstListItem = isFirstListItemInPath( path, list );

							if ( !list || !this.isIndent || inFirstListItem )
								return CKEDITOR.TRISTATE_DISABLED;

							return CKEDITOR.TRISTATE_OFF;
						},

						exec: function( editor ) {
							console.log( 'exec', this.name, 10 );
							return indentList.call( this, editor );
						}
					};
				} else {
					this.jobs[ 30 ] = {
						// Outdent only. Any list item.
						refresh: function( editor, path ) {
							var list = this.getContext( path ),
								inFirstListItem = isFirstListItemInPath( path, list );

							if ( !list || this.isIndent )
								return CKEDITOR.TRISTATE_DISABLED;

							return CKEDITOR.TRISTATE_OFF;
						},

						exec: function( editor ) {
							console.log( 'exec', this.name, 30 );
							return indentList.call( this, editor );
						}
					};
				}
			}

			CKEDITOR.tools.extend( commandDefinition.prototype, globalHelpers.specificDefinition.prototype, {
				// Elements that, if in an elementpath, will be handled by this
				// command. They restrict the scope of the plugin.
				indentContext: globalHelpers.listNodeNames,

				// refresh: function( editor, path ) {
				// 	var list = this.getContext( path ),
				// 		inFirstListItem = isFirstListItemInPath( path, list );

				// 	//	- List in the path
				// 	//
				// 	// 			Then this command makes no longer sense.
				// 	//			This command is for lists only.
				// 	//
				// 	if ( !list )
				// 		this.state = CKEDITOR.TRISTATE_DISABLED;

				// 	//	- List in the path
				// 	//	- Indent margin.
				// 	//
				// 	// 			Indentblock handles blocks with margins when
				// 	//			entire list must be indented. Indentlist never plays with
				// 	//			margins of the entire list: nesting only.
				// 	//
				// 	else if ( getNumericalIndentLevel( list ) && inFirstListItem )
				// 		this.state = CKEDITOR.TRISTATE_DISABLED;

				// 	//	+ List in the path
				// 	//	- Indent margin.
				// 	//	- Indenting
				// 	//
				// 	// 			List can always be outdented, nesting can be undone
				// 	//			or entire collapsed into a paragraph.
				// 	//
				// 	else if ( !this.isIndent )
				// 		this.state = CKEDITOR.TRISTATE_OFF;

				// 	// 	+ List in the path
				// 	//	- Indent margin.
				// 	//	+ Indenting
				// 	//	+ First list item
				// 	//
				// 	// 			Don't indent if path in the first list item because
				// 	//			is requires margins to be used. This is a job for indentblock.
				// 	//
				// 	else if ( inFirstListItem )
				// 		this.state = CKEDITOR.TRISTATE_DISABLED;

				// 	// 	+ List in the path
				// 	//	- Indent margin.
				// 	//	+ Indenting
				// 	//	- First list item
				// 	//	+ IndentClasses
				// 	//
				// 	// 			If reached the topmost level (class) of indentation,
				// 	// 		    disable the command. User restricted depth with classes.
				// 	//
				// 	else if ( this.useIndentClasses && !this.checkIndentClassLeft( list ) )
				// 		this.state = CKEDITOR.TRISTATE_DISABLED;

				// 	// 	+ List in the path
				// 	//	- Indent margin.
				// 	//	+ Indenting
				// 	//	- First list item
				// 	//	- IndentClasses
				// 	//
				// 	// 			We can always indent a little bit more ;)
				// 	//
				// 	else
				// 		this.state = CKEDITOR.TRISTATE_OFF;
				// },
			} );
		}
	} );

	function indentList( editor ) {
		var that = this,
			database = this.database,
			indentContext = this.indentContext;

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
				if ( listParents[ i ].getName && indentContext[ listParents[ i ].getName() ] ) {
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
					while ( ( followingList = followingList.getNext() ) && followingList.is && followingList.getName() in indentContext ) {
						// IE requires a filler NBSP for nested list inside empty list item,
						// otherwise the list item will be inaccessiable. (#4476)
						if ( CKEDITOR.env.ie && !li.getFirst( function( node ) {
							return isNotWhitespaces( node ) && isNotBookmark( node );
						} ) )
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
			contentIndented = false,
			range;

		while ( ( range = iterator.getNextRange() ) ) {
			var rangeRoot = range.getCommonAncestor(),
				nearestListBlock = rangeRoot;

			while ( nearestListBlock && !( nearestListBlock.type == CKEDITOR.NODE_ELEMENT && indentContext[ nearestListBlock.getName() ] ) )
				nearestListBlock = nearestListBlock.getParent();

			// Avoid having selection boundaries out of the list.
			// <ul><li>[...</li></ul><p>...]</p> => <ul><li>[...]</li></ul><p>...</p>
			if ( !nearestListBlock ) {
				if ( ( nearestListBlock = range.startPath().contains( indentContext ) ) )
					range.setEndAt( nearestListBlock, CKEDITOR.POSITION_BEFORE_END );
			}

			// Avoid having selection enclose the entire list. (#6138)
			// [<ul><li>...</li></ul>] =><ul><li>[...]</li></ul>
			if ( !nearestListBlock ) {
				var selectedNode = range.getEnclosedNode();
				if ( selectedNode && selectedNode.type == CKEDITOR.NODE_ELEMENT && selectedNode.getName() in indentContext ) {
					range.setStartAt( selectedNode, CKEDITOR.POSITION_AFTER_START );
					range.setEndAt( selectedNode, CKEDITOR.POSITION_BEFORE_END );
					nearestListBlock = selectedNode;
				}
			}

			// Avoid selection anchors under list root.
			// <ul>[<li>...</li>]</ul> =>	<ul><li>[...]</li></ul>
			if ( nearestListBlock && range.startContainer.type == CKEDITOR.NODE_ELEMENT && range.startContainer.getName() in indentContext ) {
				var walker = new CKEDITOR.dom.walker( range );
				walker.evaluator = isListItem;
				range.startContainer = walker.next();
			}

			if ( nearestListBlock && range.endContainer.type == CKEDITOR.NODE_ELEMENT && range.endContainer.getName() in indentContext ) {
				walker = new CKEDITOR.dom.walker( range );
				walker.evaluator = isListItem;
				range.endContainer = walker.previous();
			}

			if ( nearestListBlock ) {
				var firstListItem = nearestListBlock.getFirst( isListItem ),
					hasMultipleItems = !!firstListItem.getNext( isListItem ),
					rangeStart = range.startContainer,
					indentWholeList = firstListItem.equals( rangeStart ) || firstListItem.contains( rangeStart );

				if ( !indentWholeList || !( that.isIndent || that.useIndentClasses ) )
					indentList( nearestListBlock );

				else if ( !this.isIndent && !this.indentElement( nearestListBlock, !hasMultipleItems && firstListItem.getDirection() ) )
					indentList( nearestListBlock );

				contentIndented = true;
			}

		}

		console.log( 'ci', contentIndented );

		return contentIndented;
	}
})();