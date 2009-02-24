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

	CKEDITOR.style = function( styleDefinition ) {
		var element = this.element = ( styleDefinition.element || '*' ).toLowerCase();

		this.type = ( element == '#' || blockElements[ element ] ) ? CKEDITOR.STYLE_BLOCK : objectElements[ element ] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE;

		this._ = {
			definition: styleDefinition
		};
	};

	var applyStyle = function( document, remove ) {
			// Get all ranges from the selection.
			var selection = document.getSelection();
			var ranges = selection.getRanges();
			var func = remove ? this.removeFromRange : this.applyToRange;

			// Apply the style to the ranges.
			for ( var i = 0; i < ranges.length; i++ )
				func.call( this, ranges[ i ] );

			// Select the ranges again.
			selection.selectRanges( ranges );
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
			if ( !element || element.getName() != this.element )
				return false;

			var def = this._.definition;
			var attribs = def.attributes;
			var styles = def.styles;

			// If no attributes are defined in the element.
			if ( !fullMatch && !element.hasAttributes() )
				return true;

			for ( var attName in attribs ) {
				if ( element.getAttribute( attName ) == attribs[ attName ] ) {
					if ( !fullMatch )
						return true;
				} else if ( fullMatch )
					return false;
			}

			return true;
		},

		/**
		 * Sets the value of a variable attribute or style, to be used when
		 * appliying the style. This function must be called before using any
		 * other function in this object.
		 */
		setVariable: function( name, value ) {
			var variables = this._.variables || ( this._variables = {} );
			variables[ name ] = value;
		}
	};

	var applyInlineStyle = function( range ) {
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
			var firstNode = range.startContainer.getChild( range.startOffset ) || range.startContainer.getNextSourceNode();
			var lastNode = range.endContainer.getChild( range.endOffset ) || ( range.endOffset ? range.endContainer.getNextSourceNode() : range.endContainer );

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
							if ( nodeType == CKEDITOR.NODE_TEXT || ( nodeType == CKEDITOR.NODE_ELEMENT && !currentNode.getChildCount() && currentNode.$.offsetWidth ) ) {
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

					var parent = styleRange.getCommonAncestor();

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
		};

	var removeInlineStyle = function( range ) {
			/*
			 * Make sure our range has included all "collpased" parent inline nodes so
			 * that our operation logic can be simpler.
			 */
			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			var bookmark = range.createBookmark( true ),
				startNode = range.document.getById( bookmark.startNode ),
				startPath = new CKEDITOR.dom.elementPath( startNode.getParent() );

			if ( range.collapsed ) {
				/* 
				 * If the range is collapsed, try to remove the style from all ancestor
				 * elements, until either a block boundary is reached, or the style is
				 * removed.
				 */
				for ( var i = 0, element; i < startPath.elements.length && ( element = startPath.elements[ i ] ); i++ ) {
					if ( element == startPath.block || element == startPath.blockLimit )
						break;

					if ( this.checkElementRemovable( element ) ) {
						removeFromElement( this, element );
						break;
					}
				}
			} else {
				/*
				 * Now our range isn't collapsed. Lets walk from the start node to the end
				 * node via DFS and remove the styles one-by-one.
				 */
				var endNode = range.document.getById( bookmark.endNode ),
					endPath = new CKEDITOR.dom.elementPath( endNode.getParent() );
				currentNode = startNode;

				// Find out the ancestor that needs to be broken down at startNode and endNode.
				var breakStart = null,
					breakEnd = null;
				for ( var i = 0; i < startPath.elements.length; i++ ) {
					if ( this.checkElementRemovable( startPath.elements[ i ] ) ) {
						breakStart = startPath.elements[ i ];
						break;
					}
				}
				for ( var i = 0; i < endPath.elements.length; i++ ) {
					if ( this.checkElementRemovable( endPath.elements[ i ] ) ) {
						breakEnd = endPath.elements[ i ];
						break;
					}
				}

				if ( breakEnd )
					endNode.breakParent( breakEnd );
				if ( breakStart )
					startNode.breakParent( breakStart );

				// Now, do the DFS walk.
				while ( ( currentNode = currentNode.getNextSourceNode() ) && !currentNode.equals( endNode ) ) {
					if ( currentNode.type == CKEDITOR.NODE_ELEMENT )
						removeFromElement( this, currentNode );
				}
			}

			range.moveToBookmark( bookmark );
		};

	var applyBlockStyle = function( range ) {};

	// Removes a style from an element itself, don't care about its subtree.
	var removeFromElement = function( style, element ) {
			var def = style._.definition,
				attributes = def.attributes,
				styles = def.styles;

			for ( var attName in attributes ) {
				// The 'class' element value must match (#1318).
				if ( attName == 'class' && element.getAttribute( attName ) != attributes[ attName ] )
					continue;
				element.removeAttribute( attName );
			}

			for ( var styleName in styles )
				element.removeStyle( styleName );

			removeNoAttribsElement( element );
		};

	// Removes a style from inside an element.
	var removeFromInsideElement = function( style, element ) {
			var def = style._.definition;
			var attribs = def.attributes;
			var styles = def.styles;

			var innerElements = element.getElementsByTag( style.element );

			for ( var i = innerElements.count(); --i >= 0; )
				removeFromElement( style, innerElements.getItem( i ) );
		};

	// If the element has no more attributes, remove it.
	var removeNoAttribsElement = function( element ) {
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
		};

	// Get the the collection used to compare the attributes defined in this
	// style with attributes in an element. All information in it is lowercased.
	// V2
	//	var getAttribsForComparison = function( style )
	//	{
	//		// If we have already computed it, just return it.
	//		var attribs = style._.attribsForComparison;
	//		if ( attribs )
			//			return attribs;

	//		attribs = {};

	//		var def = style._.definition;

	//		// Loop through all defined attributes.
	//		var styleAttribs = def.attributes;
	//		if ( styleAttribs )
	//		{
	//			for ( var styleAtt in styleAttribs )
	//			{
	//				attribs[ styleAtt.toLowerCase() ] = styleAttribs[ styleAtt ].toLowerCase();
	//			}
	//		}

	//		// Includes the style definitions.
	//		if ( this._GetStyleText().length > 0 )
	//		{
	//			attribs['style'] = this._GetStyleText().toLowerCase();
	//		}

	//		// Appends the "length" information to the object.
	//		FCKTools.AppendLengthProperty( attribs, '_length' );

	//		// Return it, saving it to the next request.
	//		return ( this._GetAttribsForComparison_$ = attribs );
	//	},

	var mergeSiblings = function( element ) {
			if ( !element || element.type != CKEDITOR.NODE_ELEMENT || !CKEDITOR.dtd.$removeEmpty[ element.getName() ] )
				return;

			mergeElements( element, element.getNext(), true );
			mergeElements( element, element.getPrevious() );
		};

	var mergeElements = function( element, sibling, isNext ) {
			if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT ) {
				var hasBookmark = sibling.getAttribute( '_fck_bookmark' );

				if ( hasBookmark )
					sibling = isNext ? sibling.getNext() : sibling.getPrevious();

				if ( sibling && sibling.type == CKEDITOR.NODE_ELEMENT && sibling.getName() == element.getName() ) {
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
		};

	// Regex used to match all variables defined in an attribute or style
	// value. The variable name is returned with $2.
	var styleVariableAttNameRegex = /#\(\s*("|')(.+?)\1[^\)]*\s*\)/g;

	var getElement = function( style, targetDocument ) {
			var el;

			var def = style._.definition;
			var variables = style._.variables;

			var elementName = style.element;
			var attributes = def.attributes;
			var styles = def.styles;

			// The "*" element name will always be a span for this function.
			if ( elementName == '*' )
				elementName = 'span';

			// Create the element.
			el = new CKEDITOR.dom.element( elementName, targetDocument );

			// Assign all defined attributes.
			if ( attributes ) {
				for ( var att in attributes ) {
					var attValue = attributes[ att ];
					if ( attValue && variables ) {
						attValue = attValue.replace( styleVariableAttNameRegex, function() {
							// The second group in the regex is the variable name.
							return variables[ arguments[ 2 ] ] || arguments[ 0 ];
						});
					}
					el.setAttribute( att, attValue );
				}
			}

			// Assign all defined styles.
			if ( styles ) {
				for ( var styleName in styles )
					el.setStyle( styleName, styles[ styleName ] );

				if ( variables ) {
					attValue = el.getAttribute( 'style' ).replace( styleVariableAttNameRegex, function() {
						// The second group in the regex is the variable name.
						return variables[ arguments[ 2 ] ] || arguments[ 0 ];
					});
					el.setAttribute( 'style', attValue );
				}
			}

			return el;
		};
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
