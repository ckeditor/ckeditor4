﻿
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
	 * Walks up this element path to retrieve the matched element.
	 *
	 * @param {Object} query One or more element tag names to be checked.
	 * @param {Boolean} includeRoot Take path root element into consideration.
	 * @return {*} The first matched element if found.
	 */
	contains: function( query, includeRoot ) {
		// Normalize query param.
		var tags = {};
		if ( typeof query == 'string' )
			tags[ query ] = 1;
		else if ( CKEDITOR.tools.isArray( query ) )
			for ( var t = 0, l = query.length; t < l; t++ )
			tags[ query[ t ] ] = 1;
		else
			tags = query;

		var elements = this.elements,
			length = elements.length - 1;
		includeRoot && length++;
		for ( var i = 0; i < length; i++ ) {
			if ( elements[ i ].getName() in tags ) {
				if ( !( includeRoot && elements[ i ].equals( this.root ) ) )
					return elements[ i ];
			}
		}

		return null;
	}
};
