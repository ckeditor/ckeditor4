/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'fakeobjects' );

CKEDITOR.editor.prototype.createFakeElement = function( realElement, className, realElementType, isResizable ) {
	var attributes = {
		'class': className,
		src: CKEDITOR.getUrl( 'images/spacer.gif' ),
		_cke_realelement: encodeURIComponent( realElement.getOuterHtml() )
	};
	if ( realElementType )
		attributes._cke_real_element_type = realElementType;
	if ( isResizable )
		attributes._cke_resizable = isResizable;

	return this.document.createElement( 'img', { attributes: attributes } );
};

CKEDITOR.editor.prototype.restoreRealElement = function( fakeElement ) {
	var html = decodeURIComponent( fakeElement.getAttribute( '_cke_realelement' ) );
	return CKEDITOR.dom.element.createFromHtml( html, this.document );
};
