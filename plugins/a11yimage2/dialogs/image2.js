/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Image plugin based on Widgets API
 */

'use strict';

CKEDITOR.dialog.add( 'a11yimage2', function( editor ) {

	// RegExp: 123, 123px, empty string ""
	var regexGetSizeOrEmpty = /(^\s*(\d+)(px)?\s*$)|^$/i,

		lockButtonId = CKEDITOR.tools.getNextId(),
		resetButtonId = CKEDITOR.tools.getNextId(),

		lang = editor.lang.a11yimage2,
		commonLang = editor.lang.common,

		lockResetStyle = 'margin-top:18px;width:40px;height:20px;',
		lockResetHtml = new CKEDITOR.template(
			'<div>' +
				'<a href="javascript:void(0)" tabindex="-1" title="' + lang.lockRatio + '" class="cke_btn_locked" id="{lockButtonId}" role="checkbox">' +
					'<span class="cke_icon"></span>' +
					'<span class="cke_label">' + lang.lockRatio + '</span>' +
				'</a>' +

				'<a href="javascript:void(0)" tabindex="-1" title="' + lang.resetSize + '" class="cke_btn_reset" id="{resetButtonId}" role="button">' +
					'<span class="cke_label">' + lang.resetSize + '</span>' +
				'</a>' +
			'</div>' ).output( {
				lockButtonId: lockButtonId,
				resetButtonId: resetButtonId
			} ),

		helpers = CKEDITOR.plugins.a11yimage2,

		// Editor instance configuration.
		config = editor.config,

		hasFileBrowser = !!( config.filebrowserImageBrowseUrl || config.filebrowserBrowseUrl ),

		// Content restrictions defined by the widget which
		// impact on dialog structure and presence of fields.
		features = editor.widgets.registered.image.features,

		// Functions inherited from a11yimage2 plugin.
		getNatural = helpers.getNatural,

		// Global variables referring to the dialog's context.
		doc, widget, image, caption,

		// Global variable referring to this dialog's image pre-loader.
		preLoader,

		// Global variables holding the original size of the image.
		domWidth, domHeight,

		// Global variables related to image pre-loading.
		preLoadedWidth, preLoadedHeight, srcChanged,

		// Global variables related to size locking.
		lockRatio, userDefinedLock,

		// Global variables referring to dialog fields and elements.
		lockButton, resetButton, widthField, heightField,

		natural;

	// Validates dimension. Allowed values are:
	// "123px", "123", "" (empty string)
	function validateDimension() {
		var match = this.getValue().match( regexGetSizeOrEmpty ),
			isValid = !!( match && parseInt( match[ 1 ], 10 ) !== 0 );

		if ( !isValid )
			alert( commonLang[ 'invalidLength' ].replace( '%1', commonLang[ this.id ] ).replace( '%2', 'px' ) ); // jshint ignore:line

		return isValid;
	}

	// Creates a function that pre-loads images. The callback function passes
	// [image, width, height] or null if loading failed.
	//
	// @returns {Function}
	function createPreLoader() {
		var image = doc.createElement( 'img' ),
			listeners = [];

		function addListener( event, callback ) {
			listeners.push( image.once( event, function( evt ) {
				removeListeners();
				callback( evt );
			} ) );
		}

		function removeListeners() {
			var l;

			while ( ( l = listeners.pop() ) )
				l.removeListener();
		}

		// @param {String} src.
		// @param {Function} callback.
		return function( src, callback, scope ) {
			addListener( 'load', function() {
				// Don't use image.$.(width|height) since it's buggy in IE9-10 (https://dev.ckeditor.com/ticket/11159)
				var dimensions = getNatural( image );

				callback.call( scope, image, dimensions.width, dimensions.height );
			} );

			addListener( 'error', function() {
				callback( null );
			} );

			addListener( 'abort', function() {
				callback( null );
			} );

			image.setAttribute( 'src',
				( config.baseHref || '' ) + src + '?' + Math.random().toString( 16 ).substring( 2 ) );
		};
	}

	// This function updates width and height fields once the
	// "src" field is altered. Along with dimensions, also the
	// dimensions lock is adjusted.
	function onChangeSrc() {
		var value = this.getValue();

		toggleDimensions( false );

		// Remember that src is different than default.
		if ( value !== widget.data.src ) {
			// Update dimensions of the image once it's preloaded.
			preLoader( value, function( image, width, height ) {
				// Re-enable width and height fields.
				toggleDimensions( true );

				// There was problem loading the image. Unlock ratio.
				if ( !image )
					return toggleLockRatio( false );

				// Fill width field with the width of the new image.
				widthField.setValue( editor.config.a11yimage2_prefillDimensions === false ? 0 : width );

				// Fill height field with the height of the new image.
				heightField.setValue( editor.config.a11yimage2_prefillDimensions === false ? 0 : height );

				// Cache the new width.
				preLoadedWidth = width;

				// Cache the new height.
				preLoadedHeight = height;

				// Check for new lock value if image exist.
				toggleLockRatio( helpers.checkHasNaturalRatio( image ) );
			} );

			srcChanged = true;
		}

		// Value is the same as in widget data but is was
		// modified back in time. Roll back dimensions when restoring
		// default src.
		else if ( srcChanged ) {
			// Re-enable width and height fields.
			toggleDimensions( true );

			// Restore width field with cached width.
			widthField.setValue( domWidth );

			// Restore height field with cached height.
			heightField.setValue( domHeight );

			// Src equals default one back again.
			srcChanged = false;
		}

		// Value is the same as in widget data and it hadn't
		// been modified.
		else {
			// Re-enable width and height fields.
			toggleDimensions( true );
		}
	}

	function onChangeDimension() {
		// If ratio is un-locked, then we don't care what's next.
		if ( !lockRatio )
			return;

		var value = this.getValue();

		// No reason to auto-scale or unlock if the field is empty.
		if ( !value )
			return;

		// If the value of the field is invalid (e.g. with %), unlock ratio.
		if ( !value.match( regexGetSizeOrEmpty ) )
			toggleLockRatio( false );

		// No automatic re-scale when dimension is '0'.
		if ( value === '0' )
			return;

		var isWidth = this.id == 'width',
			// If dialog opened for the new image, domWidth and domHeight
			// will be empty. Use dimensions from pre-loader in such case instead.
			width = domWidth || preLoadedWidth,
			height = domHeight || preLoadedHeight;

		// If changing width, then auto-scale height.
		if ( isWidth )
			value = Math.round( height * ( value / width ) );

		// If changing height, then auto-scale width.
		else
			value = Math.round( width * ( value / height ) );

		// If the value is a number, apply it to the other field.
		if ( !isNaN( value ) )
			( isWidth ? heightField : widthField ).setValue( value );
	}

	// Set-up function for lock and reset buttons:
	// 	* Adds lock and reset buttons to focusables. Check if button exist first
	// 	  because it may be disabled e.g. due to ACF restrictions.
	// 	* Register mouseover and mouseout event listeners for UI manipulations.
	// 	* Register click event listeners for buttons.
	function onLoadLockReset() {
		var dialog = this.getDialog();

		function setupMouseClasses( el ) {
			el.on( 'mouseover', function() {
				this.addClass( 'cke_btn_over' );
			}, el );

			el.on( 'mouseout', function() {
				this.removeClass( 'cke_btn_over' );
			}, el );
		}

		// Create references to lock and reset buttons for this dialog instance.
		lockButton = doc.getById( lockButtonId );
		resetButton = doc.getById( resetButtonId );

		// Activate (Un)LockRatio button
		if ( lockButton ) {
			// Consider that there's an additional focusable field
			// in the dialog when the "browse" button is visible.
			dialog.addFocusable( lockButton, 4 + hasFileBrowser );

			lockButton.on( 'click', function( evt ) {
				toggleLockRatio();
				evt.data && evt.data.preventDefault();
			}, this.getDialog() );

			setupMouseClasses( lockButton );
		}

		// Activate the reset size button.
		if ( resetButton ) {
			// Consider that there's an additional focusable field
			// in the dialog when the "browse" button is visible.
			dialog.addFocusable( resetButton, 5 + hasFileBrowser );

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

			setupMouseClasses( resetButton );
		}
	}

	function toggleLockRatio( enable ) {
		// No locking if there's no radio (i.e. due to ACF).
		if ( !lockButton )
			return;

		if ( typeof enable == 'boolean' ) {
			// If user explicitly wants to decide whether
			// to lock or not, don't do anything.
			if ( userDefinedLock )
				return;

			lockRatio = enable;
		}

		// Undefined. User changed lock value.
		else {
			var width = widthField.getValue(),
				height;

			userDefinedLock = true;
			lockRatio = !lockRatio;

			// Automatically adjust height to width to match
			// the original ratio (based on dom- dimensions).
			if ( lockRatio && width ) {
				height = domHeight / domWidth * width;

				if ( !isNaN( height ) )
					heightField.setValue( Math.round( height ) );
			}
		}

		lockButton[ lockRatio ? 'removeClass' : 'addClass' ]( 'cke_btn_unlocked' );
		lockButton.setAttribute( 'aria-checked', lockRatio );

		// Ratio button hc presentation - WHITE SQUARE / BLACK SQUARE
		if ( CKEDITOR.env.hc ) {
			var icon = lockButton.getChild( 0 );
			icon.setHtml( lockRatio ? CKEDITOR.env.ie ? '\u25A0' : '\u25A3' : CKEDITOR.env.ie ? '\u25A1' : '\u25A2' );
		}
	}

	function toggleDimensions( enable ) {
		var method = enable ? 'enable' : 'disable';

		widthField[ method ]();
		heightField[ method ]();
	}

	var srcBoxChildren = [
			{
				id: 'src',
				type: 'text',
				label: commonLang.url,
				onKeyup: onChangeSrc,
				onChange: onChangeSrc,
				setup: function( widget ) {
					this.setValue( widget.data.src );
				},
				commit: function( widget ) {
					widget.setData( 'src', this.getValue() );
				},
				validate: CKEDITOR.dialog.validate.notEmpty( lang.urlMissing )
			}
		];

	// Render the "Browse" button on demand to avoid an "empty" (hidden child)
	// space in dialog layout that distorts the UI.
	if ( hasFileBrowser ) {
		srcBoxChildren.push( {
			type: 'button',
			id: 'browse',
			// v-align with the 'txtUrl' field.
			// TODO: We need something better than a fixed size here.
			style: 'display:inline-block;margin-top:14px;',
			align: 'center',
			label: editor.lang.common.browseServer,
			hidden: true,
			filebrowser: 'info:src'
		} );
	}

	return {
		title: lang.title,
		minWidth: 350,
		minHeight: 100,
		onLoad: function() {
			// Create a "global" reference to the document for this dialog instance.
			doc = this._.element.getDocument();

			// Create a pre-loader used for determining dimensions of new images.
			preLoader = createPreLoader();
		},
		onShow: function() {
			// Create a "global" reference to edited widget.
			widget = this.widget;

			// Create a "global" reference to widget's image.
			image = widget.parts.image;

			// Create a "global" reference to widget's caption (if it exists, else undefined).
			caption = widget.parts.caption;

			// Reset global variables.
			srcChanged = userDefinedLock = lockRatio = false;

			// Natural dimensions of the image.
			natural = getNatural( image );

			// Get the natural width of the image.
			preLoadedWidth = domWidth = natural.width;

			// Get the natural height of the image.
			preLoadedHeight = domHeight = natural.height;
		},
		contents: [
			{
				id: 'info',
				label: lang.infoTab,
				elements: [
					{
						id: 'imageType',
						type: 'radio',
						label: lang.typeOfImage,
						title: lang.typeOfImageTitle,
						'default': 'simple',
						items: [
							[ lang.typeSimple, 'simple' ],
							[ lang.typeComplex, 'complex' ],
							[ lang.typeDecorative, 'decorative' ]
						],
						onChange: function() {

							var value = this.getValue();

							var desc       = this.getDialog().getContentElement( 'info', 'desc' ).getElement();
							var alt        = this.getDialog().getContentElement( 'info', 'alt' ).getElement();
							var info       = this.getDialog().getContentElement( 'info', 'a11yfirstInfoImage').getElement();
							var hasCaption = this.getDialog().getContentElement( 'info', 'hasCaption').getElement();
							var caption    = this.getDialog().getContentElement( 'info', 'caption').getElement();
							var decorative = this.getDialog().getContentElement( 'info', 'isDecorative').getElement();

							var hasCaptionValue = this.getDialog().getContentElement( 'info', 'hasCaption').getValue();

							switch(value) {
								case 'decorative':
									alt.hide();
									info.hide();
									desc.hide();
									hasCaption.hide();
									caption.hide();
									decorative.show();
									break;

								case 'complex':
									alt.show();
									info.show();
									desc.show();
									hasCaption.show();
									if (hasCaptionValue) {
										caption.show();
									}
									decorative.hide();
									break;

								default:
									alt.show();
									info.show();
									hasCaption.show();
									if (hasCaptionValue) {
										caption.show();
									}
									desc.hide();
									decorative.hide();
									break;
							}
						},
						setup: function( widget ) {

							console.log('[widget]: ' + widget);
							if (!!widget) {
								console.log('[widget][data]: ' + widget.data);
								if (widget.data.alt) {
									console.log('[widget][data][  alt]: ' + widget.data.alt);
									console.log('[widget][data][title]: ' + widget.data.title);
								}
							}

							// setup does not seem to execute
						},
						commit: function( data ) {
//							if ( !data.url )
//								data.url = {};

//							data.url.protocol = this.getValue();
						}
					},
					{
						type: 'fieldset',
						label: 'Image Description',
						children: [
							{
								type: 'hbox',
								widths: [ '90%', '10%' ],
								align: 'bottom',
								children: [
									{
										id: 'alt',
										type: 'text',
										label: lang.alt,
										setup: function( widget ) {
											this.setValue( widget.data.alt );
										},
										commit: function( widget ) {
											widget.setData( 'alt', this.getValue() );
										},
										validate: function( widget) {

											var i, s, imageTypeValue = this.getDialog().getContentElement( 'info', 'imageType' ).getValue();

											var hasCaptionValue   = this.getDialog().getContentElement( 'info', 'hasCaption').getValue();
											var captionValue      = this.getDialog().getContentElement( 'info', 'caption').getValue();
											var captionNormalized = captionValue.trim().toLowerCase().replace(/^\s*|\s(?=\s)|\s*$/g, "");

											if (imageTypeValue !== 'decorative') {
												var alt = this.getValue();
												var altNormalized = alt.trim().toLowerCase().replace(/^\s*|\s(?=\s)|\s*$/g, "");
												var altLength = altNormalized.length;

												// Testing for empty alt
												if (altNormalized.length === 0) {
													if (hasCaptionValue) {
															if (captionNormalized.length === 0) {
																alert(lang.msgAltEmpty);
															}
															else {
																return confirm(lang.msgUseCaption);
															}
													}
													else {
														alert(lang.msgAltEmpty);
													}
													return false;
												}

												// Testing for empty alternative text
												if (alt.trim().length > lang.alternativeTextMaxLength) {
													alert(lang.msgAltToLong.replace('%s1', alt.trim().length).replace('%s2', lang.alternativeTextMaxLength));
													return false;
												}

												// Testing for file names in alternative text
												for (i = 0; i < lang.altContainsFilename.length; i++) {
													s = lang.altContainsFilename[i];
													if (altNormalized.indexOf(s) >= 0) {
														alert(lang.msgAltContainsFilename.replace('%s', s));
														return false;
													}
												}

												// Testing for common cases of invalid alternative text
												for (i = 0; i < lang.altIsInvalid.length; i++) {
													if (altNormalized === lang.altIsInvalid[i]) {
														alert(lang.msgAltIsInvalid.replace('%s', alt));
														return false;
													}
												}

												// Testing for alternative text starting with "image",...
												for (i = 0; i < lang.altStartsWithInvalid.length; i++) {
													if (altNormalized.indexOf(lang.altStartsWithInvalid[i]) === 0) {
														alert(lang.msgAltStartsWithInvalid.replace('%s', alt.substring(0,lang.altStartsWithInvalid[i].length)));
														return false;
													}
												}

												// Testing for alternative text ending with with "bytes",...
												for (i = 0; i < lang.altEndsWithInvalid.length; i++) {
													var s = lang.altEndsWithInvalid[i];
													if (altNormalized.substring((altLength-s.length),altLength) === s) {
														alert(lang.msgAltEndsWithInvalid);
														return false;
													}
												}
											}

											return true;

										}
									},
									{
								 	  id: 'a11yfirstInfoImage',
										type: 'button',
										label: lang.a11yfirstInfo,
										title: lang.a11yfirstInfoTitle,
										onClick: function() {
						          editor.a11yfirst.helpOption = 'ImageHelp';
						          editor.execCommand('a11yFirstHelpDialog');
										}
									}
								]
							},
							{
								type: 'hbox',
								children: [
									{
										id: 'desc',
										type: 'radio',
										label: lang.descriptionLocation,
										title: lang.descriptionLocationTitle,
										items: [
											[ lang.locationBefore, 'before' ],
											[ lang.locationAfter,  'after' ],
											[ lang.locationBoth,   'both' ]
										],
										setup: function( widget ) {
											if (widget.data.title && widget.data.title.length) {

												var imageType = this.getDialog().getContentElement( 'info', 'imageType' );

												var title = widget.data.title.toLowerCase();
												var hasBefore = title.indexOf(lang.locationBefore.toLowerCase()) >= 0;
												var hasAfter  = title.indexOf(lang.locationAfter.toLowerCase()) >= 0;
												var hasBoth   = title.indexOf(lang.locationBoth.toLowerCase()) >= 0;

												if (hasBoth || (hasBefore && hasAfter)) {
													this.setValue( 'both' );
													imageType.setValue('complex');
												}
												else {
													if (hasBefore) {
														this.setValue( 'before' );
														imageType.setValue('complex');
													}
													else {
														if (hasAfter) {
															this.setValue( 'after' );
															imageType.setValue('complex');
														}
														else {
															this.getElement().hide();
														}
													}
												}
											}
											else {
												this.getElement().hide();
											}
										},
										commit: function( widget ) {
											var value = this.getValue();

											if (value === 'before') {
												widget.setData( 'title', lang.locationBeforeTitle );
											}

											if (value === 'after') {
												widget.setData( 'title', lang.locationAfterTitle );
											}

											if (value === 'both') {
												widget.setData( 'title', lang.locationBothTitle );
											}
										}
									}
								]
							},
							{
								id: 'hasCaption',
								type: 'checkbox',
								label: lang.captioned,
								requiredContent: features.caption.requiredContent,
								setup: function( widget ) {
									this.setValue( widget.data.hasCaption );
								},
								onClick: function() {
									var caption    = this.getDialog().getContentElement( 'info', 'caption').getElement();

									if (this.getValue()) {
										caption.show();
									}
									else {
										caption.hide();
									}
								},
								commit: function( widget ) {
									widget.setData( 'hasCaption', this.getValue() );
								}
							},
							{
								id: 'caption',
								type: 'text',
								label: lang.caption,
								requiredContent: features.caption.requiredContent,
								setup: function( widget ) {
									if ( widget.data.hasCaption ) {
										if ( caption ) {
											this.setValue( caption.getHtml() );
										}
									}
									else {
										this.getElement().hide();
									}
								},
								commit: function( widget ) {
									if ( caption ) {
										caption.setHtml(this.getValue());
									}
									editor.lang.a11yimage2.figCaptionValue = this.getValue();
								}
							},
							{
								id: 'isDecorative',
								type: 'html',
								html: '<p>' + lang.isDecorative + '</p>',
								setup: function( widget ) {
									this.getElement().hide();
								}
							}
						]
					},
					{
						type: 'vbox',
						padding: 0,
						children: [
							{
								type: 'hbox',
								widths: [ '100%' ],
								className: 'cke_dialog_image_url',
								children: srcBoxChildren
							}
						]
					},
					{
						type: 'hbox',
						widths: [ '25%', '25%', '50%' ],
						requiredContent: features.dimension.requiredContent,
						children: [
							{
								type: 'text',
								width: '45px',
								id: 'width',
								label: commonLang.width,
								validate: validateDimension,
								onKeyUp: onChangeDimension,
								onLoad: function() {
									widthField = this;
								},
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
								label: commonLang.height,
								validate: validateDimension,
								onKeyUp: onChangeDimension,
								onLoad: function() {
									heightField = this;
								},
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
								onLoad: onLoadLockReset,
								setup: function( widget ) {
									toggleLockRatio( widget.data.lock );
								},
								commit: function( widget ) {
									widget.setData( 'lock', lockRatio );
								},
								html: lockResetHtml
							}
						]
					},
					{
						type: 'hbox',
						id: 'alignment',
						requiredContent: features.align.requiredContent,
						children: [
							{
								id: 'align',
								type: 'radio',
								items: [
									[ commonLang.alignNone, 'none' ],
									[ commonLang.alignLeft, 'left' ],
									[ commonLang.alignCenter, 'center' ],
									[ commonLang.alignRight, 'right' ]
								],
								label: commonLang.align,
								setup: function( widget ) {
									this.setValue( widget.data.align );
								},
								commit: function( widget ) {
									widget.setData( 'align', this.getValue() );
								}
							}
						]
					}
				]
			},
			{
				id: 'Upload',
				hidden: true,
				filebrowser: 'uploadButton',
				label: lang.uploadTab,
				elements: [
					{
						type: 'file',
						id: 'upload',
						label: lang.btnUpload,
						style: 'height:40px'
					},
					{
						type: 'fileButton',
						id: 'uploadButton',
						filebrowser: 'info:src',
						label: lang.btnUpload,
						'for': [ 'Upload', 'upload' ]
					}
				]
			}
		]
	};
} );
