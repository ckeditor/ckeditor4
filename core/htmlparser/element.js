/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

 'use strict';

/**
 * A lightweight representation of an HTML element.
 *
 * @class
 * @extends CKEDITOR.htmlParser.node
 * @constructor Creates an element class instance.
 * @param {String} name The element name.
 * @param {Object} attributes And object holding all attributes defined for
 * this element.
 */
CKEDITOR.htmlParser.element = function( name, attributes ) {
	/**
	 * The element name.
	 *
	 * @property {String}
	 */
	this.name = name;

	/**
	 * Holds the attributes defined for this element.
	 *
	 * @property {Object}
	 */
	this.attributes = attributes || {};

	/**
	 * The nodes that are direct children of this element.
	 */
	this.children = [];

	// Reveal the real semantic of our internal custom tag name (#6639),
	// when resolving whether it's block like.
	var realName = name || '',
		prefixed = realName.match( /^cke:(.*)/ );
	prefixed && ( realName = prefixed[ 1 ] );

	var isBlockLike = !!( CKEDITOR.dtd.$nonBodyContent[ realName ] || CKEDITOR.dtd.$block[ realName ] || CKEDITOR.dtd.$listItem[ realName ] || CKEDITOR.dtd.$tableContent[ realName ] || CKEDITOR.dtd.$nonEditable[ realName ] || realName == 'br' );

	this.isEmpty = !!CKEDITOR.dtd.$empty[ name ];
	this.isUnknown = !CKEDITOR.dtd[ name ];

	/** @private */
	this._ = {
		isBlockLike: isBlockLike,
		hasInlineStarted: this.isEmpty || !isBlockLike
	};
};

/**
 * Object presentation of CSS style declaration text.
 *
 * @class
 * @constructor Creates a cssStyle class instance.
 * @param {CKEDITOR.htmlParser.element/String} elementOrStyleText
 * A html parser element or the inline style text.
 */
CKEDITOR.htmlParser.cssStyle = function() {
	var styleText,
		arg = arguments[ 0 ],
		rules = {};

	styleText = arg instanceof CKEDITOR.htmlParser.element ? arg.attributes.style : arg;

	// html-encoded quote might be introduced by 'font-family'
	// from MS-Word which confused the following regexp. e.g.
	//'font-family: &quot;Lucida, Console&quot;'
	// TODO reuse CSS methods from tools.
	( styleText || '' ).replace( /&quot;/g, '"' ).replace( /\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function( match, name, value ) {
		name == 'font-family' && ( value = value.replace( /["']/g, '' ) );
		rules[ name.toLowerCase() ] = value;
	});

	return {

		rules: rules,

		/**
		 * Apply the styles onto the specified element or object.
		 *
		 * @param {CKEDITOR.htmlParser.element/CKEDITOR.dom.element/Object} obj
		 */
		populate: function( obj ) {
			var style = this.toString();
			if ( style ) {
				obj instanceof CKEDITOR.dom.element ? obj.setAttribute( 'style', style ) : obj instanceof CKEDITOR.htmlParser.element ? obj.attributes.style = style : obj.style = style;
			}
		},

		/**
		 * Serialize CSS style declaration to string.
		 *
		 * @returns {String}
		 */
		toString: function() {
			var output = [];
			for ( var i in rules )
				rules[ i ] && output.push( i, ':', rules[ i ], ';' );
			return output.join( '' );
		}
	};
};

/** @class CKEDITOR.htmlParser.element */
(function() {
	// Used to sort attribute entries in an array, where the first element of
	// each object is the attribute name.
	var sortAttribs = function( a, b ) {
			a = a[ 0 ];
			b = b[ 0 ];
			return a < b ? -1 : a > b ? 1 : 0;
		},
		fragProto = CKEDITOR.htmlParser.fragment.prototype;

	CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend( new CKEDITOR.htmlParser.node(), {
		/**
		 * The node type. This is a constant value set to {@link CKEDITOR#NODE_ELEMENT}.
		 *
		 * @readonly
		 * @property {Number} [=CKEDITOR.NODE_ELEMENT]
		 */
		type: CKEDITOR.NODE_ELEMENT,

		/**
		 * Adds a node to the element children list.
		 *
		 * @method
		 * @param {CKEDITOR.htmlParser.node} node The node to be added.
		 * @param {Number} [index] From where the insertion happens.
		 */
		add: fragProto.add,

		/**
		 * Clone this element.
		 *
		 * @returns {CKEDITOR.htmlParser.element} The element clone.
		 */
		clone: function() {
			return new CKEDITOR.htmlParser.element( this.name, this.attributes );
		},

		/**
		 * Filter this element and its children with given filter.
		 *
		 * @since 4.1
		 * @param {CKEDITOR.htmlParser.filter} filter
		 * @returns {Boolean} Method returns `false` when this element has
		 * been removed or replaced with other. This is an information for
		 * {@link #filterChildren} that it has to repeat filter on current
		 * position in parent's children array.
		 */
		filter: function( filter ) {
			var element = this,
				originalName, name;

			// Filtering if it's the root node.
			if ( !element.parent )
				filter.onRoot( element );

			while ( true ) {
				originalName = element.name;

				if ( !( name = filter.onElementName( originalName ) ) ) {
					this.remove();
					return false;
				}

				element.name = name;

				if ( !( element = filter.onElement( element ) ) ) {
					this.remove();
					return false;
				}

				// New element has been returned - replace current one
				// and process it (stop processing this and return false, what
				// means that element has been removed).
				if ( element !== this ) {
					this.replaceWith( element );
					return false;
				}

				// If name has been changed - continue loop, so in next iteration
				// filters for new name will be applied to this element.
				// If name hasn't been changed - stop.
				if ( element.name == originalName )
					break;

				// If element has been replaced with something of a
				// different type, then make the replacement filter itself.
				if ( element.type != CKEDITOR.NODE_ELEMENT ) {
					this.replaceWith( element );
					return false;
				}

				// This indicate that the element has been dropped by
				// filter but not the children.
				if ( !element.name ) {
					this.replaceWithChildren();
					return false;
				}
			}

			var attributes = element.attributes,
				a, value, newAttrName;

			for ( a in attributes ) {
				newAttrName = a;
				value = attributes[ a ];

				// Loop until name isn't modified.
				// A little bit senseless, but IE would do that anyway
				// because it iterates with for-in loop even over properties
				// created during its run.
				while ( true ) {
					if ( !( newAttrName = filter.onAttributeName( a ) ) ) {
						delete attributes[ a ];
						break;
					} else if ( newAttrName != a ) {
						delete attributes[ a ];
						a = newAttrName;
						continue;
					} else
						break;
				}

				if ( newAttrName ) {
					if ( ( value = filter.onAttribute( element, newAttrName, value ) ) === false )
						delete attributes[ newAttrName ];
					else
						attributes[ newAttrName ] = value;
				}
			}

			if ( !element.isEmpty )
				this.filterChildren( filter );

			return true;
		},

		/**
		 * Filter this element's children with given filter.
		 *
		 * Element's children may only be filtered once by one
		 * instance of filter.
		 *
		 * @method filterChildren
		 * @param {CKEDITOR.htmlParser.filter} filter
		 */
		filterChildren: fragProto.filterChildren,

		/**
		 * Writes the element HTML to a CKEDITOR.htmlWriter.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
		 * @param {CKEDITOR.htmlParser.filter} [filter] The filter to be applied to this node.
		 * **Note:** it's unsafe to filter offline (not appended) node.
		 */
		writeHtml: function( writer, filter ) {
			if ( filter )
				this.filter( filter );

			var name = this.name,
				attribsArray = [],
				attributes = this.attributes,
				attrName,
				attr, i, l;

			// Open element tag.
			writer.openTag( name, attributes );

			// Copy all attributes to an array.
			for ( attrName in attributes )
				attribsArray.push( [ attrName, attributes[ attrName ] ] );

			// Sort the attributes by name.
			if ( writer.sortAttributes )
				attribsArray.sort( sortAttribs );

			// Send the attributes.
			for ( i = 0, l = attribsArray.length; i < l; i++ ) {
				attr = attribsArray[ i ];
				writer.attribute( attr[ 0 ], attr[ 1 ] );
			}

			// Close the tag.
			writer.openTagClose( name, this.isEmpty );

			this.writeChildrenHtml( writer );

			// Close the element.
			if ( !this.isEmpty )
				writer.closeTag( name );
		},

		/**
		 * Send children of this element to the writer.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
		 * @param {CKEDITOR.htmlParser.filter} [filter]
		 */
		writeChildrenHtml: fragProto.writeChildrenHtml,

		/**
		 * Replace this element with its children.
		 *
		 * @since 4.1
		 */
		replaceWithChildren: function() {
			var children = this.children;

			for ( var i = children.length; i; )
				children[ --i ].insertAfter( this );

			this.remove();
		},

		/**
		 * Execute callback on each node (of given type) in this element.
		 *
		 *		// Create <p> element with foo<b>bar</b>bom as its content.
		 *		var elP = CKEDITOR.htmlParser.fragment.fromHtml( 'foo<b>bar</b>bom', 'p' );
		 *		elP.forEach( function( node ) {
		 *			console.log( node );
		 *		} );
		 *		// Will log:
		 *		// 1. document fragment,
		 *		// 2. <p> element,
		 *		// 3. "foo" text node,
		 *		// 4. <b> element,
		 *		// 5. "bar" text node,
		 *		// 6. "bom" text node.
		 *
		 * @since 4.1
		 * @param {Function} callback Function to be executed on every node.
		 * @param {CKEDITOR.htmlParser.node} callback.node Node passed as argument.
		 * @param {Number} [type] If specified `callback` will be executed only on nodes of this type.
		 * @param {Boolean} [skipRoot] Don't execute `callback` on this element.
		 */
		forEach: fragProto.forEach
	} );
})();
