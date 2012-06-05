/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	// Elements that may be considered the "Block boundary" in an element path.
	var pathBlockElements = { address:1,blockquote:1,dl:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,li:1,dt:1,dd:1,legend:1,caption:1 };

	// Elements that may be considered the "Block limit" in an element path.
	var pathBlockLimitElements = { body:1,div:1,table:1,tbody:1,tr:1,td:1,th:1,form:1,fieldset:1 };

	// Check if an element contains any block element.
	var checkHasBlock = function( element ) {
			var childNodes = element.getChildren();

			for ( var i = 0, count = childNodes.count(); i < count; i++ ) {
				var child = childNodes.getItem( i );

				if ( child.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[ child.getName() ] )
					return true;
			}

			return false;
		};

	/**
	 * 	Retrieve the list of nodes walked from the start node up to the editable element of the editor.
	 * @name CKEDITOR.dom.elementPath
	 * @param {CKEDITOR.dom.element} startNode From which the path should start.
	 * @param {CKEDITOR.dom.element} root To which element the path should stop, default to the body element.
	 * @class
	 */
	CKEDITOR.dom.elementPath = function( startNode, root ) {
		var block = null;
		var blockLimit = null;
		var elements = [];

		// Backward compact.
		root = root || startNode.getDocument().getBody();

		var e = startNode;

		while ( e ) {
			if ( e.type == CKEDITOR.NODE_ELEMENT ) {
				if ( !this.lastElement )
					this.lastElement = e;

				var elementName = e.getName();

				if ( !blockLimit ) {
					if ( !block && pathBlockElements[ elementName ] )
						block = e;

					if ( pathBlockLimitElements[ elementName ] ) {
						// End level DIV is considered as the block, if no block is available. (#525)
						// But it must NOT be as the root element.
						if ( !block && elementName == 'div' && !checkHasBlock( e ) && !e.equals( root ) ) {
							block = e;
						} else
							blockLimit = e;
					}
				}

				elements.push( e );

				if ( e.equals( root ) )
					break;
			}
			e = e.getParent();
		}

		this.block = block;
		this.blockLimit = blockLimit;
		this.elements = elements;
	};

})();

CKEDITOR.dom.elementPath.prototype = {
	/**
	 * Compares this element path with another one.
	 * @param {CKEDITOR.dom.elementPath} otherPath The elementPath object to be
	 * compared with this one.
	 * @returns {Boolean} "true" if the paths are equal, containing the same
	 * number of elements and the same elements in the same order.
	 */
	compare: function( otherPath ) {
		var thisElements = this.elements;
		var otherElements = otherPath && otherPath.elements;

		if ( !otherElements || thisElements.length != otherElements.length )
			return false;

		for ( var i = 0; i < thisElements.length; i++ ) {
			if ( !thisElements[ i ].equals( otherElements[ i ] ) )
				return false;
		}

		return true;
	},

	/**
	 * Search the path elements that meets the specified criteria.
	 * @param {*} query The criteria that can be either a tag name, list of tag names, or an node evaluator function.
	 * @param {Boolean} excludeRoot Not taking path root element into consideration.
	 * @param {Boolean} fromTop Search start from the topmost element instead of bottom.
	 * @return {CKEDITOR.dom.element} The first matched dom element.
	 */
	contains: function( query, excludeRoot, fromTop ) {
		var evaluator;
		if ( typeof query == 'string' )
			evaluator = function( node ) {
			return node.getName() == query;
		};
		if ( query instanceof CKEDITOR.dom.element )
			evaluator = function( node ) {
			return node.equals( query );
		};
		else if ( CKEDITOR.tools.isArray( query ) )
			evaluator = function( node ) {
			query.indexOf( node.getName() ) > -1;
		};
		else if ( typeof query == 'function' )
			evaluator = query;
		else if ( typeof query == 'object' )
			evaluator = function( node ) {
			return node.getName() in query;
		};

		var elements = this.elements,
			length = elements.length;
		excludeRoot && length--;

		if ( fromTop ) {
			elements = Array.prototype.slice.call( elements, 0 );
			elements.reverse();
		}

		for ( var i = 0; i < length; i++ ) {
			if ( evaluator( elements[ i ] ) )
				return elements[ i ];
		}

		return null;
	}
};
