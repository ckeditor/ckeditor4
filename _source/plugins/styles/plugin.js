/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'styles', {
	requires: [ 'selection' ]
});

/**
 * Registers a function to be called whenever a style changes its state in the
 * editing area. The current state is passed to the function. The possible
 * states are {@link CKEDITOR.TRISTATE_ON} and {@link CKEDITOR.TRISTATE_OFF}.
 * @param {CKEDITOR.style} The style to be watched.
 * @param {Function} The function to be called when the style state changes.
 * @example
 * // Create a style object for the &lt;b&gt; element.
 * var style = new CKEDITOR.style( { element : 'b' } );
 * var editor = CKEDITOR.instances.editor1;
 * editor.attachStyleStateChange( style, function( state )
 *     {
 *         if ( state == CKEDITOR.TRISTATE_ON )
 *             alert( 'The current state for the B element is ON' );
 *         else
 *             alert( 'The current state for the B element is OFF' );
 *     });
 */
CKEDITOR.editor.prototype.attachStyleStateChange = function( style, callback ) {
	// Try to get the list of attached callbacks.
	var styleStateChangeCallbacks = this._.styleStateChangeCallbacks;

	// If it doesn't exist, it means this is the first call. So, let's create
	// all the structure to manage the style checks and the callback calls.
	if ( !styleStateChangeCallbacks ) {
		// Create the callbacks array.
		styleStateChangeCallbacks = this._.styleStateChangeCallbacks = [];

		// Attach to the selectionChange event, so we can check the styles at
		// that point.
		this.on( 'selectionChange', function( ev ) {
			// Loop throw all registered callbacks.
			for ( var i = 0; i < styleStateChangeCallbacks.length; i++ ) {
				var callback = styleStateChangeCallbacks[ i ];

				// Check the current state for the style defined for that
				// callback.
				var currentState = callback.style.checkActive( ev.data.path ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;

				// If the state changed since the last check.
				if ( callback.state !== currentState ) {
					// Call the callback function, passing the current
					// state to it.
					callback.fn.call( this, currentState );

					// Save the current state, so it can be compared next
					// time.
					callback.state !== currentState;
				}
			}
		});
	}

	// Save the callback info, so it can be checked on the next occurence of
	// selectionChange.
	styleStateChangeCallbacks.push({ style: style, fn: callback } );
};

CKEDITOR.STYLE_BLOCK = 1;
CKEDITOR.STYLE_INLINE = 2;
CKEDITOR.STYLE_OBJECT = 3;

(function() {
	var blockElements = { address:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1 };
	var objectElements = { a:1,embed:1,hr:1,img:1,li:1,object:1,ol:1,table:1,td:1,tr:1,ul:1 };

	var semicolonFixRegex = /\s*(?:;\s*|$)/;

	CKEDITOR.style = function( styleDefinition, variablesValues ) {
		if ( variablesValues ) {
			styleDefinition = CKEDITOR.tools.clone( styleDefinition );

			replaceVariables( styleDefinition.attributes, variablesValues );
			replaceVariables( styleDefinition.styles, variablesValues );
		}

		var element = this.element = ( styleDefinition.element || '*' ).toLowerCase();

		this.type = ( element == '#' || blockElements[ element ] ) ? CKEDITOR.STYLE_BLOCK : objectElements[ element ] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE;

		this._ = {
			definition: styleDefinition
		};
	};

	CKEDITOR.style.prototype = {
		apply: function( document ) {
			applyStyle.call( this, document, false );
		},

		remove: function( document ) {
			applyStyle.call( this, document, true );
		},

		applyToRange: function( range ) {
			return ( this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? applyInlineStyle : this.type == CKEDITOR.STYLE_BLOCK ? applyBlockStyle : null ).call( this, range );
		},

		removeFromRange: function( range ) {
			return ( this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? removeInlineStyle : null ).call( this, range );
		},

		applyToObject: function( element ) {
			setupElement( element, this );
		},

		/**
		 * Get the style state inside an element path. Returns "true" if the
		 * element is active in the path.
		 */
		checkActive: function( elementPath ) {
			switch ( this.type ) {
				case CKEDITOR.STYLE_BLOCK:
					return this.checkElementRemovable( elementPath.block || elementPath.blockLimit, true );

				case CKEDITOR.STYLE_INLINE:

					var elements = elementPath.elements;

					for ( var i = 0, element; i < elements.length; i++ ) {
						element = elements[ i ];

						if ( element == elementPath.block || element == elementPath.blockLimit )
							continue;

						if ( this.checkElementRemovable( element, true ) )
							return true;
					}
			}
			return false;
		},

		// Checks if an element, or any of its attributes, is removable by the
		// current style definition.
		checkElementRemovable: function( element, fullMatch ) {
			if ( !element )
				return false;

			var def = this._.definition,
				attribs;

			// If the element name is the same as the style name.
			if ( element.getName() == this.element ) {
				// If no attributes are defined in the element.
				if ( !fullMatch && !element.hasAttributes() )
					return true;

				attribs = getAttributesForComparison( def );

				if ( attribs._length ) {
					for ( var attName in attribs ) {
						if ( attName == '_length' )
							continue;

						if ( compareAttributeValues( attName, attribs[ attName ], element.getAttribute( attName ) ) ) {
							if ( !fullMatch )
								return true;
						} else if ( fullMatch )
							return false;
					}
				} else
					return true;
			}

			// Check if the element can be somehow overriden.
			var override = getOverrides( this )[ element.getName() ];
			if ( override ) {
				// If no attributes have been defined, remove the element.
				if ( !( attribs = override.attributes ) )
					return true;

				for ( var i = 0; i < attribs.length; i++ ) {
					var attName = attribs[ i ][ 0 ],
						actualAttrValue;
					if ( actualAttrValue = element.getAttribute( attName ) ) {
						var attValue = attribs[ i ][ 1 ];

						// Remove the attribute if:
						//    - The override definition value is null;
						//    - The override definition valie is a string that
						//      matches the attribute value exactly.
						//    - The override definition value is a regex that
						//      has matches in the attribute value.
						if ( attValue == null || ( typeof attValue == 'string' && actualAttrValue == attValue ) || attValue.test( actualAttrValue ) )
							return true;
					}
				}
			}
			return false;
		}
	};

	// Build the cssText based on the styles definition.
	CKEDITOR.style.getStyleText = function( styleDefinition ) {
		// If we have already computed it, just return it.
		var stylesDef = styleDefinition._ST;
		if ( stylesDef )
			return stylesDef;

		stylesDef = styleDefinition.styles;

		// Builds the StyleText.

		var stylesText = ( styleDefinition.attributes && styleDefinition.attributes[ 'style' ] ) || '';

		if ( stylesText.length )
			stylesText = stylesText.replace( semicolonFixRegex, ';' );

		for ( var style in stylesDef )
			stylesText += style + ':' + stylesDef[ style ] + ';';

		// Browsers make some changes to the style when applying them. So, here
		// we normalize it to the browser format.
		if ( stylesText.length ) {
			stylesText = normalizeCssText( stylesText );

			if ( stylesText.length )
				stylesText = stylesText.replace( semicolonFixRegex, ';' );
		}

		// Return it, saving it to the next request.
		return ( styleDefinition._ST = stylesText );
	};

	function applyInlineStyle( range ) {
		var document = range.document;

		if ( range.collapsed ) {
			// Create the element to be inserted in the DOM.
			var collapsedElement = getElement( this, document );

			// Insert the empty element into the DOM at the range position.
			range.insertNode( collapsedElement );

			// Place the selection right inside the empty element.
			range.moveToPosition( collapsedElement, CKEDITOR.POSITION_BEFORE_END );

			return;
		}

		var elementName = this.element;
		var def = this._.definition;
		var isUnknownElement;

		// Get the DTD definition for the element. Defaults to "span".
		var dtd = CKEDITOR.dtd[ elementName ] || ( isUnknownElement = true, CKEDITOR.dtd.span );

		// Bookmark the range so we can re-select it after processing.
		var bookmark = range.createBookmark();

		// Expand the range.
		range.enlarge( CKEDITOR.ENLARGE_ELEMENT );
		range.trim();

		// Get the first node to be processed and the last, which concludes the
		// processing.
		var boundaryNodes = range.getBoundaryNodes();
		var firstNode = boundaryNodes.startNode;
		var lastNode = boundaryNodes.endNode.getNextSourceNode( true );

		// The detection algorithm below skips the contents inside bookmark nodes, so
		// we'll need to make sure lastNode isn't the &nbsp; inside a bookmark node.
		var lastParent = lastNode.getParent();
		if ( lastParent && lastParent.getAttribute( '_fck_bookmark' ) )
			lastNode = lastParent;

		if ( lastNode.equals( firstNode ) ) {
			// If the last node is the same as the the first one, we must move
			// it to the next one, otherwise the first one will not be
			// processed.
			lastNode = lastNode.getNextSourceNode( true );

			// It may happen that there are no more nodes after it (the end of
			// the document), so we must add something there to make our code
			// simpler.
			if ( !lastNode ) {
				lastNode = document.createText( '' );
				lastNode.insertAfter( firstNode );
			}
		}

		var currentNode = firstNode;

		var styleRange;

		// Indicates that that some useful inline content has been found, so
		// the style should be applied.
		var hasContents;

		while ( currentNode ) {
			var applyStyle = false;

			if ( currentNode.equals( lastNode ) ) {
				currentNode = null;
				applyStyle = true;
			} else {
				var nodeType = currentNode.type;
				var nodeName = nodeType == CKEDITOR.NODE_ELEMENT ? currentNode.getName() : null;

				if ( nodeName && currentNode.getAttribute( '_fck_bookmark' ) ) {
					currentNode = currentNode.getNextSourceNode( true );
					continue;
				}

				// Check if the current node can be a child of the style element.
				if ( !nodeName || ( dtd[ nodeName ] && ( currentNode.getPosition( lastNode ) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED ) == ( CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED ) ) ) {
					var currentParent = currentNode.getParent();

					// Check if the style element can be a child of the current
					// node parent or if the element is not defined in the DTD.
					if ( currentParent && ( ( currentParent.getDtd() || CKEDITOR.dtd.span )[ elementName ] || isUnknownElement ) ) {
						// This node will be part of our range, so if it has not
						// been started, place its start right before the node.
						// In the case of an element node, it will be included
						// only if it is entirely inside the range.
						if ( !styleRange && ( !nodeName || !CKEDITOR.dtd.$removeEmpty[ nodeName ] || ( currentNode.getPosition( lastNode ) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED ) == ( CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED ) ) ) {
							styleRange = new CKEDITOR.dom.range( document );
							styleRange.setStartBefore( currentNode );
						}

						// Non element nodes, or empty elements can be added
						// completely to the range.
						if ( nodeType == CKEDITOR.NODE_TEXT || ( nodeType == CKEDITOR.NODE_ELEMENT && !currentNode.getChildCount() ) ) {
							var includedNode = currentNode;
							var parentNode;

							// This node is about to be included completelly, but,
							// if this is the last node in its parent, we must also
							// check if the parent itself can be added completelly
							// to the range.
							while ( !includedNode.$.nextSibling && ( parentNode = includedNode.getParent(), dtd[ parentNode.getName() ] ) && ( parentNode.getPosition( firstNode ) | CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED ) == ( CKEDITOR.POSITION_FOLLOWING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED ) ) {
								includedNode = parentNode;
							}

							styleRange.setEndAfter( includedNode );

							// If the included node still is the last node in its
							// parent, it means that the parent can't be included
							// in this style DTD, so apply the style immediately.
							if ( !includedNode.$.nextSibling )
								applyStyle = true;

							if ( !hasContents )
								hasContents = ( nodeType != CKEDITOR.NODE_TEXT || ( /[^\s\ufeff]/ ).test( currentNode.getText() ) );
						}
					} else
						applyStyle = true;
				} else
					applyStyle = true;

				// Get the next node to be processed.
				currentNode = currentNode.getNextSourceNode();
			}

			// Apply the style if we have something to which apply it.
			if ( applyStyle && hasContents && styleRange && !styleRange.collapsed ) {
				// Build the style element, based on the style object definition.
				var styleNode = getElement( this, document );

				// Get the element that holds the entire range.
				var parent = styleRange.getCommonAncestor();

				// Loop through the parents, removing the redundant attributes
				// from the element to be applied.
				while ( styleNode && parent ) {
					if ( parent.getName() == elementName ) {
						for ( var attName in def.attribs ) {
							if ( styleNode.getAttribute( attName ) == parent.getAttribute( attName ) )
								styleNode.removeAttribute( attName );
						}

						for ( var styleName in def.styles ) {
							if ( styleNode.getStyle( styleName ) == parent.getStyle( styleName ) )
								styleNode.removeStyle( styleName );
						}

						if ( !styleNode.hasAttributes() ) {
							styleNode = null;
							break;
						}
					}

					parent = parent.getParent();
				}

				if ( styleNode ) {
					// Move the contents of the range to the style element.
					styleRange.extractContents().appendTo( styleNode );

					// Here we do some cleanup, removing all duplicated
					// elements from the style element.
					removeFromInsideElement( this, styleNode );

					// Insert it into the range position (it is collapsed after
					// extractContents.
					styleRange.insertNode( styleNode );

					// Let's merge our new style with its neighbors, if possible.
					mergeSiblings( styleNode );

					// As the style system breaks text nodes constantly, let's normalize
					// things for performance.
					// With IE, some paragraphs get broken when calling normalize()
					// repeatedly. Also, for IE, we must normalize body, not documentElement.
					// IE is also known for having a "crash effect" with normalize().
					// We should try to normalize with IE too in some way, somewhere.
					if ( !CKEDITOR.env.ie )
						styleNode.$.normalize();
				}

				// Style applied, let's release the range, so it gets
				// re-initialization in the next loop.
				styleRange = null;
			}
		}

		//		this._FixBookmarkStart( startNode );

		range.moveToBookmark( bookmark );
	}

	function removeInlineStyle( range ) {
		/*
		 * Make sure our range has included all "collpased" parent inline nodes so
		 * that our operation logic can be simpler.
		 */
		range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

		var bookmark = range.createBookmark( true ),
			startNode = range.document.getById( bookmark.startNode );

		if ( range.collapsed ) {
			/*
			 * If the range is collapsed, try to remove the style from all ancestor
			 * elements, until a block boundary is reached.
			 */
			var startPath = new CKEDITOR.dom.elementPath( startNode.getParent() );
			for ( var i = 0, element; i < startPath.elements.length && ( element = startPath.elements[ i ] ); i++ ) {
				if ( element == startPath.block || element == startPath.blockLimit )
					break;

				if ( this.checkElementRemovable( element ) ) {
					/*
					 * Before removing the style node, there may be a sibling to the style node
					 * that's exactly the same to the one to be removed. To the user, it makes
					 * no difference that they're separate entities in the DOM tree. So, merge
					 * them before removal.
					 */
					mergeSiblings( element );
					removeFromElement( this, element );
				}
			}
		} else {
			/*
			 * Now our range isn't collapsed. Lets walk from the start node to the end
			 * node via DFS and remove the styles one-by-one.
			 */
			var endNode = range.document.getById( bookmark.endNode ),
				me = this;

			/*
			 * Find out the style ancestor that needs to be broken down at startNode
			 * and endNode.
			 */
			function breakNodes() {
				var startPath = new CKEDITOR.dom.elementPath( startNode.getParent() ),
					endPath = new CKEDITOR.dom.elementPath( endNode.getParent() ),
					breakStart = null,
					breakEnd = null;
				for ( var i = 0; i < startPath.elements.length; i++ ) {
					var element = startPath.elements[ i ];

					if ( element == startPath.block || element == startPath.blockLimit )
						break;

					if ( me.checkElementRemovable( element ) )
						breakStart = element;
				}
				for ( i = 0; i < endPath.elements.length; i++ ) {
					element = endPath.elements[ i ];

					if ( element == endPath.block || element == endPath.blockLimit )
						break;

					if ( me.checkElementRemovable( element ) )
						breakEnd = element;
				}

				if ( breakEnd )
					endNode.breakParent( breakEnd );
				if ( breakStart )
					startNode.breakParent( breakStart );
			}
			breakNodes();

			// Now, do the DFS walk.
			var currentNode = startNode.getNext();
			while ( !currentNode.equals( endNode ) ) {
				/*
				 * Need to get the next node first because removeFromElement() can remove
				 * the current node from DOM tree.
				 */
				var nextNode = currentNode.getNextSourceNode();
				if ( currentNode.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable( currentNode ) ) {
					// Remove style from element or overriding element.
					if ( currentNode.getName() == this.element )
						removeFromElement( this, currentNode );
					else
						removeOverrides( currentNode, getOverrides( this )[ currentNode.getName() ] );

					/*
					 * removeFromElement() may have merged the next node with something before
					 * the startNode via mergeSiblings(). In that case, the nextNode would
					 * contain startNode and we'll have to call breakNodes() again and also
					 * reassign the nextNode to something after startNode.
					 */
					if ( nextNode.type == CKEDITOR.NODE_ELEMENT && nextNode.contains( startNode ) ) {
						breakNodes();
						nextNode = startNode.getNext();
					}
				}
				currentNode = nextNode;
			}
		}

		range.moveToBookmark( bookmark );
	}

	function applyBlockStyle( range ) {
		// Bookmark the range so we can re-select it after processing.
		var bookmark = range.createBookmark();

		var iterator = range.createIterator();
		iterator.enforceRealBlocks = true;

		var block;
		var doc = range.document;
		var previousPreBlock;

		while ( ( block = iterator.getNextParagraph() ) ) // Only one =
		{
			// Create the new node right before the current one.
			var newBlock = getElement( this, doc );

			// Check if we are changing from/to <pre>.
			//			var newBlockIsPre	= newBlock.nodeName.IEquals( 'pre' );
			//			var blockIsPre		= block.nodeName.IEquals( 'pre' );

			//			var toPre	= newBlockIsPre && !blockIsPre;
			//			var fromPre	= !newBlockIsPre && blockIsPre;

			// Move everything from the current node to the new one.
			//			if ( toPre )
			//				newBlock = this._ToPre( doc, block, newBlock );
			//			else if ( fromPre )
			//				newBlock = this._FromPre( doc, block, newBlock );
			//			else	// Convering from a regular block to another regular block.
			block.moveChildren( newBlock );

			// Replace the current block.
			newBlock.insertBefore( block );
			block.remove();

			// Complete other tasks after inserting the node in the DOM.
			//			if ( newBlockIsPre )
			//			{
			//				if ( previousPreBlock )
			//					this._CheckAndMergePre( previousPreBlock, newBlock ) ;	// Merge successive <pre> blocks.
			//				previousPreBlock = newBlock;
			//			}
			//			else if ( fromPre )
				//				this._CheckAndSplitPre( newBlock ) ;				// Split <br><br> in successive <pre>s.
				}

		range.moveToBookmark( bookmark );
	}

	// Removes a style from an element itself, don't care about its subtree.
	function removeFromElement( style, element ) {
		var def = style._.definition,
			attributes = def.attributes,
			styles = def.styles,
			overrides = getOverrides( style );

		function removeAttrs() {
			for ( var attName in attributes ) {
				// The 'class' element value must match (#1318).
				if ( attName == 'class' && element.getAttribute( attName ) != attributes[ attName ] )
					continue;
				element.removeAttribute( attName );
			}
		}

		// Remove definition attributes/style from the elemnt.		
		removeAttrs();
		for ( var styleName in styles )
			element.removeStyle( styleName );

		// Now remove override styles on the element.
		attributes = overrides[ element.getName() ];
		if ( attributes )
			removeAttrs();
		removeNoAttribsElement( element );
	}

	// Removes a style from inside an element.
	function removeFromInsideElement( style, element ) {
		var def = style._.definition,
			attribs = def.attributes,
			styles = def.styles,
			overrides = getOverrides( style );

		var innerElements = element.getElementsByTag( style.element );

		for ( var i = innerElements.count(); --i >= 0; )
			removeFromElement( style, innerElements.getItem( i ) );

		// Now remove any other element with different name that is
		// defined to be overriden.
		for ( var overrideElement in overrides ) {
			if ( overrideElement != style.element ) {
				var innerElements = element.getElementsByTag( overrideElement );
				for ( var i = innerElements.count() - 1; i >= 0; i-- ) {
					var innerElement = innerElements.getItem( i );
					removeOverrides( innerElement, overrides[ overrideElement ] );
				}
			}
		}

	}

	/**
	 *  Remove overriding styles/attributes from the specific element.
	 *  Note: Remove the element if no attributes remain.
	 * @param {Object} element
	 * @param {Object} overrides
	 */
	function removeOverrides( element, overrides ) {
		var attributes = overrides && overrides.attributes;

		if ( attributes ) {
			for ( var i = 0; i < attributes.length; i++ ) {
				var attName = attributes[ i ][ 0 ],
					actualAttrValue;

				if ( actualAttrValue = element.getAttribute( attName ) ) {
					var attValue = attributes[ i ][ 1 ];

					// Remove the attribute if:
					//    - The override definition value is null ;
					//    - The override definition valie is a string that
					//      matches the attribute value exactly.
					//    - The override definition value is a regex that
					//      has matches in the attribute value.
					if ( attValue == null || ( attValue.test && attValue.test( actualAttrValue ) ) || ( typeof attValue == 'string' && actualAttrValue == attValue ) )
						element.removeAttribute( attName );
				}
			}
		}

		removeNoAttribsElement( element );
	}

	// If the element has no more attributes, remove it.
	function removeNoAttribsElement( element ) {
		// If no more attributes remained in the element, remove it,
		// leaving its children.
		if ( !element.hasAttributes() ) {
			// Removing elements may open points where merging is possible,
			// so let's cache the first and last nodes for later checking.
			var firstChild = element.getFirst();
			var lastChild = element.getLast();

			element.remove( true );

			if ( firstChild ) {
				// Check the cached nodes for merging.
				mergeSiblings( firstChild );

				if ( lastChild && !firstChild.equals( lastChild ) )
					mergeSiblings( lastChild );
			}
		}
	}

	function mergeSiblings( element ) {
		if ( !element || element.type != CKEDITOR.NODE_ELEMENT || !CKEDITOR.dtd.$removeEmpty[ element.getName() ] )
			return;

		mergeElements( element, element.getNext(), true );
		mergeElements( element, element.getPrevious() );
	}

	function mergeElements( element, sibling, isNext ) {
		if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT ) {
			var hasBookmark = sibling.getAttribute( '_fck_bookmark' );

			if ( hasBookmark )
				sibling = isNext ? sibling.getNext() : sibling.getPrevious();

			if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT && element.isIdentical( sibling ) ) {
				// Save the last child to be checked too, to merge things like
				// <b><i></i></b><b><i></i></b> => <b><i></i></b>
				var innerSibling = isNext ? element.getLast() : element.getFirst();

				if ( hasBookmark )
				( isNext ? sibling.getPrevious() : sibling.getNext() ).move( element, !isNext );

				sibling.moveChildren( element, !isNext );
				sibling.remove();

				// Now check the last inner child (see two comments above).
				if ( innerSibling )
					mergeSiblings( innerSibling );
			}
		}
	}

	function getElement( style, targetDocument ) {
		var el;

		var def = style._.definition;

		var elementName = style.element;

		// The "*" element name will always be a span for this function.
		if ( elementName == '*' )
			elementName = 'span';

		// Create the element.
		el = new CKEDITOR.dom.element( elementName, targetDocument );

		return setupElement( el, style );
	}

	function setupElement( el, style ) {
		var def = style._.definition;
		var attributes = def.attributes;
		var styles = CKEDITOR.style.getStyleText( def );

		// Assign all defined attributes.
		if ( attributes ) {
			for ( var att in attributes ) {
				el.setAttribute( att, attributes[ att ] );
			}
		}

		// Assign all defined styles.
		if ( styles )
			el.setAttribute( 'style', styles );

		return el;
	}

	var varRegex = /#\((.+?)\)/g;

	function replaceVariables( list, variablesValues ) {
		for ( var item in list ) {
			list[ item ] = list[ item ].replace( varRegex, function( match, varName ) {
				return variablesValues[ varName ];
			});
		}
	}

	var spacesRegex = /\s+/g;

	// Returns an object that can be used for style matching comparison.
	// Attributes names and values are all lowercased, and the styles get
	// merged with the style attribute.
	function getAttributesForComparison( styleDefinition ) {
		// If we have already computed it, just return it.
		var attribs = styleDefinition._AC;
		if ( attribs )
			return attribs;

		attribs = {};

		var length = 0;

		// Loop through all defined attributes.
		var styleAttribs = styleDefinition.attributes;
		if ( styleAttribs ) {
			for ( var styleAtt in styleAttribs ) {
				length++;
				attribs[ styleAtt.toLowerCase() ] = styleAttribs[ styleAtt ].toLowerCase();
			}
		}

		// Includes the style definitions.
		var styleText = CKEDITOR.style.getStyleText( styleDefinition );
		if ( styleText.length > 0 ) {
			if ( !attribs[ 'style' ] )
				length++;

			attribs[ 'style' ] = styleText.replace( spacesRegex, '' ).toLowerCase();
		}

		// Appends the "length" information to the object.
		attribs._length = length;

		// Return it, saving it to the next request.
		return ( styleDefinition._AC = attribs );
	}

	/**
	 * Get the the collection used to compare the elements and attributes,
	 * defined in this style overrides, with other element. All information in
	 * it is lowercased.
	 * @param {CKEDITOR.style} style
	 */
	function getOverrides( style ) {
		if ( style._.overrides )
			return style._.overrides;

		var overrides = ( style._.overrides = {} ),
			definition = style._.definition.overrides;

		if ( definition ) {
			// The override description can be a string, object or array.
			// Internally, well handle arrays only, so transform it if needed.
			if ( !CKEDITOR.tools.isArray( definition ) )
				definition = [ definition ];

			// Loop through all override definitions.
			for ( var i = 0; i < definition.length; i++ ) {
				var override = definition[ i ];
				var elementName;
				var overrideEl;
				var attrs;

				// If can be a string with the element name.
				if ( typeof override == 'string' )
					elementName = override.toLowerCase();
				// Or an object.
				else {
					elementName = override.element ? override.element.toLowerCase() : style.element;
					attrs = override.attributes;
				}

				// We can have more than one override definition for the same
				// element name, so we attempt to simply append information to
				// it if it already exists.
				overrideEl = overrides[ elementName ] || ( overrides[ elementName ] = {} );

				if ( attrs ) {
					// The returning attributes list is an array, because we
					// could have different override definitions for the same
					// attribute name.
					var overrideAttrs = ( overrideEl.attributes = overrideEl.attributes || new Array() );
					for ( var attName in attrs ) {
						// Each item in the attributes array is also an array,
						// where [0] is the attribute name and [1] is the
						// override value.
						overrideAttrs.push( [ attName.toLowerCase(), attrs[ attName ] ] );
					}
				}
			}
		}

		return overrides;
	}

	function normalizeCssText( unparsedCssText ) {
		// Injects the style in a temporary span object, so the browser parses it,
		// retrieving its final format.
		var tempSpan = document.createElement( 'span' );
		tempSpan.style.cssText = unparsedCssText;
		return tempSpan.style.cssText;
	}

	// valueA is our internal "for comparison" value.
	// valueB is the value retrieved from the element.
	function compareAttributeValues( attName, valueA, valueB ) {
		if ( valueA == valueB || ( !valueA && !valueB ) )
			return true;
		else if ( !valueA || !valueB )
			return false;

		valueB = valueB.toLowerCase();

		if ( attName == 'style' ) {
			valueB = valueB.replace( spacesRegex, '' );
			if ( valueB.charAt( valueB.length - 1 ) != ';' )
				valueB += ';';
		}

		// Return true if they match or if valueA is null and valueB is an empty string
		return ( valueA == valueB );
	}

	function applyStyle( document, remove ) {
		// Get all ranges from the selection.
		var selection = document.getSelection();
		var ranges = selection.getRanges();
		var func = remove ? this.removeFromRange : this.applyToRange;

		// Apply the style to the ranges.
		for ( var i = 0; i < ranges.length; i++ )
			func.call( this, ranges[ i ] );

		// Select the ranges again.
		selection.selectRanges( ranges );
	}
})();

CKEDITOR.styleCommand = function( style ) {
	this.style = style;
};

CKEDITOR.styleCommand.prototype.exec = function( editor ) {
	editor.focus();

	var doc = editor.document;

	if ( doc ) {
		if ( this.state == CKEDITOR.TRISTATE_OFF )
			this.style.apply( doc );
		else if ( this.state == CKEDITOR.TRISTATE_ON )
			this.style.remove( doc );
	}

	return !!doc;
};
