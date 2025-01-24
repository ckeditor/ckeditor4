/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * Provides an "event like" system to parse strings of HTML data.
 *
 *		var parser = new CKEDITOR.htmlParser();
 *		parser.onTagOpen = function( tagName, attributes, selfClosing ) {
 *			alert( tagName );
 *		};
 *		parser.parse( '<p>Some <b>text</b>.</p>' ); // Alerts 'p', 'b'.
 *
 * @class
 * @constructor Creates a htmlParser class instance.
 */
CKEDITOR.htmlParser = function() {
	this._ = {
		htmlPartsRegex: /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)--!?>)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g
	};
};

( function() {
	var attribsRegex = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
		emptyAttribs = { checked: 1, compact: 1, declare: 1, defer: 1, disabled: 1, ismap: 1, multiple: 1, nohref: 1, noresize: 1, noshade: 1, nowrap: 1, readonly: 1, selected: 1 };

	CKEDITOR.htmlParser.prototype = {
		/**
		 * Function to be fired when a tag opener is found. This function
		 * should be overriden when using this class.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		parser.onTagOpen = function( tagName, attributes, selfClosing ) {
		 *			alert( tagName ); // e.g. 'b'
		 *		} );
		 *		parser.parse( '<!-- Example --><b>Hello</b>' );
		 *
		 * @param {String} tagName The tag name. The name is guarantted to be lowercased.
		 * @param {Object} attributes An object containing all tag attributes. Each
		 * property in this object represent and attribute name and its value is the attribute value.
		 * @param {Boolean} selfClosing `true` if the tag closes itself, false if the tag doesn't.
		 */
		onTagOpen: function() {},

		/**
		 * Function to be fired when a tag closer is found. This function
		 * should be overriden when using this class.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		parser.onTagClose = function( tagName ) {
		 *			alert( tagName ); // 'b'
		 *		} );
		 *		parser.parse( '<!-- Example --><b>Hello</b>' );
		 *
		 * @param {String} tagName The tag name. The name is guarantted to be lowercased.
		 */
		onTagClose: function() {},

		/**
		 * Function to be fired when text is found. This function
		 * should be overriden when using this class.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		parser.onText = function( text ) {
		 *			alert( text ); // 'Hello'
		 *		} );
		 *		parser.parse( '<!-- Example --><b>Hello</b>' );
		 *
		 * @param {String} text The text found.
		 */
		onText: function() {},

		/**
		 * Function to be fired when CDATA section is found. This function
		 * should be overriden when using this class.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		parser.onCDATA = function( cdata ) {
		 *			alert( cdata ); // 'var hello;'
		 *		} );
		 *		parser.parse( '<script>var hello;</script>' );
		 *
		 * @param {String} cdata The CDATA been found.
		 */
		onCDATA: function() {},

		/**
		 * Function to be fired when a commend is found. This function
		 * should be overriden when using this class.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		parser.onComment = function( comment ) {
		 *			alert( comment ); // ' Example '
		 *		} );
		 *		parser.parse( '<!-- Example --><b>Hello</b>' );
		 *
		 * @param {String} comment The comment text.
		 */
		onComment: function() {},

		/**
		 * Parses text, looking for HTML tokens, like tag openers or closers,
		 * or comments. This function fires the onTagOpen, onTagClose, onText
		 * and onComment function during its execution.
		 *
		 *		var parser = new CKEDITOR.htmlParser();
		 *		// The onTagOpen, onTagClose, onText and onComment should be overriden
		 *		// at this point.
		 *		parser.parse( '<!-- Example --><b>Hello</b>' );
		 *
		 * @param {String} html The HTML to be parsed.
		 */
		parse: function( html ) {
			var parts, tagName,
				nextIndex = 0,
				cdata; // The collected data inside a CDATA section.

			while ( ( parts = this._.htmlPartsRegex.exec( html ) ) ) {
				var tagIndex = parts.index;
				if ( tagIndex > nextIndex ) {
					var text = html.substring( nextIndex, tagIndex );

					this.onText( text );
				}

				nextIndex = this._.htmlPartsRegex.lastIndex;

				// "parts" is an array with the following items:
				//		0 : The entire match for opening/closing tags and comments.
				//		  : Group filled with the tag name for closing tags.
				//		2 : Group filled with the comment text.
				//		3 : Group filled with the tag name for opening tags.
				//		4 : Group filled with the attributes part of opening tags.

				// Closing tag
				if ( ( tagName = parts[ 1 ] ) ) {
					tagName = tagName.toLowerCase();

					if ( cdata && CKEDITOR.dtd.$cdata[ tagName ] ) {
						// Send the CDATA data.
						this.onCDATA( cdata );
						cdata = null;
					}

					if ( !cdata ) {
						this.onTagClose( tagName );
						continue;
					}
				}

				// Opening tag
				if ( ( tagName = parts[ 3 ] ) ) {
					tagName = tagName.toLowerCase();

					// There are some tag names that can break things, so let's
					// simply ignore them when parsing. (https://dev.ckeditor.com/ticket/5224)
					if ( /="/.test( tagName ) ) {
						continue;
					}

					var attribs = {},
						attribMatch,
						attribsPart = parts[ 4 ],
						selfClosing = !!parts[ 5 ];

					if ( attribsPart ) {
						while ( ( attribMatch = attribsRegex.exec( attribsPart ) ) ) {
							var attName = attribMatch[ 1 ].toLowerCase(),
								attValue = attribMatch[ 2 ] || attribMatch[ 3 ] || attribMatch[ 4 ] || '';

							if ( !attValue && emptyAttribs[ attName ] )
								attribs[ attName ] = attName;
							else
								attribs[ attName ] = CKEDITOR.tools.htmlDecodeAttr( attValue );
						}
					}

					this.onTagOpen( tagName, attribs, selfClosing );

					// CDATA
					if ( CKEDITOR.dtd.$cdata[ tagName ] ) {
						var closingTagRegex = new RegExp( '<\/' + tagName + '>', 'i' ),
							htmlPart = html.substring( nextIndex ),
							closingTagIndex = htmlPart.search( closingTagRegex );

						// If closing tag was not found, treat all remaining text as CDATA.
						if ( closingTagIndex === -1 ) {
							closingTagIndex = htmlPart.length;
						}

						cdata = htmlPart.substring( 0, closingTagIndex );

						this._.htmlPartsRegex.lastIndex = nextIndex + cdata.length;
						nextIndex = this._.htmlPartsRegex.lastIndex;
					}

					continue;
				}

				// Comment
				if ( ( tagName = parts[ 2 ] ) )
					this.onComment( tagName );
			}

			if ( html.length > nextIndex )
				this.onText( html.substring( nextIndex, html.length ) );
		}
	};
} )();
