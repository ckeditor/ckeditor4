/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var htmlFilterRules = {
		elements: {
			$: function( element ) {
				var attributes = element.attributes,
					realHtml = attributes && attributes._cke_realelement,
					realFragment = realHtml && new CKEDITOR.htmlParser.fragment.fromHtml( decodeURIComponent( realHtml ) ),
					realElement = realFragment && realFragment.children[ 0 ];

				// If we have width/height in the element, we must move it into
				// the real element.
				if ( realElement && element.attributes._cke_resizable ) {
					var style = element.attributes.style;

					if ( style ) {
						// Get the width from the style.
						var match = /(?:^|\s)width\s*:\s*(\d+)/i.exec( style ),
							width = match && match[ 1 ];

						// Get the height from the style.
						match = /(?:^|\s)height\s*:\s*(\d+)/i.exec( style );
						var height = match && match[ 1 ];

						if ( width )
							realElement.attributes.width = width;

						if ( height )
							realElement.attributes.height = height;
					}
				}

				return realElement;
			}
		}
	};

	CKEDITOR.plugins.add( 'fakeobjects', {
		requires: [ 'htmlwriter' ],

		afterInit: function( editor ) {
			var dataProcessor = editor.dataProcessor,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( htmlFilter )
				htmlFilter.addRules( htmlFilterRules );
		}
	});
})();

CKEDITOR.editor.prototype.createFakeElement = function( realElement, className, realElementType, isResizable ) {
	var lang = this.lang.fakeobjects;

	var attributes = {
		'class': className,
		src: CKEDITOR.getUrl( 'images/spacer.gif' ),
		_cke_realelement: encodeURIComponent( realElement.getOuterHtml() ),
		_cke_real_node_type: realElement.type,
		alt: lang[ realElementType ] || lang.unknown
	};

	if ( realElementType )
		attributes._cke_real_element_type = realElementType;

	if ( isResizable )
		attributes._cke_resizable = isResizable;

	return this.document.createElement( 'img', { attributes: attributes } );
};

CKEDITOR.editor.prototype.createFakeParserElement = function( realElement, className, realElementType, isResizable ) {
	var lang = this.lang.fakeobjects,
		html, writer;

	var writer = new CKEDITOR.htmlParser.basicWriter();
	realElement.writeHtml( writer );
	html = writer.getHtml();

	var attributes = {
		'class': className,
		src: CKEDITOR.getUrl( 'images/spacer.gif' ),
		_cke_realelement: encodeURIComponent( html ),
		_cke_real_node_type: realElement.type,
		alt: lang[ realElementType ] || lang.unknown
	};

	if ( realElementType )
		attributes._cke_real_element_type = realElementType;

	if ( isResizable )
		attributes._cke_resizable = isResizable;

	return new CKEDITOR.htmlParser.element( 'img', attributes );
};

CKEDITOR.editor.prototype.restoreRealElement = function( fakeElement ) {
	if ( fakeElement.getAttribute( '_cke_real_node_type' ) != CKEDITOR.NODE_ELEMENT )
		return null;

	return CKEDITOR.dom.element.createFromHtml( decodeURIComponent( fakeElement.getAttribute( '_cke_realelement' ) ), this.document );
};
