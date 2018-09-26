/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'easyimageAlt', function( editor ) {
	return {
		title: editor.lang.easyimage.commands.altText,
		minWidth: 200,
		minHeight: 30,
		onOk: function() {
			var newAlt = CKEDITOR.tools.trim( this.getValueOf( 'info', 'txtAlt' ) ),
				model = this.getModel( editor );

			if ( model ) {
				model.parts.image.setAttribute( 'alt', newAlt );
			}
		},

		onHide: function() {
			delete this._.selectedImage;
		},

		onShow: function() {
			var altField = this.getContentElement( 'info', 'txtAlt' ),
				model = this.getModel( editor );

			if ( model ) {
				// Left for backwards compatibility (#2423).
				this._.selectedImage = model.parts.image;

				altField.setValue( model.parts.image.getAttribute( 'alt' ) );
			}

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
