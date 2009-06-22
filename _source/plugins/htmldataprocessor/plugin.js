/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	// Regex to scan for &nbsp; at the end of blocks, which are actually placeholders.
	var tailNbspRegex = /^[\t\r\n ]*&nbsp;$/;

	var protectedSourceMarker = '{cke_protected}';

	function trimFillers( block, fromSource ) {
		// If the current node is a block, and if we're converting from source or
		// we're not in IE then search for and remove any tailing BR node.
		//
		// Also, any &nbsp; at the end of blocks are fillers, remove them as well.
		// (#2886)
		var children = block.children;
		var lastChild = children[ children.length - 1 ];
		if ( lastChild ) {
			if ( ( fromSource || !CKEDITOR.env.ie ) && lastChild.type == CKEDITOR.NODE_ELEMENT && lastChild.name == 'br' )
				children.pop();
			if ( lastChild.type == CKEDITOR.NODE_TEXT && tailNbspRegex.test( lastChild.value ) )
				children.pop();
		}
	}

	function blockNeedsExtension( block ) {
		if ( block.children.length < 1 )
			return true;

		var lastChild = block.children[ block.children.length - 1 ];
		return lastChild.type == CKEDITOR.NODE_ELEMENT && lastChild.name == 'br';
	}

	function extendBlockForDisplay( block ) {
		trimFillers( block, true );

		if ( blockNeedsExtension( block ) ) {
			if ( CKEDITOR.env.ie )
				block.add( new CKEDITOR.htmlParser.text( '\xa0' ) );
			else
				block.add( new CKEDITOR.htmlParser.element( 'br', {} ) );
		}
	}

	function extendBlockForOutput( block ) {
		trimFillers( block );

		if ( blockNeedsExtension( block ) )
			block.add( new CKEDITOR.htmlParser.text( '\xa0' ) );
	}

	var dtd = CKEDITOR.dtd;

	// Find out the list of block-like tags that can contain <br>.
	var blockLikeTags = CKEDITOR.tools.extend( {}, dtd.$block, dtd.$listItem, dtd.$tableContent );
	for ( var i in blockLikeTags ) {
		if ( !( 'br' in dtd[ i ] ) )
			delete blockLikeTags[ i ];
	}
	// We just avoid filler in <pre> right now.
	// TODO: Support filler for <pre>, line break is also occupy line height.
	delete blockLikeTags.pre;
	var defaultDataFilterRules = {
		elementNames: [
			// Elements that cause problems in wysiwyg mode.
					[ ( /^(object|embed|param)$/ ), 'cke:$1' ]
			],

		attributeNames: [
			// Event attributes (onXYZ) must not be directly set. They can become
					// active in the editing area (IE|WebKit).
					[ ( /^on/ ), '_cke_pa_on' ]
			]
	};

	var defaultDataBlockFilterRules = {
		elements: {} };

	for ( i in blockLikeTags )
		defaultDataBlockFilterRules.elements[ i ] = extendBlockForDisplay;

	/**
	 * IE sucks with dynamic 'name' attribute after element is created, '_cke_saved_name' is used instead for this attribute.
	 */
	var removeName = function( element ) {
			var attribs = element.attributes;

			if ( attribs._cke_saved_name )
				delete attribs.name;
		};

	var defaultHtmlFilterRules = {
		elementNames: [
			// Remove the "cke:" namespace prefix.
					[ ( /^cke:/ ), '' ],

			// Ignore <?xml:namespace> tags.
					[ ( /^\?xml:namespace$/ ), '' ]
			],

		attributeNames: [
			// Attributes saved for changes and protected attributes.
					[ ( /^_cke_(saved|pa)_/ ), '' ],

			// All "_cke" attributes are to be ignored.
					[ ( /^_cke.*/ ), '' ]
			],

		elements: {
			embed: function( element ) {
				var parent = element.parent;

				// If the <embed> is child of a <object>, copy the width
				// and height attributes from it.
				if ( parent && parent.name == 'object' ) {
					element.attributes.width = parent.attributes.width;
					element.attributes.height = parent.attributes.height;
				}
			},

			img: function( element ) {
				var attribs = element.attributes;

				if ( attribs._cke_saved_name )
					delete attribs.name;
				if ( attribs._cke_saved_src )
					delete attribs.src;
			},

			a: function( element ) {
				var attribs = element.attributes;

				if ( attribs._cke_saved_name )
					delete attribs.name;
				if ( attribs._cke_saved_href )
					delete attribs.href;
			},

			input: removeName,
			textarea: removeName,
			select: removeName,
			form: removeName
		},

		attributes: {
			'class': function( value, element ) {
				// Remove all class names starting with "cke_".
				return CKEDITOR.tools.ltrim( value.replace( /(?:^|\s+)cke_[^\s]*/g, '' ) ) || false;
			}
		},

		comment: function( contents ) {
			if ( contents.substr( 0, protectedSourceMarker.length ) == protectedSourceMarker )
				return new CKEDITOR.htmlParser.cdata( decodeURIComponent( contents.substr( protectedSourceMarker.length ) ) );

			return contents;
		}
	};

	var defaultHtmlBlockFilterRules = {
		elements: {} };

	for ( i in blockLikeTags )
		defaultHtmlBlockFilterRules.elements[ i ] = extendBlockForOutput;

	if ( CKEDITOR.env.ie ) {
		// IE outputs style attribute in capital letters. We should convert
		// them back to lower case.
		defaultHtmlFilterRules.attributes.style = function( value, element ) {
			return value.toLowerCase();
		};
	}

	var protectAttributeRegex = /<(?:a|area|img|input).*?\s((?:href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+)))/gi;

	function protectAttributes( html ) {
		return html.replace( protectAttributeRegex, '$& _cke_saved_$1' );
	}

	var protectStyleTagsRegex = /<(style)(?=[ >])[^>]*>[^<]*<\/\1>/gi;
	var encodedTagsRegex = /<cke:encoded>([^<]*)<\/cke:encoded>/gi;

	function protectStyleTagsMatch( match ) {
		return '<cke:encoded>' + encodeURIComponent( match ) + '</cke:encoded>';
	}

	function protectStyleTags( html ) {
		return html.replace( protectStyleTagsRegex, protectStyleTagsMatch );
	}

	function unprotectEncodedTagsMatch( match, encoded ) {
		return decodeURIComponent( encoded );
	}

	function unprotectEncodedTags( html ) {
		return html.replace( encodedTagsRegex, unprotectEncodedTagsMatch );
	}

	function protectSource( data, protectRegexes ) {
		var regexes = [
			// First of any other protection, we must protect all comments
					// to avoid loosing them (of course, IE related).
					/<!--[\s\S]*?-->/g,

			// Script tags will also be forced to be protected, otherwise
					// IE will execute them.
					/<script[\s\S]*?<\/script>/gi,

			// <noscript> tags (get lost in IE and messed up in FF).
					/<noscript[\s\S]*?<\/noscript>/gi
			].concat( protectRegexes );

		for ( var i = 0; i < regexes.length; i++ ) {
			data = data.replace( regexes[ i ], function( match ) {
				return '<!--' + protectedSourceMarker + encodeURIComponent( match ).replace( /--/g, '%2D%2D' ) + '-->';
			});
		}

		return data;
	}

	CKEDITOR.plugins.add( 'htmldataprocessor', {
		requires: [ 'htmlwriter' ],

		init: function( editor ) {
			var dataProcessor = editor.dataProcessor = new CKEDITOR.htmlDataProcessor( editor );

			dataProcessor.writer.forceSimpleAmpersand = editor.config.forceSimpleAmpersand;

			dataProcessor.dataFilter.addRules( defaultDataFilterRules );
			dataProcessor.dataFilter.addRules( defaultDataBlockFilterRules );
			dataProcessor.htmlFilter.addRules( defaultHtmlFilterRules );
			dataProcessor.htmlFilter.addRules( defaultHtmlBlockFilterRules );
		}
	});

	CKEDITOR.htmlDataProcessor = function( editor ) {
		this.editor = editor;

		this.writer = new CKEDITOR.htmlWriter();
		this.dataFilter = new CKEDITOR.htmlParser.filter();
		this.htmlFilter = new CKEDITOR.htmlParser.filter();
	};

	CKEDITOR.htmlDataProcessor.prototype = {
		toHtml: function( data, fixForBody ) {
			// The source data is already HTML, but we need to clean
			// it up and apply the filter.

			data = protectSource( data, this.editor.config.protectedSource );

			// Before anything, we must protect the URL attributes as the
			// browser may changing them when setting the innerHTML later in
			// the code.
			data = protectAttributes( data );

			// IE remvoes style tags from innerHTML. (#3710).
			if ( CKEDITOR.env.ie )
				data = protectStyleTags( data );

			// Call the browser to help us fixing a possibly invalid HTML
			// structure.
			var div = document.createElement( 'div' );
			div.innerHTML = data;
			data = div.innerHTML;

			if ( CKEDITOR.env.ie )
				data = unprotectEncodedTags( data );

			// Now use our parser to make further fixes to the structure, as
			// well as apply the filter.
			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( data, fixForBody ),
				writer = new CKEDITOR.htmlParser.basicWriter();

			fragment.writeHtml( writer, this.dataFilter );

			return writer.getHtml( true );
		},

		toDataFormat: function( html, fixForBody ) {
			var writer = this.writer,
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html, fixForBody );

			writer.reset();

			fragment.writeHtml( writer, this.htmlFilter );

			return writer.getHtml( true );
		}
	};
})();

CKEDITOR.config.forceSimpleAmpersand = false;
