/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * A lightweight representation of an HTML element.
 * @param {String} name The element name.
 * @param {Object} attributes And object holding all attributes defined for
 *		this element.
 * @constructor
 * @example
 */
CKEDITOR.htmlParser.element = function( name, attributes ) {
	if ( attributes._cke_saved_src )
		attributes.src = attributes._cke_saved_src;

	if ( attributes._cke_saved_href )
		attributes.href = attributes._cke_saved_href;

	/**
	 * The element name.
	 * @type String
	 * @example
	 */
	this.name = name;

	/**
	 * Holds the attributes defined for this element.
	 * @type Object
	 * @example
	 */
	this.attributes = attributes;

	/**
	 * The nodes that are direct children of this element.
	 * @type Array
	 * @example
	 */
	this.children = [];

	var dtd = CKEDITOR.dtd,
		isBlockLike = !!( dtd.$block[ name ] || dtd.$listItem[ name ] || dtd.$tableContent[ name ] ),
		isEmpty = !!dtd.$empty[ name ];

	this.isEmpty = isEmpty;
	this.isUnknown = !dtd[ name ];

	/** @private */
	this._ = {
		isBlockLike: isBlockLike,
		hasInlineStarted: isEmpty || !isBlockLike
	};
};

(function() {
	// Used to sort attribute entries in an array, where the first element of
	// each object is the attribute name.
	var sortAttribs = function( a, b ) {
			a = a[ 0 ];
			b = b[ 0 ];
			return a < b ? -1 : a > b ? 1 : 0;
		};

	var ckeAttrRegex = /^_cke/,
		ckeClassRegex = /(^|\s+)cke_[^\s]*/g;

	CKEDITOR.htmlParser.element.prototype = {
		/**
		 * The node type. This is a constant value set to {@link CKEDITOR.NODE_ELEMENT}.
		 * @type Number
		 * @example
		 */
		type: CKEDITOR.NODE_ELEMENT,

		/**
		 * Adds a node to the element children list.
		 * @param {Object} node The node to be added. It can be any of of the
		 *		following types: {@link CKEDITOR.htmlParser.element},
		 *		{@link CKEDITOR.htmlParser.text} and
		 *		{@link CKEDITOR.htmlParser.comment}.
		 * @function
		 * @example
		 */
		add: CKEDITOR.htmlParser.fragment.prototype.add,

		/**
		 * Clone this element.
		 * @returns {CKEDITOR.htmlParser.element} The element clone.
		 * @example
		 */
		clone: function() {
			return new CKEDITOR.htmlParser.element( this.name, this.attributes );
		},

		/**
		 * Writes the element HTML to a CKEDITOR.htmlWriter.
		 * @param {CKEDITOR.htmlWriter} writer The writer to which write the HTML.
		 * @example
		 */
		writeHtml: function( writer ) {
			var attributes = this.attributes;

			// The "_cke_realelement" attribute indicates that the current
			// element is a placeholder for another element.
			if ( attributes._cke_realelement ) {
				var realFragment = new CKEDITOR.htmlParser.fragment.fromHtml( decodeURIComponent( attributes._cke_realelement ) );
				realFragment.writeHtml( writer );
				return;
			}

			// The "_cke_replacedata" indicates that this element is replacing
			// a data snippet, which should be outputted as is.
			if ( attributes._cke_replacedata ) {
				writer.write( attributes._cke_replacedata );
				return;
			}

			// Open element tag.
			writer.openTag( this.name, this.attributes );

			// Copy all attributes to an array.
			var attribsArray = [];
			for ( var a in attributes ) {
				// Ignore all attributes starting with "_cke".
				if ( ckeAttrRegex.test( a ) )
					continue;

				// Ignore all cke_* CSS classes.
				if ( a.toLowerCase() == 'class' ) {
					this.attributes[ a ] = CKEDITOR.tools.ltrim( this.attributes[ a ].replace( ckeClassRegex, '' ) );
					if ( this.attributes[ a ] == '' )
						continue;
				}

				attribsArray.push( [ a, this.attributes[ a ] ] );
			}

			// Sort the attributes by name.
			attribsArray.sort( sortAttribs );

			// Send the attributes.
			for ( var i = 0, len = attribsArray.length; i < len; i++ ) {
				var attrib = attribsArray[ i ];
				writer.attribute( attrib[ 0 ], attrib[ 1 ] );
			}

			// Close the tag.
			writer.openTagClose( this.name, this.isEmpty );

			if ( !this.isEmpty ) {
				// Send children.
				CKEDITOR.htmlParser.fragment.prototype.writeHtml.apply( this, arguments );

				// Close the element.
				writer.closeTag( this.name );
			}
		}
	};
})();
