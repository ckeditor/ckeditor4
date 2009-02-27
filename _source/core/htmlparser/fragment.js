/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * A lightweight representation of an HTML DOM structure.
 * @constructor
 * @example
 */
CKEDITOR.htmlParser.fragment = function() {
	/**
	 * The nodes contained in the root of this fragment.
	 * @type Array
	 * @example
	 * var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<b>Sample</b> Text' );
	 * alert( fragment.children.length );  "2"
	 */
	this.children = [];

	/**
	 * Get the fragment parent. Should always be null.
	 * @type Object
	 * @default null
	 * @example
	 */
	this.parent = null;

	/** @private */
	this._ = {
		isBlockLike: true,
		hasInlineStarted: false
	};
};

(function() {
	// Elements which the end tag is marked as optional in the HTML 4.01 DTD
	// (expect empty elements).
	var optionalClose = { colgroup:1,dd:1,dt:1,li:1,option:1,p:1,td:1,tfoot:1,th:1,thead:1,tr:1 };

	/**
	 * Creates a {@link CKEDITOR.htmlParser.fragment} from an HTML string.
	 * @param {String} fragmentHtml The HTML to be parsed, filling the fragment.
	 * @returns CKEDITOR.htmlParser.fragment The fragment created.
	 * @example
	 * var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<b>Sample</b> Text' );
	 * alert( fragment.children[0].name );  "b"
	 * alert( fragment.children[1].value );  " Text"
	 */
	CKEDITOR.htmlParser.fragment.fromHtml = function( fragmentHtml ) {
		var parser = new CKEDITOR.htmlParser(),
			html = [],
			fragment = new CKEDITOR.htmlParser.fragment(),
			pendingInline = [],
			currentNode = fragment;

		var checkPending = function( newTagName ) {
				if ( pendingInline.length > 0 ) {
					for ( var i = 0; i < pendingInline.length; i++ ) {
						var pendingElement = pendingInline[ i ],
							pendingName = pendingElement.name,
							pendingDtd = CKEDITOR.dtd[ pendingName ],
							currentDtd = currentNode.name && CKEDITOR.dtd[ currentNode.name ];

						if ( ( !currentDtd || currentDtd[ pendingName ] ) && ( !newTagName || !pendingDtd || pendingDtd[ newTagName ] || !CKEDITOR.dtd[ newTagName ] ) ) {
							// Get a clone for the pending element.
							pendingElement = pendingElement.clone();

							// Add it to the current node and make it the current,
							// so the new element will be added inside of it.
							currentNode.add( pendingElement );
							currentNode = pendingElement;

							// Remove the pending element (back the index by one
							// to properly process the next entry).
							pendingInline.splice( i, 1 );
							i--;
						}
					}
				}
			};

		parser.onTagOpen = function( tagName, attributes, selfClosing ) {
			// If the tag name is ?xml:namespace, ignore.
			if ( tagName == '?xml:namespace' )
				return;

			var element = new CKEDITOR.htmlParser.element( tagName, attributes );

			// "isEmpty" will be always "false" for unknown elements, so we
			// must force it if the parser has identified it as a selfClosing tag.
			if ( element.isUnknown && selfClosing )
				element.isEmpty = true;

			// This is a tag to be removed if empty, so do not add it immediately.
			if ( CKEDITOR.dtd.$removeEmpty[ tagName ] ) {
				pendingInline.push( element );
				return;
			}

			var currentName = currentNode.name,
				currentDtd = ( currentName && CKEDITOR.dtd[ currentName ] ) || ( currentNode._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span );

			// If the element cannot be child of the current element.
			if ( !element.isUnknown && !currentNode.isUnknown && !currentDtd[ tagName ] ) {
				// If this is the fragment node, just ignore this tag and add
				// its children.
				if ( !currentName )
					return;

				var reApply = false;

				// If the element name is the same as the current element name,
				// then just close the current one and append the new one to the
				// parent. This situation usually happens with <p>, <li>, <dt> and
				// <dd>, specially in IE.
				if ( tagName != currentName ) {
					// If it is optional to close the current element, then
					// close it at this point and simply add the new
					// element after it.
					if ( !optionalClose[ currentName ] ) {
						// The current element is an inline element, which
						// cannot hold the new one. Put it in the pending list,
						// and try adding the new one after it.
						pendingInline.unshift( currentNode );
					}

					reApply = true;
				}

				// In any of the above cases, we'll be adding, or trying to
				// add it to the parent.
				currentNode = currentNode.parent;

				if ( reApply ) {
					parser.onTagOpen.apply( this, arguments );
					return;
				}
			}

			checkPending( tagName );

			currentNode.add( element );

			if ( !element.isEmpty )
				currentNode = element;
		};

		parser.onTagClose = function( tagName ) {
			var closingElement = currentNode,
				index = 0;

			while ( closingElement && closingElement.name != tagName ) {
				// If this is an inline element, add it to the pending list, so
				// it will continue after the closing tag.
				if ( !closingElement._.isBlockLike ) {
					pendingInline.unshift( closingElement );

					// Increase the index, so it will not get checked again in
					// the pending list check that follows.
					index++;
				}

				closingElement = closingElement.parent;
			}

			if ( closingElement )
				currentNode = closingElement.parent;
			else if ( pendingInline.length > index ) {
				// If we didn't find any parent to be closed, let's check the
				// pending list.
				for ( ; index < pendingInline.length; index++ ) {
					// If found, just remove it from the list.
					if ( tagName == pendingInline[ index ].name ) {
						pendingInline.splice( index, 1 );

						// Decrease the index so we continue from the next one.
						index--;
					}
				}
			}
		};

		parser.onText = function( text ) {
			if ( !currentNode._.hasInlineStarted ) {
				text = CKEDITOR.tools.ltrim( text );

				if ( text.length === 0 )
					return;
			}

			checkPending();
			currentNode.add( new CKEDITOR.htmlParser.text( text ) );
		};

		parser.onComment = function( comment ) {
			currentNode.add( new CKEDITOR.htmlParser.comment( comment ) );
		};

		parser.parse( fragmentHtml );

		return fragment;
	};

	CKEDITOR.htmlParser.fragment.prototype = {
		/**
		 * Adds a node to this fragment.
		 * @param {Object} node The node to be added. It can be any of of the
		 *		following types: {@link CKEDITOR.htmlParser.element},
		 *		{@link CKEDITOR.htmlParser.text} and
		 *		{@link CKEDITOR.htmlParser.comment}.
		 * @example
		 */
		add: function( node ) {
			var len = this.children.length,
				previous = len > 0 && this.children[ len - 1 ] || null;

			if ( previous ) {
				// If the block to be appended is following text, trim spaces at
				// the right of it.
				if ( node._.isBlockLike && previous.type == CKEDITOR.NODE_TEXT ) {
					previous.value = CKEDITOR.tools.rtrim( previous.value );

					// If we have completely cleared the previous node.
					if ( previous.value.length === 0 ) {
						// Remove it from the list and add the node again.
						this.children.pop();
						this.add( node );
						return;
					}
				}

				previous.next = node;
			}

			node.previous = previous;
			node.parent = this;

			this.children.push( node );

			this._.hasInlineStarted = node.type == CKEDITOR.NODE_TEXT || ( node.type == CKEDITOR.NODE_ELEMENT && !node._.isBlockLike );
		},

		/**
		 * Writes the fragment HTML to a CKEDITOR.htmlWriter.
		 * @param {CKEDITOR.htmlWriter} writer The writer to which write the HTML.
		 * @example
		 * var writer = new CKEDITOR.htmlWriter();
		 * var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '&lt;P&gt;&lt;B&gt;Example' );
		 * fragment.writeHtml( writer )
		 * alert( writer.getHtml() );  "&lt;p&gt;&lt;b&gt;Example&lt;/b&gt;&lt;/p&gt;"
		 */
		writeHtml: function( writer ) {
			for ( var i = 0, len = this.children.length; i < len; i++ )
				this.children[ i ].writeHtml( writer );
		}
	};
})();
