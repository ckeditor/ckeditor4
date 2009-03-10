/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var defaultDataFilterRules = {
		elementNames: [
			// Elements that cause problems in wysiwyg mode.
					[ /^(object|embed|param)$/, 'cke:$1' ]
			],

		attributeNames: [
			// Event attributes (onXYZ) must not be directly set. They can become
					// active in the editing area (IE|WebKit).
					[ /^on/, '_cke_pa_on' ]
			]
	};

	var defaultHtmlFilterRules = {
		elementNames: [
			// Remove the "cke:" namespace prefix.
					[ /^cke:/, '' ],

			// Ignore <?xml:namespace> tags.
					[ /^\?xml:namespace$/, '' ]
			],

		attributeNames: [
			// Attributes saved for changes and protected attributes.
					[ /^_cke_(saved|pa)_/, '' ],

			// All "_cke" attributes are to be ignored.
					[ /^_cke.*/, '' ]
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

				if ( attribs._cke_saved_src )
					delete attribs.src;
			},

			a: function( element ) {
				var attribs = element.attributes;

				if ( attribs._cke_saved_href )
					delete attribs.href;
			}
		},

		attributes: {
			'class': function( value, element ) {
				// Remove all class names starting with "cke_".
				return CKEDITOR.tools.ltrim( value.replace( /(?:^|\s+)cke_[^\s]*/g, '' ) ) || false;
			}
		}
	};

	if ( CKEDITOR.env.ie ) {
		// IE outputs style attribute in capital letters. We should convert
		// them back to lower case.
		defaultHtmlFilterRules.attributes.style = function( value, element ) {
			return value.toLowerCase();
		}
	}

	var protectUrlTagRegex = /<(?:a|area|img).*?\s((?:href|src)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+)))/gi;

	function protectUrls( html ) {
		return html.replace( protectUrlTagRegex, '$& _cke_saved_$1' );
	};

	CKEDITOR.plugins.add( 'htmldataprocessor', {
		requires: [ 'htmlwriter' ],

		init: function( editor ) {
			var dataProcessor = editor.dataProcessor = new CKEDITOR.htmlDataProcessor();

			dataProcessor.writer.forceSimpleAmpersand = editor.config.forceSimpleAmpersand;

			dataProcessor.dataFilter.addRules( defaultDataFilterRules );
			dataProcessor.htmlFilter.addRules( defaultHtmlFilterRules );
		}
	});

	CKEDITOR.htmlDataProcessor = function() {
		this.writer = new CKEDITOR.htmlWriter();
		this.dataFilter = new CKEDITOR.htmlParser.filter();
		this.htmlFilter = new CKEDITOR.htmlParser.filter();
	};

	CKEDITOR.htmlDataProcessor.prototype = {
		toHtml: function( data ) {
			// The source data is already HTML, but we need to clean
			// it up and apply the filter.

			// Before anything, we must protect the URL attributes as the
			// browser may changing them when setting the innerHTML later in
			// the code.
			data = protectUrls( data );

			// Call the browser to help us fixing a possibly invalid HTML
			// structure.
			var div = document.createElement( 'div' );
			div.innerHTML = data;

			// Now use our parser to make further fixes to the structure, as
			// well as apply the filter.
			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( div.innerHTML ),
				writer = new CKEDITOR.htmlParser.basicWriter();

			fragment.writeHtml( writer, this.dataFilter );

			return writer.getHtml( true );
		},

		toDataFormat: function( html ) {
			var writer = this.writer,
				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html );

			writer.reset();

			fragment.writeHtml( writer, this.htmlFilter );

			return writer.getHtml( true );
		}
	};
})();

CKEDITOR.config.forceSimpleAmpersand = false;
