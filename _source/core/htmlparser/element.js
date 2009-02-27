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

	// IE outputs style attribute in capital letters. We should convert them
	// back to lower case.
	if ( CKEDITOR.env.ie && attributes.style )
		attributes.style = attributes.style.toLowerCase();

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
		ckeNamespaceRegex = /^cke:/,
		ckeStyleWidthRegex = /width\s*:\s*(\d+)/i,
		ckeStyleHeightRegex = /height\s*:\s*(\d+)/i,
		ckeClassRegex = /(?:^|\s+)cke_[^\s]*/g,
		ckePrivateAttrRegex = /^_cke_pa_/;

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

				// If _cke_resizable is set, and the fake element contains inline CSS width
				// and height; then sync the width and height to the real element.
				if ( attributes._cke_resizable && ( 'style' in attributes ) ) {
					var match = ckeStyleWidthRegex.exec( attributes.style ),
						width = match ? match[ 1 ] : null;
					match = ckeStyleHeightRegex.exec( attributes.style );
					var height = match ? match[ 1 ] : null;

					var targetElement = realFragment.children[ 0 ];
					if ( targetElement && ( width != null || height != null ) ) {
						targetElement.attributes.width = width;
						targetElement.attributes.height = height;

						// Special case for #2916: If there's an EMBED inside an OBJECT, we need
						// to set the EMBED's dimensions as well.
						if ( targetElement.name == 'cke:object' ) {
							for ( var i = 0; i < targetElement.children.length; i++ ) {
								var child = targetElement.children[ i ];
								if ( child.name == 'cke:embed' ) {
									child.attributes.width = width;
									child.attributes.height = height;
									break;
								}
							}
						}
					}
				}

				realFragment.writeHtml( writer );
				return;
			}

			// The "_cke_replacedata" indicates that this element is replacing
			// a data snippet, which should be outputted as is.
			if ( attributes._cke_replacedata ) {
				writer.write( attributes._cke_replacedata );
				return;
			}

			// Ignore cke: prefixes when writing HTML.
			var writeName = this.name.replace( ckeNamespaceRegex, '' );

			// Open element tag.
			writer.openTag( writeName, this.attributes );

			// Copy all attributes to an array.
			var attribsArray = [];
			for ( var a in attributes ) {
				var value = attributes[ a ];

				// If the attribute name is _cke_pa_*, strip away the _cke_pa part.
				a = a.replace( ckePrivateAttrRegex, '' );

				// Ignore all attributes starting with "_cke".
				if ( ckeAttrRegex.test( a ) )
					continue;

				// Ignore all cke_* CSS classes.
				if ( a.toLowerCase() == 'class' ) {
					value = CKEDITOR.tools.ltrim( value.replace( ckeClassRegex, '' ) );
					if ( value == '' )
						continue;
				}

				attribsArray.push( [ a, value ] );
			}

			// Sort the attributes by name.
			attribsArray.sort( sortAttribs );

			// Send the attributes.
			for ( var i = 0, len = attribsArray.length; i < len; i++ ) {
				var attrib = attribsArray[ i ];
				writer.attribute( attrib[ 0 ], attrib[ 1 ] );
			}

			// Close the tag.
			writer.openTagClose( writeName, this.isEmpty );

			if ( !this.isEmpty ) {
				// Send children.
				CKEDITOR.htmlParser.fragment.prototype.writeHtml.apply( this, arguments );

				// Close the element.
				writer.closeTag( writeName );
			}
		}
	};
})();
