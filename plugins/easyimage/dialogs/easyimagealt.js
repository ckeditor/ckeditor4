/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.dialog.add( 'easyimageAlt', function( editor ) {
	return {
		title: editor.lang.easyimage.commands.altText,
		minWidth: 200,
		minHeight: 30,
		getModel: function() {
			var focused = editor.widgets.focused;

			if ( focused && focused.name == 'easyimage' ) {
				return focused;
			}

			return null;
		},
		onOk: function() {
			var newAlt = CKEDITOR.tools.trim( this.getValueOf( 'info', 'txtAlt' ) ),
				model = this.getModel( editor );

			if ( model ) {
				model.parts.image.setAttribute( 'alt', newAlt );
			}
		},

		onShow: function() {
			var altField = this.getContentElement( 'info', 'txtAlt' ),
				model = this.getModel( editor );

			if ( model ) {
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
