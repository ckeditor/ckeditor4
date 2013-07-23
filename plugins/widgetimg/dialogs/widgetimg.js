/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'widgetimg', function( editor ) {

	// RegExp: 123, 123px, 123%, empty string ""
	var regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i;

	return {
		title: 'Edit image',
		minWidth: 250,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'src',
						type: 'text',
						label: 'URL',
						setup: function( widget ) {
							this.setValue( widget.data.src );
						},
						commit: function( widget ) {
							widget.setData( 'src', this.getValue() );
						},
						validate: CKEDITOR.dialog.validate.notEmpty( 'URL is missing' )
					},
					{
						id: 'alt',
						type: 'text',
						label: 'Alternative text',
						setup: function( widget ) {
							this.setValue( widget.data.alt );
						},
						commit: function( widget ) {
							widget.setData( 'alt', this.getValue() );
						}
					},
					{
						type: 'hbox',
						widths: [ '25%', '25%', '50%' ],
						requiredContent: 'img{width,height}',
						children: [
							{
								type: 'text',
								width: '45px',
								id: 'width',
								label: 'Width',
								validate: validateDimension,
								setup: function( widget ) {
									this.setValue( widget.data.width );
								},
								commit: function( widget ) {
									widget.setData( 'width', this.getValue() );
								}
							},
							{
								type: 'text',
								id: 'height',
								width: '45px',
								label: 'Height',
								validate: validateDimension,
								setup: function( widget ) {
									this.setValue( widget.data.height );
								},
								commit: function( widget ) {
									widget.setData( 'height', this.getValue() );
								}
							},
							{
								id: 'lock',
								type: 'html',
								style: 'margin-top:18px;width:40px;height:20px;',
								html: '<div>' +
										'<a href="javascript:void(0)" tabindex="-1" title="Lock ratio" class="cke_btn_locked" id="btnLockSizesId" role="checkbox">' +
											'<span class="cke_icon"></span>' +
											'<span class="cke_label">Lock ratio</span>' +
										'</a>' +

										'<a href="javascript:void(0)" tabindex="-1" title="Reset size" class="cke_btn_reset" id="btnResetSizeId" role="button">' +
											'<span class="cke_label">Reset size</span>' +
										'</a>' +
									'</div>'
							}
						]
					},
					{
						type: 'hbox',
						id: 'alignment',
						children: [
							{
								id: 'align',
								type: 'radio',
								items: [ [ 'Left', 'left' ], [ 'None', 'none' ], [ 'Right', 'right' ] ],
								label: 'Alignment',
								setup: function( widget ) {
									this.setValue( widget.data.align );
								},
								commit: function( widget ) {
									widget.setData( 'align', this.getValue() );
								}
							},
						]
					},
					{
						id: 'caption',
						type: 'checkbox',
						label: 'Captioned image',
						setup: function( widget ) {
							this.setValue( widget.data.hasCaption );
						},
						commit: function( widget ) {
							widget.setData( 'hasCaption', this.getValue() );
						}
					}
				]
			}
		]
	};

	function validateDimension() {
		var match = this.getValue().match( regexGetSizeOrEmpty ),
			isValid = !!( match && parseInt( match[ 1 ], 10 ) !== 0 );

		if ( !isValid )
			alert( 'Invalid value!' );

		return isValid;
	}
} );