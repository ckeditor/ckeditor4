/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'easyimageAlt', function( editor ) {
	return {
		title: editor.lang.easyimage.commands.altText,
		minWidth: 200,
		minHeight: 30,
		onOk: function() {
			var newAlt = CKEDITOR.tools.trim( this.getValueOf( 'info', 'txtAlt' ) );

			if ( this._.selectedImage ) {
				this._.selectedImage.setAttribute( 'alt', newAlt );
			}
		},

		onHide: function() {
			delete this._.selectedElement;
		},

		onShow: function() {
			var altField = this.getContentElement( 'info', 'txtAlt' );

			this._.selectedImage = editor.widgets.focused.parts.image;

			altField.setValue( this._.selectedImage.getAttribute( 'alt' ) );
			altField.focus();
		},
		contents: [ {
			id: 'info',
			label: editor.lang.easyimage.commands.altText,
			accessKey: 'I',
			elements: [ {
				type: 'text',
				id: 'txtAlt',
				label: editor.lang.easyimage.commands.altText
			} ]
		} ]
	};
} );
