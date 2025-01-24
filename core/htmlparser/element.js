/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

'use strict';

/**
 * A lightweight representation of an HTML element.
 *
 * @class
 * @extends CKEDITOR.htmlParser.node
 * @constructor Creates an element class instance.
 * @param {String} name The element name.
 * @param {Object} attributes An object storing all attributes defined for
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
	 * Stores the attributes defined for this element.
	 *
	 * @property {Object}
	 */
	this.attributes = attributes || {};

	/**
	 * The nodes that are direct children of this element.
	 */
	this.children = [];

	// Reveal the real semantic of our internal custom tag name (https://dev.ckeditor.com/ticket/6639),
	// when resolving whether it's block like.
	var realName = name || '',
		prefixed = realName.match( /^cke:(.*)/ );
	prefixed && ( realName = prefixed[ 1 ] );

	var isBlockLike = !!( CKEDITOR.dtd.$nonBodyContent[ realName ] || CKEDITOR.dtd.$block[ realName ] ||
		CKEDITOR.dtd.$listItem[ realName ] || CKEDITOR.dtd.$tableContent[ realName ] ||
		CKEDITOR.dtd.$nonEditable[ realName ] || realName == 'br' );

	this.isEmpty = !!CKEDITOR.dtd.$empty[ name ];
	this.isUnknown = !CKEDITOR.dtd[ name ];

	/** @private */
	this._ = {
		isBlockLike: isBlockLike,
		hasInlineStarted: this.isEmpty || !isBlockLike
	};
};

/**
 * Object presentation of the CSS style declaration text.
 *
 * @class
 * @constructor Creates a `cssStyle` class instance.
 * @param {CKEDITOR.htmlParser.element/String} elementOrStyleText
 * An HTML parser element or the inline style text.
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
	} );

	return {

		rules: rules,

		/**
		 * Applies the styles to the specified element or object.
		 *
		 * @param {CKEDITOR.htmlParser.element/CKEDITOR.dom.element/Object} obj
		 */
		populate: function( obj ) {
			var style = this.toString();
			if ( style )
				obj instanceof CKEDITOR.dom.element ? obj.setAttribute( 'style', style ) : obj instanceof CKEDITOR.htmlParser.element ? obj.attributes.style = style : obj.style = style;

		},

		/**
		 * Serializes CSS style declaration to a string.
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
( function() {
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
		 * Clones this element.
		 *
		 * @returns {CKEDITOR.htmlParser.element} The element clone.
		 */
		clone: function() {
			return new CKEDITOR.htmlParser.element( this.name, this.attributes );
		},

		/**
		 * Filters this element and its children with the given filter.
		 *
		 * @since 4.1.0
		 * @param {CKEDITOR.htmlParser.filter} filter
		 * @returns {Boolean} The method returns `false` when this element has
		 * been removed or replaced with another. This information means that
		 * {@link #filterChildren} has to repeat the filter on the current
		 * position in parent's children array.
		 */
		filter: function( filter, context ) {
			var element = this,
				originalName, name;

			context = element.getFilterContext( context );

			// Filtering if it's the root node.
			if ( !element.parent )
				filter.onRoot( context, element );

			while ( true ) {
				originalName = element.name;

				if ( !( name = filter.onElementName( context, originalName ) ) ) {
					this.remove();
					return false;
				}

				element.name = name;

				if ( !( element = filter.onElement( context, element ) ) ) {
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
					if ( !( newAttrName = filter.onAttributeName( context, a ) ) ) {
						delete attributes[ a ];
						break;
					} else if ( newAttrName != a ) {
						delete attributes[ a ];
						a = newAttrName;
						continue;
					} else {
						break;
					}
				}

				if ( newAttrName ) {
					if ( ( value = filter.onAttribute( context, element, newAttrName, value ) ) === false )
						delete attributes[ newAttrName ];
					else
						attributes[ newAttrName ] = value;
				}
			}

			if ( !element.isEmpty )
				this.filterChildren( filter, false, context );

			return true;
		},

		/**
		 * Filters this element's children with the given filter.
		 *
		 * Element's children may only be filtered once by one
		 * instance of the filter.
		 *
		 * @method filterChildren
		 * @param {CKEDITOR.htmlParser.filter} filter
		 */
		filterChildren: fragProto.filterChildren,

		/**
		 * Writes the element HTML to the CKEDITOR.htmlWriter.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which HTML will be written.
		 * @param {CKEDITOR.htmlParser.filter} [filter] The filter to be applied to this node.
		 * **Note:** It is unsafe to filter an offline (not appended) node.
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
		 * Sends children of this element to the writer.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which HTML will be written.
		 * @param {CKEDITOR.htmlParser.filter} [filter]
		 */
		writeChildrenHtml: fragProto.writeChildrenHtml,

		/**
		 * Replaces this element with its children.
		 *
		 * @since 4.1.0
		 */
		replaceWithChildren: function() {
			var children = this.children;

			for ( var i = children.length; i; )
				children[ --i ].insertAfter( this );

			this.remove();
		},

		/**
		 * Executes a callback on each node (of the given type) in this element.
		 *
		 *		// Create a <p> element with foo<b>bar</b>bom as its content.
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
		 * @since 4.1.0
		 * @param {Function} callback Function to be executed on every node.
		 * **Since 4.3**: If `callback` returned `false`, the descendants of the current node will be ignored.
		 * @param {CKEDITOR.htmlParser.node} callback.node Node passed as an argument.
		 * @param {Number} [type] Whether the specified `callback` will be executed only on nodes of this type.
		 * @param {Boolean} [skipRoot] Do not execute `callback` on this element.
		 */
		forEach: fragProto.forEach,

		/**
		 * Gets this element's first child. If `condition` is given, this method returns
		 * the first child which satisfies that condition.
		 *
		 * @since 4.3.0
		 * @param {String/Object/Function} condition Name of a child, a hash of names, or a validator function.
		 * @returns {CKEDITOR.htmlParser.node}
		 */
		getFirst: function( condition ) {
			if ( !condition )
				return this.children.length ? this.children[ 0 ] : null;

			if ( typeof condition != 'function' )
				condition = nameCondition( condition );

			for ( var i = 0, l = this.children.length; i < l; ++i ) {
				if ( condition( this.children[ i ] ) )
					return this.children[ i ];
			}
			return null;
		},

		/**
		 * Gets this element's inner HTML.
		 *
		 * @since 4.3.0
		 * @returns {String}
		 */
		getHtml: function() {
			var writer = new CKEDITOR.htmlParser.basicWriter();
			this.writeChildrenHtml( writer );
			return writer.getHtml();
		},

		/**
		 * Sets this element's inner HTML.
		 *
		 * @since 4.3.0
		 * @param {String} html
		 */
		setHtml: function( html ) {
			var children = this.children = CKEDITOR.htmlParser.fragment.fromHtml( html ).children;

			for ( var i = 0, l = children.length; i < l; ++i )
				children[ i ].parent = this;
		},

		/**
		 * Gets this element's outer HTML.
		 *
		 * @since 4.3.0
		 * @returns {String}
		 */
		getOuterHtml: function() {
			var writer = new CKEDITOR.htmlParser.basicWriter();
			this.writeHtml( writer );
			return writer.getHtml();
		},

		/**
		 * Splits this element at the given index.
		 *
		 * @since 4.3.0
		 * @param {Number} index Index at which the element will be split &mdash; `0` means the beginning,
		 * `1` after the first child node, etc.
		 * @returns {CKEDITOR.htmlParser.element} The new element following this one.
		 */
		split: function( index ) {
			var cloneChildren = this.children.splice( index, this.children.length - index ),
				clone = this.clone();

			for ( var i = 0; i < cloneChildren.length; ++i )
				cloneChildren[ i ].parent = clone;

			clone.children = cloneChildren;

			if ( cloneChildren[ 0 ] )
				cloneChildren[ 0 ].previous = null;

			if ( index > 0 )
				this.children[ index - 1 ].next = null;

			this.parent.add( clone, this.getIndex() + 1 );

			return clone;
		},

		/**
		 * Searches through the current node children to find nodes matching the `criteria`.
		 *
		 * @param {String/Function} criteria Tag name or evaluator function.
		 * @param {Boolean} [recursive=false]
		 * @returns {CKEDITOR.htmlParser.node[]}
		 */
		find: function( criteria, recursive ) {
			if ( recursive === undefined ) {
				recursive = false;
			}

			var ret = [],
				i;

			for	( i = 0; i < this.children.length; i++ ) {
				var curChild = this.children[ i ];

				if ( typeof criteria == 'function' && criteria( curChild ) ) {
					ret.push( curChild );
				} else if ( typeof criteria == 'string' && curChild.name === criteria ) {
					ret.push( curChild );
				}

				if ( recursive && curChild.find ) {
					ret = ret.concat( curChild.find( criteria, recursive ) );
				}
			}

			return ret;
		},

		/**
		 * Searches through the children of the current element to find the first child matching the `criteria`.
		 *
		 * ```js
		 * element.findOne( function( child ) {
		 *     return child.name === 'span' || child.name === 'strong';
		 * } ); // Will return the first child which is a <span> or a <strong> element.
		 * ```
		 *
		 * @param {String/Function} criteria Tag name or evaluator function.
		 * @param {Boolean} [recursive=false] If set to `true`, it will iterate over all descendants. Otherwise the method will
		 * only iterate over direct children.
		 * @returns {CKEDITOR.htmlParser.node/null} The first matched child, `null` otherwise.
		 */
		findOne: function( criteria, recursive ) {
			var nestedMatch = null,
				match = CKEDITOR.tools.array.find( this.children, function( child ) {
					var isMatching = typeof criteria === 'function' ? criteria( child ) : child.name === criteria;

					if ( isMatching || !recursive ) {
						return isMatching;
					}

					if ( child.children && child.findOne ) {
						nestedMatch = child.findOne( criteria, true );
					}

					return !!nestedMatch;
				} );

			return nestedMatch || match || null;
		},

		/**
		 * Adds a class name to the list of classes.
		 *
		 * @since 4.4.0
		 * @param {String} className The class name to be added.
		 */
		addClass: function( className ) {
			if ( this.hasClass( className ) )
				return;

			var c = this.attributes[ 'class' ] || '';

			this.attributes[ 'class' ] = c + ( c ? ' ' : '' ) + className;
		},

		/**
		 * Removes a class name from the list of classes.
		 *
		 * @since 4.3.0
		 * @param {String} className The class name to be removed.
		 */
		removeClass: function( className ) {
			var classes = this.attributes[ 'class' ];

			if ( !classes )
				return;

			// We can safely assume that className won't break regexp.
			// http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-class-names
			classes = CKEDITOR.tools.trim( classes.replace( new RegExp( '(?:\\s+|^)' + className + '(?:\\s+|$)' ), ' ' ) );

			if ( classes )
				this.attributes[ 'class' ] = classes;
			else
				delete this.attributes[ 'class' ];
		},

		/**
		 * Checkes whether this element has a class name.
		 *
		 * @since 4.3.0
		 * @param {String} className The class name to be checked.
		 * @returns {Boolean} Whether this element has a `className`.
		 */
		hasClass: function( className ) {
			var classes = this.attributes[ 'class' ];

			if ( !classes )
				return false;

			return ( new RegExp( '(?:^|\\s)' + className + '(?=\\s|$)' ) ).test( classes );
		},

		getFilterContext: function( ctx ) {
			var changes = [];

			if ( !ctx ) {
				ctx = {
					nonEditable: false,
					nestedEditable: false
				};
			}

			if ( !ctx.nonEditable && this.attributes.contenteditable == 'false' )
				changes.push( 'nonEditable', true );
			// A context to be given nestedEditable must be nonEditable first (by inheritance) (https://dev.ckeditor.com/ticket/11372, https://dev.ckeditor.com/ticket/11698).
			// Special case: https://dev.ckeditor.com/ticket/11504 - filter starts on <body contenteditable=true>,
			// so ctx.nonEditable has not been yet set to true.
			else if ( ctx.nonEditable && !ctx.nestedEditable && this.attributes.contenteditable == 'true' )
				changes.push( 'nestedEditable', true );

			if ( changes.length ) {
				ctx = CKEDITOR.tools.copy( ctx );
				for ( var i = 0; i < changes.length; i += 2 )
					ctx[ changes[ i ] ] = changes[ i + 1 ];
			}

			return ctx;
		}
	}, true );

	function nameCondition( condition ) {
		return function( el ) {
			return el.type == CKEDITOR.NODE_ELEMENT &&
				( typeof condition == 'string' ? el.name == condition : el.name in condition );
		};
	}
} )();
