/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Handles the indentation of lists.
 */

( function() {
	'use strict';

	var isNotWhitespaces = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true ),
		TRISTATE_DISABLED = CKEDITOR.TRISTATE_DISABLED,
		TRISTATE_OFF = CKEDITOR.TRISTATE_OFF;

	CKEDITOR.plugins.add( 'indentlist', {
		requires: 'indent',
		init: function( editor ) {
			var globalHelpers = CKEDITOR.plugins.indent;

			// Register commands.
			globalHelpers.registerCommands( editor, {
				indentlist: new commandDefinition( editor, 'indentlist', true ),
				outdentlist: new commandDefinition( editor, 'outdentlist' )
			} );

			function commandDefinition( editor ) {
				globalHelpers.specificDefinition.apply( this, arguments );

				// Require ul OR ol list.
				this.requiredContent = [ 'ul', 'ol' ];

				// Indent and outdent lists with TAB/SHIFT+TAB key. Indenting can
				// be done for any list item that isn't the first child of the parent.
				editor.on( 'key', function( evt ) {
					var path = editor.elementPath();

					if ( editor.mode != 'wysiwyg' )
						return;

					if ( evt.data.keyCode == this.indentKey ) {
						// Prevent of getting context of empty path (#424)(https://dev.ckeditor.com/ticket/17028).
						if ( !path ) {
							return;
						}

						var list = this.getContext( path );

						if ( list ) {
							// Don't indent if in first list item of the parent.
							// Outdent, however, can always be done to collapse
							// the list into a paragraph (div).
							if ( this.isIndent && CKEDITOR.plugins.indentList.firstItemInPath( this.context, path, list ) )
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

				// There are two different jobs for this plugin:
				//
				//	* Indent job (priority=10), before indentblock.
				//
				//	  This job is before indentblock because, if this plugin is
				//	  loaded it has higher priority over indentblock. It means that,
				//	  if possible, nesting is performed, and then block manipulation,
				//	  if necessary.
				//
				//	* Outdent job (priority=30), after outdentblock.
				//
				//	  This job got to be after outdentblock because in some cases
				//	  (margin, config#indentClass on list) outdent must be done on
				//	  block-level.

				this.jobs[ this.isIndent ? 10 : 30 ] = {
					refresh: this.isIndent ?
						function( editor, path ) {
							var list = this.getContext( path ),
								inFirstListItem = CKEDITOR.plugins.indentList.firstItemInPath( this.context, path, list );

							if ( !list || !this.isIndent || inFirstListItem )
								return TRISTATE_DISABLED;

							return TRISTATE_OFF;
						} : function( editor, path ) {
							var list = this.getContext( path );

							if ( !list || this.isIndent )
								return TRISTATE_DISABLED;

							return TRISTATE_OFF;
						},

					exec: CKEDITOR.tools.bind( indentList, this )
				};
			}

			CKEDITOR.tools.extend( commandDefinition.prototype, globalHelpers.specificDefinition.prototype, {
				// Elements that, if in an elementpath, will be handled by this
				// command. They restrict the scope of the plugin.
				context: { ol: 1, ul: 1 }
			} );
		}
	} );

	function indentList( editor ) {
		var that = this,
			database = this.database,
			context = this.context,
			range;

		function indent( listNode ) {
			// Our starting and ending points of the range might be inside some blocks under a list item...
			// So before playing with the iterator, we need to expand the block to include the list items.
			var startContainer = range.startContainer,
				endContainer = range.endContainer;
			while ( startContainer && !startContainer.getParent().equals( listNode ) )
				startContainer = startContainer.getParent();
			while ( endContainer && !endContainer.getParent().equals( listNode ) )
				endContainer = endContainer.getParent();

			if ( !startContainer || !endContainer )
				return false;

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
				return false;

			// Do indent or outdent operations on the array model of the list, not the
			// list's DOM tree itself. The array model demands that it knows as much as
			// possible about the surrounding lists, we need to feed it the further
			// ancestor node that is still a list.
			var listParents = listNode.getParents( true );
			for ( var i = 0; i < listParents.length; i++ ) {
				if ( listParents[ i ].getName && context[ listParents[ i ].getName() ] ) {
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
				// Make sure the newly created sublist get a brand-new element of the same type. (https://dev.ckeditor.com/ticket/5372)
				if ( indentOffset > 0 ) {
					var listRoot = listArray[ i ].parent;

					// Find previous list item which has the same indention offset as the new indention offset
					// of current item to copy its root tag (so the proper list-style-type is used) (#842).
					for ( var j = i - 1; j >= 0; j-- ) {
						if ( listArray[ j ].indent === indentOffset ) {
							listRoot = listArray[ j ].parent;
							break;
						}
					}

					listArray[ i ].parent = new CKEDITOR.dom.element( listRoot.getName(), listRoot.getDocument() );
				}
			}

			for ( i = lastItem.getCustomData( 'listarray_index' ) + 1; i < listArray.length && listArray[ i ].indent > baseIndent; i++ )
				listArray[ i ].indent += indentOffset;

			// Convert the array back to a DOM forest (yes we might have a few subtrees now).
			// And replace the old list with the new forest.
			var newList = CKEDITOR.plugins.list.arrayToList( listArray, database, null, editor.config.enterMode, listNode.getDirection() );

			// Avoid nested <li> after outdent even they're visually same,
			// recording them for later refactoring.(https://dev.ckeditor.com/ticket/3982)
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
					while ( ( followingList = followingList.getNext() ) && followingList.is && followingList.getName() in context ) {
						// IE requires a filler NBSP for nested list inside empty list item,
						// otherwise the list item will be inaccessiable. (https://dev.ckeditor.com/ticket/4476)
						if ( CKEDITOR.env.needsNbspFiller && !li.getFirst( neitherWhitespacesNorBookmark ) )
							li.append( range.document.createText( '\u00a0' ) );

						li.append( followingList );
					}

					li.insertAfter( parentLiElement );
				}
			}

			if ( newList )
				editor.fire( 'contentDomInvalidated' );

			return true;
		}

		var selection = editor.getSelection(),
			ranges = selection && selection.getRanges(),
			iterator = ranges.createIterator();

		while ( ( range = iterator.getNextRange() ) ) {
			var nearestListBlock = range.getCommonAncestor();

			while ( nearestListBlock && !( nearestListBlock.type == CKEDITOR.NODE_ELEMENT && context[ nearestListBlock.getName() ] ) ) {
				// Avoid having plugin propagate to parent of editor in inline mode by canceling the indentation. (https://dev.ckeditor.com/ticket/12796)
				if ( editor.editable().equals( nearestListBlock ) ) {
					nearestListBlock = false;
					break;
				}
				nearestListBlock = nearestListBlock.getParent();
			}

			// Avoid having selection boundaries out of the list.
			// <ul><li>[...</li></ul><p>...]</p> => <ul><li>[...]</li></ul><p>...</p>
			if ( !nearestListBlock ) {
				if ( ( nearestListBlock = range.startPath().contains( context ) ) )
					range.setEndAt( nearestListBlock, CKEDITOR.POSITION_BEFORE_END );
			}

			// Avoid having selection enclose the entire list. (https://dev.ckeditor.com/ticket/6138)
			// [<ul><li>...</li></ul>] =><ul><li>[...]</li></ul>
			if ( !nearestListBlock ) {
				var selectedNode = range.getEnclosedNode();
				if ( selectedNode && selectedNode.type == CKEDITOR.NODE_ELEMENT && selectedNode.getName() in context ) {
					range.setStartAt( selectedNode, CKEDITOR.POSITION_AFTER_START );
					range.setEndAt( selectedNode, CKEDITOR.POSITION_BEFORE_END );
					nearestListBlock = selectedNode;
				}
			}

			// Avoid selection anchors under list root.
			// <ul>[<li>...</li>]</ul> =>	<ul><li>[...]</li></ul>
			if ( nearestListBlock && range.startContainer.type == CKEDITOR.NODE_ELEMENT && range.startContainer.getName() in context ) {
				var walker = new CKEDITOR.dom.walker( range );
				walker.evaluator = listItem;
				range.startContainer = walker.next();
			}

			if ( nearestListBlock && range.endContainer.type == CKEDITOR.NODE_ELEMENT && range.endContainer.getName() in context ) {
				walker = new CKEDITOR.dom.walker( range );
				walker.evaluator = listItem;
				range.endContainer = walker.previous();
			}

			if ( nearestListBlock )
				return indent( nearestListBlock );
		}
		return 0;
	}

	// Determines whether a node is a list <li> element.
	function listItem( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.is( 'li' );
	}

	function neitherWhitespacesNorBookmark( node ) {
		return isNotWhitespaces( node ) && isNotBookmark( node );
	}

	/**
	 * Global namespace for methods exposed by the Indent List plugin.
	 *
	 * @singleton
	 * @class
	 */
	CKEDITOR.plugins.indentList = {};

	/**
	 * Checks whether the first child of the list is in the path.
	 * The list can be extracted from the path or given explicitly
	 * e.g. for better performance if cached.
	 *
	 * @since 4.4.6
	 * @param {Object} query See the {@link CKEDITOR.dom.elementPath#contains} method arguments.
	 * @param {CKEDITOR.dom.elementPath} path
	 * @param {CKEDITOR.dom.element} [list]
	 * @returns {Boolean}
	 * @member CKEDITOR.plugins.indentList
	 */
	CKEDITOR.plugins.indentList.firstItemInPath = function( query, path, list ) {
		var firstListItemInPath = path.contains( listItem );
		if ( !list )
			list = path.contains( query );

		return list && firstListItemInPath && firstListItemInPath.equals( list.getFirst( listItem ) );
	};
} )();
