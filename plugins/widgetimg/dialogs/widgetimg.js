/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'widgetimg', function( editor ) {

	// RegExp: 123, 123px, 123%, empty string ""
	var regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i,

		lockButtonId = CKEDITOR.tools.getNextId(),
		resetButtonId = CKEDITOR.tools.getNextId(),

		lockResetStyle = 'margin-top:18px;width:40px;height:20px;',
		lockResetHtml = new CKEDITOR.template(
			'<div>' +
				'<a href="javascript:void(0)" tabindex="-1" title="Lock ratio" class="cke_btn_locked" id="{lockButtonId}" role="checkbox">' +
					'<span class="cke_icon"></span>' +
					'<span class="cke_label">Lock ratio</span>' +
				'</a>' +

				'<a href="javascript:void(0)" tabindex="-1" title="Reset size" class="cke_btn_reset" id="{resetButtonId}" role="button">' +
					'<span class="cke_label">Reset size</span>' +
				'</a>' +
			'</div>' ).output( {
				lockButtonId: lockButtonId,
				resetButtonId: resetButtonId
			} ),

		doc, editor,
		lockButton, resetButton;

	return {
		title: 'Edit image',
		minWidth: 250,
		minHeight: 100,
		onLoad: function() {
			// Create references to document and editor for this dialog instance.
			doc = this._.element.getDocument(),
			editor = this._.editor;
		},
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
								style: lockResetStyle,
								onLoad: lockResetOnLoad,
								html: lockResetHtml
							}
						]
					},
					{
						type: 'hbox',
						id: 'alignment',
						onLoad: alignmentOnLoad,
						children: [
							{
								id: 'align',
								type: 'radio',
								items: [
									[ 'Left', 'left' ],
									[ 'None', 'none' ],
									[ 'Right', 'right' ] ],
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

	function alignmentOnLoad( el ) {
		var dialog = this.getDialog(),
			radio = this.getChild( 0 );

		if ( radio ) {
			var radioButtons = radio._.children;

			for ( var i = 0; i < radioButtons.length; i++ )
				dialog.addFocusable( radioButtons[ i ].getElement(), 6 + i )
		}
	}

	// Add lock and reset buttons to focusables.
	// Check if button exist first be cause it may be disabled
	// e.g. due to ACF restrictions.
	function lockResetOnLoad() {
		var dialog = this.getDialog();

		// Create references to lock and reset buttons for this dialog instance.
		lockButton = doc.getById( lockButtonId );
		resetButton = doc.getById( resetButtonId );

		// Activate (Un)LockRatio button
		if ( lockButton ) {
			dialog.addFocusable( lockButton, 4 );

			lockButton.on( 'click', function( evt ) {
				// var locked = switchLockRatio( this ),
				// 	oImageOriginal = this.originalElement,
				// 	width = this.getValueOf( 'info', 'txtWidth' );

				// if ( oImageOriginal.getCustomData( 'isReady' ) == 'true' && width ) {
				// 	var height = oImageOriginal.$.height / oImageOriginal.$.width * width;
				// 	if ( !isNaN( height ) ) {
				// 		this.setValueOf( 'info', 'txtHeight', Math.round( height ) );
				// 		updatePreview( this );
				// 	}
				// }
				// evt.data && evt.data.preventDefault();
			}, this.getDialog() );

			lockButton.on( 'mouseover', function() {
				this.addClass( 'cke_btn_over' );
			}, lockButton );

			lockButton.on( 'mouseout', function() {
				this.removeClass( 'cke_btn_over' );
			}, lockButton );
		}

		// Activate the reset size button.
		if ( resetButton ) {
			dialog.addFocusable( resetButton, 5 );

			resetButton.on( 'click', function( evt ) {
				// resetSize( this );
				evt.data && evt.data.preventDefault();
			}, this.getDialog() );

			resetButton.on( 'mouseover', function() {
				this.addClass( 'cke_btn_over' );
			}, resetButton );

			resetButton.on( 'mouseout', function() {
				this.removeClass( 'cke_btn_over' );
			}, resetButton );
		}
	}
} );