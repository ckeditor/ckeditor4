
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Definition for placeholder plugin dialog
 *
 */

CKEDITOR.dialog.add( 'placeholder2', function( editor ) {

	var lang = editor.lang.placeholder2,
		generalLabel = editor.lang.common.generalTab;

	return {
		title: lang.title,
		minWidth: 300,
		minHeight: 80,
		contents: [
			{
				id: 'info',
				label: generalLabel,
				title: generalLabel,
				elements: [
					// Dialog window UI elements.
					{
						id: 'name',
						type: 'text',
						style: 'width: 100%;',
						label: lang.text,
						'default': '',
						required: true,
						validate: CKEDITOR.dialog.validate.notEmpty( lang.textMissing ),
						setup: function( widget ) {
							this.setValue( widget.data.name );
						},
						commit: function( widget ) {
							widget.setData( 'name', this.getValue() );
						},
						onLoad: function( e ) {
							this.getInputElement().on( 'keydown', function( e ) {

								var keyEvent = e.data,
									// keys disabled (unless shift is pressed)
									excludedKeyCodes = [
										219, // [ - open square bracket
										221 // ] - close square bracket
									];

								// checking if key is not on list of blocked keys, shift cant be
								// pressed, because it's making curly then - which are allowed
								if ( keyEvent.$.shiftKey == false && excludedKeyCodes.indexOf( keyEvent.getKey() ) !== -1 ) {
									keyEvent.preventDefault();
								}

								return;
							} );
						}
					}
				]
			}
		]
	};
} );