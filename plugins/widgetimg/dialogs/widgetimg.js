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

		doc, widget,
		domWidth, domHeight,
		preLoadedWidth, preLoadedHeight, srcChanged,
		lockButton, resetButton, widthField, heightField;

	// Validates dimension. Allowed values are:
	// "123%", "123px", "123", "" (empty string)
	function validateDimension() {
		var match = this.getValue().match( regexGetSizeOrEmpty ),
			isValid = !!( match && parseInt( match[ 1 ], 10 ) !== 0 );

		if ( !isValid )
			alert( 'Invalid value!' );

		return isValid;
	}

	// Registers alignment radios as dialog focusables.
	// This enabled TAB-based navigation for those elements.
	function onLoadAlignment() {
		// var dialog = this.getDialog(),
		// 	radio = this.getChild( 0 );

		// if ( radio ) {
		// 	var radioButtons = radio._.children;

		// 	for ( var i = 0; i < radioButtons.length; i++ )
		// 		dialog.addFocusable( radioButtons[ i ].getElement(), 6 + i )
		// }
	}

	// Set-up function for lock and reset buttons:
	// 	* Adds lock and reset buttons to focusables. Check if button exist first
	// 	  because it may be disabled e.g. due to ACF restrictions.
	// 	* Register mouseover and mouseout event listeners for UI manipulations.
	// 	* Register click event listeners for buttons.
	var onLoadLockReset = (function() {
		return function() {
			var dialog = this.getDialog();

			// Create references to lock and reset buttons for this dialog instance.
			lockButton = doc.getById( lockButtonId );
			resetButton = doc.getById( resetButtonId );

			// Activate (Un)LockRatio button
			if ( lockButton ) {
				dialog.addFocusable( lockButton, 4 );

				lockButton.on( 'click', function( evt ) {
					// TODO
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

				// Fills width and height fields with the original dimensions of the
				// image (stored in widget#data since widget#init).
				resetButton.on( 'click', function( evt ) {
					// If there's a new image loaded, reset button should revert
					// cached dimensions of pre-loaded DOM element.
					if ( srcChanged ) {
						widthField.setValue( preLoadedWidth );
						heightField.setValue( preLoadedHeight );
					}

					// If the old image remains, reset button should revert
					// dimensions as loaded when the dialog was first shown.
					else {
						widthField.setValue( domWidth );
						heightField.setValue( domHeight );
					}

					evt.data && evt.data.preventDefault();
				}, this );

				resetButton.on( 'mouseover', function() {
					this.addClass( 'cke_btn_over' );
				}, resetButton );

				resetButton.on( 'mouseout', function() {
					this.removeClass( 'cke_btn_over' );
				}, resetButton );
			}
		};
	})();

	return {
		title: 'Edit image',
		minWidth: 250,
		minHeight: 100,
		onLoad: function() {
			// Create a "global" reference to the document for this dialog instance.
			doc = this._.element.getDocument();

		},
		onShow: function() {
			// Create a "global" reference to edited widget.
			widget = this._.widget;
		},
		onHide: function() {
			// Reset tmp variables.
			preLoadedWidth = preLoadedHeight = srcChanged = false;
		},
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'src',
						type: 'text',
						label: 'URL',
						onChange: function() {
						},
						onKeyup: function() {
							var value = this.getValue();

							// Remember that src is different than default.
							if ( value !== widget.data.src ) {
								// Update dimensions of the image once it's preloaded.
								widget.loadImage( value, function( image, width, height ) {
									// There was problem loading the image.
									if ( !image )
										return;

									// Fill width field with the width of the new image.
									widthField.setValue( width );

									// Fill height field with the height of the new image.
									heightField.setValue( height );

									// Cache the new width.
									preLoadedWidth = width;

									// Cache the new height.
									preLoadedHeight = height;
								} );

								srcChanged = true;
							}

							// Roll back dimensions when restoring default src.
							else if ( srcChanged ) {
								// Restore width field with cached width.
								widthField.setValue( domWidth );

								// Restore height field with cached height.
								heightField.setValue( domHeight );

								// Src equals default one back again.
								srcChanged = false;
							}
						},
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
								onLoad: function() {
									widthField = this;
								},
								setup: function( widget ) {
									this.setValue( widget.data.width );

									// This width is used when resetting size.
									domWidth = widget.data.domWidth;
								},
								commit: function( widget ) {
									widget.setData( 'width', this.getValue() );

									if ( srcChanged )
										widget.setData( 'domWidth', preLoadedWidth );
								}
							},
							{
								type: 'text',
								id: 'height',
								width: '45px',
								label: 'Height',
								validate: validateDimension,
								onLoad: function() {
									heightField = this;
								},
								setup: function( widget ) {
									this.setValue( widget.data.height );

									// This height is used when resetting size.
									domHeight = widget.data.domHeight;
								},
								commit: function( widget ) {
									widget.setData( 'height', this.getValue() );

									if ( srcChanged )
										widget.setData( 'domHeight', preLoadedHeight );
								}
							},
							{
								id: 'lock',
								type: 'html',
								style: lockResetStyle,
								onLoad: onLoadLockReset,
								setup: function( widget ) {
									// At the moment there's no other way to pass
									// the widget to the onLoad function than saving
									// it when setup is called.
									this.widget = widget;
								},
								html: lockResetHtml
							}
						]
					},
					{
						type: 'hbox',
						id: 'alignment',
						onLoad: onLoadAlignment,
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
} );