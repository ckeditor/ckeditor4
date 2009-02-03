/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'fakeobjects' );

CKEDITOR.editor.prototype.createFakeElement = function( realElement, className ) {
	return this.document.createElement( 'img', {
		attributes: {
			'class': className,
			src: CKEDITOR.getUrl( 'images/spacer.gif' ),
			_cke_realelement: encodeURIComponent( realElement.getOuterHtml() )
		}
	});
};
