/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

(function () {
    CKEDITOR.ui.dialog.file.prototype.getFileName = function () {
        return this.getValue().replace(/^.*[\\\/]/, '');
    };

    var wrapFileName = function (fileName) {
        var regExpString = '^cid:';
        var regExp = new RegExp(regExpString);

        if (regExp.test(fileName))
            return fileName;

        return "cid:" + fileName;
    };

	var imageDialog = function( editor, dialogType ) {
			// Load image preview.
			var IMAGE = 1,
				LINK = 2,
				PREVIEW = 4,
				CLEANUP = 8,
				regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
				regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i,
				pxLengthRegex = /^\d+px$/;

			var onSizeChange = function() {
				var value = this.getValue(),
					// This = input element.
					dialog = this.getDialog(),
					aMatch = value.match( regexGetSize ); // Check value
				if ( aMatch ) {
					if ( aMatch[ 2 ] == '%' ) // % is allowed - > unlock ratio.
				    	switchLockRatio( dialog, false ); // Unlock.
					value = aMatch[ 1 ];
				}

				// Only if ratio is locked
				if ( dialog.lockRatio ) {
					var oImageOriginal = dialog.originalElement;
					if ( oImageOriginal.getCustomData( 'isReady' ) == 'true' ) {
						if ( this.id == 'txtHeight' ) {
							if ( value && value != '0' )
								value = Math.round( oImageOriginal.$.width * ( value / oImageOriginal.$.height ) );
							if ( !isNaN( value ) )
								dialog.setValueOf( 'info', 'txtWidth', value );
						}
						// this.id = txtWidth.
						else {
							if ( value && value != '0' )
								value = Math.round( oImageOriginal.$.height * ( value / oImageOriginal.$.width ) );
							if ( !isNaN( value ) )
								dialog.setValueOf( 'info', 'txtHeight', value );
						}
					}
				}
				updatePreview( dialog );
			};

			var updatePreview = function( dialog ) {
					//Don't load before onShow.
					if ( !dialog.originalElement || !dialog.preview )
						return 1;

					// Read attributes and update imagePreview;
					dialog.commitContent( PREVIEW, dialog.preview );
					return 0;
				};

			// Custom commit dialog logic, where we're intended to give inline style
			// field (txtdlgGenStyle) higher priority to avoid overwriting styles contribute
			// by other fields.
			function commitContent() {
				var args = arguments;
				var inlineStyleField = this.getContentElement( 'advanced', 'txtdlgGenStyle' );
				inlineStyleField && inlineStyleField.commit.apply( inlineStyleField, args );

				this.foreach( function( widget ) {
					if ( widget.commit && widget.id != 'txtdlgGenStyle' )
						widget.commit.apply( widget, args );
				} );
			}

			// Avoid recursions.
			var incommit;

			// Synchronous field values to other impacted fields is required, e.g. border
			// size change should alter inline-style text as well.
			function commitInternally( targetFields ) {
				if ( incommit )
					return;

				incommit = 1;

				var dialog = this.getDialog(),
					element = dialog.imageElement;
				if ( element ) {
					// Commit this field and broadcast to target fields.
					this.commit( IMAGE, element );

					targetFields = [].concat( targetFields );
					var length = targetFields.length,
						field;
					for ( var i = 0; i < length; i++ ) {
						field = dialog.getContentElement.apply( dialog, targetFields[ i ].split( ':' ) );
						// May cause recursion.
						field && field.setup( IMAGE, element );
					}
				}

				incommit = 0;
			}

			var switchLockRatio = function( dialog, value ) {
                if (!dialog.getContentElement( 'attributes', 'ratioLock' ) )
						return null;

				var oImageOriginal = dialog.originalElement;

				// Dialog may already closed. (https://dev.ckeditor.com/ticket/5505)
				if ( !oImageOriginal )
					return null;

				// Check image ratio and original image ratio, but respecting user's preference.
				if ( value == 'check' ) {
					if ( !dialog.userlockRatio && oImageOriginal.getCustomData( 'isReady' ) == 'true' ) {
                        var width = dialog.getValueOf( 'attributes', 'txtWidth' ),
                            height = dialog.getValueOf( 'attributes', 'txtHeight' ),
                            originalRatio = oImageOriginal.$.width * 1000 / oImageOriginal.$.height,
                            thisRatio = width * 1000 / height;

						dialog.lockRatio = false; // Default: unlock ratio

						if ( !width && !height ) {
							dialog.lockRatio = true;
						} else {
							// Round ratio to two decimal places so ratio locking will be less precise (#2254).
							var ratioComparison = Math.round( ( originalRatio / thisRatio ) * 100 ) / 100;
                        
							if ( ratioComparison == 1 ) {
								dialog.lockRatio = true;
							}
						}
					}
				} else if ( value !== undefined ) {
					dialog.lockRatio = value;
				} else {
					dialog.userlockRatio = 1;
					dialog.lockRatio = !dialog.lockRatio;
				}

				var ratioButton = CKEDITOR.document.getById( btnLockSizesId );
				if ( dialog.lockRatio )
					ratioButton.removeClass( 'cke_btn_unlocked' );
				else
					ratioButton.addClass( 'cke_btn_unlocked' );

				ratioButton.setAttribute( 'aria-checked', dialog.lockRatio );

				// Ratio button hc presentation - WHITE SQUARE / BLACK SQUARE
				if ( CKEDITOR.env.hc ) {
					var icon = ratioButton.getChild( 0 );
					icon.setHtml( dialog.lockRatio ? CKEDITOR.env.ie ? '\u25A0' : '\u25A3' : CKEDITOR.env.ie ? '\u25A1' : '\u25A2' );
				}

				return dialog.lockRatio;
			};

            var resetSize = function (dialog) {
                var oImageOriginal = dialog.originalElement;
                if (oImageOriginal.getCustomData('isReady') == 'true') {
                    var widthField = dialog.getContentElement('attributes', 'txtWidth'),
                        heightField = dialog.getContentElement('attributes', 'txtHeight');
                    widthField && widthField.setValue(oImageOriginal.$.width);
                    heightField && heightField.setValue(oImageOriginal.$.height);
                }
                updatePreview(dialog);
            };

			var setupDimension = function( type, element ) {
					if ( type != IMAGE )
						return;

					function checkDimension( size, defaultValue ) {
						var aMatch = size.match( regexGetSize );
						if ( aMatch ) {
							// % is allowed.
							if ( aMatch[ 2 ] == '%' ) {
								aMatch[ 1 ] += '%';
								switchLockRatio( dialog, false ); // Unlock ratio
							}
							return aMatch[ 1 ];
						}
						return defaultValue;
					}

					var dialog = this.getDialog(),
						value = '',
						dimension = this.id == 'txtWidth' ? 'width' : 'height',
						size = element.getAttribute( dimension );

					if ( size )
						value = checkDimension( size, value );
					value = checkDimension( element.getStyle( dimension ), value );

					this.setValue( value );
				};

			var previewPreloader;

			var onImgLoadEvent = function() {
				// Image is ready.
				var original = this.originalElement,
						loader = CKEDITOR.document.getById( imagePreviewLoaderId );

				original.setCustomData( 'isReady', 'true' );
				original.removeListener( 'load', onImgLoadEvent );
				original.removeListener( 'error', onImgLoadErrorEvent );
				original.removeListener( 'abort', onImgLoadErrorEvent );

				// Hide loader.
				if ( loader )
					loader.setStyle( 'display', 'none' );

				// New image -> new dimensions
				if ( !this.dontResetSize ) {
					resetSize( this, editor.config.image_prefillDimensions === false );
				}

				if ( this.firstLoad ) {
					CKEDITOR.tools.setTimeout( function() {
						switchLockRatio( this, 'check' );
					}, 0, this );
				}

				this.firstLoad = false;
				this.dontResetSize = false;

				// Possible fix for https://dev.ckeditor.com/ticket/12818.
				updatePreview( this );
			};

			var onImgLoadErrorEvent = function() {
					// Error. Image is not loaded.
					var original = this.originalElement,
						loader = CKEDITOR.document.getById( imagePreviewLoaderId );

					original.removeListener( 'load', onImgLoadEvent );
					original.removeListener( 'error', onImgLoadErrorEvent );
					original.removeListener( 'abort', onImgLoadErrorEvent );

					// Set Error image.
					var noimage = CKEDITOR.getUrl( CKEDITOR.plugins.get( 'image' ).path + 'images/noimage.png' );

					if ( this.preview )
						this.preview.setAttribute( 'src', noimage );

					// Hide loader.
					if ( loader )
						loader.setStyle( 'display', 'none' );

					switchLockRatio( this, false ); // Unlock.
				};

			var numbering = function( id ) {
					return CKEDITOR.tools.getNextId() + '_' + id;
				},
				btnLockSizesId = numbering( 'btnLockSizes' ),
				btnResetSizeId = numbering( 'btnResetSize' ),
				imagePreviewLoaderId = numbering( 'ImagePreviewLoader' ),
				previewLinkId = numbering( 'previewLink' ),
                smallPreviewImageId = numbering('previewImage');

			return {
				title: editor.lang.image[ dialogType == 'image' ? 'title' : 'titleButton' ],
                minWidth: 420,
				minHeight: 360,
				onShow: function() {
					this.imageElement = false;
					this.linkElement = false;

					// Default: create a new element.
					this.imageEditMode = false;
					this.linkEditMode = false;

					this.lockRatio = true;
					this.userlockRatio = 0;
					this.dontResetSize = false;
					this.firstLoad = true;
					this.addLink = false;

					var editor = this.getParentEditor(),
						sel = editor.getSelection(),
						element = sel && sel.getSelectedElement(),
						link = element && editor.elementPath( element ).contains( 'a', 1 ),
						loader = CKEDITOR.document.getById( imagePreviewLoaderId );

					// Hide loader.
					if ( loader )
						loader.setStyle( 'display', 'none' );

					// Create the preview before setup the dialog contents.
					previewPreloader = new CKEDITOR.dom.element( 'img', editor.document );
                    this.preview = CKEDITOR.document.getById(smallPreviewImageId);

					// Copy of the image
					this.originalElement = editor.document.createElement( 'img' );
					this.originalElement.setAttribute( 'alt', '' );
					this.originalElement.setCustomData( 'isReady', 'false' );

					if ( link ) {
						this.linkElement = link;
						this.linkEditMode = true;

						// If there is an existing link, by default keep it (true).
						// It will be removed if certain conditions are met and Link tab is enabled. (https://dev.ckeditor.com/ticket/13351)
						this.addLink = true;

						// Look for Image element.
						var linkChildren = link.getChildren();
						if ( linkChildren.count() == 1 ) {
							var childTag = linkChildren.getItem( 0 );

							if ( childTag.type == CKEDITOR.NODE_ELEMENT ) {
								if ( childTag.is( 'img' ) || childTag.is( 'input' ) ) {
									this.imageElement = linkChildren.getItem( 0 );
									if ( this.imageElement.is( 'img' ) )
										this.imageEditMode = 'img';
									else if ( this.imageElement.is( 'input' ) )
										this.imageEditMode = 'input';
								}
							}
						}
						// Fill out all fields.
						if ( dialogType == 'image' )
							this.setupContent( LINK, link );
					}

					// Edit given image element instead the one from selection.
					if ( this.customImageElement ) {
						this.imageEditMode = 'img';
						this.imageElement = this.customImageElement;
						delete this.customImageElement;
					}
					else if ( element && element.getName() == 'img' && !element.data( 'cke-realelement' ) ||
						element && element.getName() == 'input' && element.getAttribute( 'type' ) == 'image' ) {
						this.imageEditMode = element.getName();
						this.imageElement = element;
					}

					if ( this.imageEditMode ) {
						// Use the original element as a buffer from  since we don't want
						// temporary changes to be committed, e.g. if the dialog is canceled.
						this.cleanImageElement = this.imageElement;
						this.imageElement = this.cleanImageElement.clone( true, true );

						// Fill out all fields.
						this.setupContent( IMAGE, this.imageElement );
                    } else
                        this.imageElement = editor.document.createElement('img');

					// Refresh LockRatio button
					switchLockRatio( this, true );

					// Dont show preview if no URL given.
					if ( !CKEDITOR.tools.trim( this.getValueOf( 'info', 'txtUrl' ) ) ) {
						this.preview.removeAttribute( 'src' );
						this.preview.setStyle( 'display', 'none' );
					}
				},
				onOk: function() {
					// Edit existing Image.
					if ( this.imageEditMode ) {
						var imgTagName = this.imageEditMode;

						// Image dialog and Input element.
						if ( dialogType == 'image' && imgTagName == 'input' && confirm( editor.lang.image.button2Img ) ) { // jshint ignore:line
							// Replace INPUT-> IMG
							imgTagName = 'img';
							this.imageElement = editor.document.createElement( 'img' );
							this.imageElement.setAttribute( 'alt', '' );
							editor.insertElement( this.imageElement );
						}
						// ImageButton dialog and Image element.
						else if ( dialogType != 'image' && imgTagName == 'img' && confirm( editor.lang.image.img2Button ) ) { // jshint ignore:line
							// Replace IMG -> INPUT
							imgTagName = 'input';
							this.imageElement = editor.document.createElement( 'input' );
							this.imageElement.setAttributes( {
								type: 'image',
								alt: ''
							} );
							editor.insertElement( this.imageElement );
						} else {
							// Restore the original element before all commits.
							this.imageElement = this.cleanImageElement;
							delete this.cleanImageElement;
						}
					}
					// Create a new image.
					else {
						// Image dialog -> create IMG element.
						if ( dialogType == 'image' )
							this.imageElement = editor.document.createElement( 'img' );
						else {
							this.imageElement = editor.document.createElement( 'input' );
							this.imageElement.setAttribute( 'type', 'image' );
						}
						this.imageElement.setAttribute( 'alt', '' );
					}

					// Create a new link.
					if ( !this.linkEditMode )
						this.linkElement = editor.document.createElement( 'a' );

					// Set attributes.
					this.commitContent( IMAGE, this.imageElement );
					this.commitContent( LINK, this.linkElement );

					// Remove empty style attribute.
					if ( !this.imageElement.getAttribute( 'style' ) )
						this.imageElement.removeAttribute( 'style' );

					// Insert a new Image.
					if ( !this.imageEditMode ) {
						if ( this.addLink ) {
							if ( !this.linkEditMode ) {
								// Insert a new link.
								editor.insertElement( this.linkElement );
								this.linkElement.append( this.imageElement, false );
							} else {
								// We already have a link in editor.
								if ( this.linkElement.equals( editor.getSelection().getSelectedElement() ) ) {
									// If the link is selected outside, replace it's content rather than the link itself. ([<a>foo</a>])
									this.linkElement.setHtml( '' );
									this.linkElement.append( this.imageElement, false );
								} else {
									// Only inside of the link is selected, so replace it with image. (<a>[foo]</a>, <a>[f]oo</a>)
									editor.insertElement( this.imageElement );
								}
							}
						} else {
							editor.insertElement( this.imageElement );
						}
					}
					// Image already exists.
					else {
						// Add a new link element.
						if ( !this.linkEditMode && this.addLink ) {
							editor.insertElement( this.linkElement );
							this.imageElement.appendTo( this.linkElement );
						}
						// Remove Link, Image exists.
						else if ( this.linkEditMode && !this.addLink ) {
							editor.getSelection().selectElement( this.linkElement );
							editor.insertElement( this.imageElement );
						}
					}
				},
				onLoad: function() {
					if ( dialogType != 'image' )
						this.hidePage( 'Link' ); //Hide Link tab.
					var doc = this._.element.getDocument();

					if ( this.getContentElement( 'info', 'ratioLock' ) ) {
						this.addFocusable( doc.getById( btnResetSizeId ), 5 );
						this.addFocusable( doc.getById( btnLockSizesId ), 5 );
					}

					this.commitContent = commitContent;
				},
				onHide: function() {
					if ( this.preview )
						this.commitContent( CLEANUP, this.preview );

					if ( this.originalElement ) {
						this.originalElement.removeListener( 'load', onImgLoadEvent );
						this.originalElement.removeListener( 'error', onImgLoadErrorEvent );
						this.originalElement.removeListener( 'abort', onImgLoadErrorEvent );
						this.originalElement.remove();
						this.originalElement = false; // Dialog is closed.
					}

					delete this.imageElement;
				},
				contents: [ {
					id: 'info',
					label: editor.lang.image.infoTab,
					elements: [ {
						type: 'vbox',
						padding: 0,
						children: [ {
							type: 'hbox',
                            widths: ['150px', 'auto'],
							align: 'right',
                            children: [ {
                                    type: 'checkbox',
                                    id: 'imageFromDisk',
                                    label: 'Wstaw obrazek z dysku',
                                    'default': 'checked',
                                    setup: function (type, element) {
                                        if (type == IMAGE) {
                                            var regExpString = '^cid:';
                                            var regExp = new RegExp(regExpString);

                                            if (regExp.test(element.getAttribute('src'))) {
                                                this.setValue(true);
                                            } else {
                                                this.setValue(false);
                                            }
                                        }
                                    },
                                    onChange: function () {
                                        var dialog = this.getDialog();

                                        var value = this.getValue();
                                        var txtUrl = dialog.getContentElement('info', 'txtUrl');
                                        var fileUpload = dialog.getContentElement('info', 'fileUpload');

                                        if (value) {
                                            fileUpload.enable();
                                            txtUrl.disable();
                                        } else {
                                            fileUpload.disable();
                                            txtUrl.enable();
                                        }
                                    }
                                }, {
                                    id: 'fileUpload',
                                    type: 'file',
                                    size: 38,
                                    onShow: function () {
                                        var dialog = this.getDialog();

                                        var enabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                                        if (enabled) {
                                            this.enable();
                                        } else {
                                            this.disable();
                                        }
                                    },
                                    onChange: function () {
                                        var dialog = this.getDialog();
                                        var newFileName = this.getFileName();

                                        var enabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                                        if (!enabled) {
                                            return;
                                        }

                                        if (typeof (this.isSetup) != 'undefined' && this.isSetup) {
                                            newFileName = this.urlFromSetup;
                                        }

                                        //Update original image
                                        //Prevent from load before onShow
                                        if (newFileName.length > 0) {
                                            var pathToImage = wrapFileName(newFileName);

                                            var original = dialog.originalElement;

                                            if (dialog.preview) {
                                                dialog.preview.removeStyle('display');
                                            }

                                            original.setCustomData('isReady', 'false');

                                            // Show loader.
                                            var loader = CKEDITOR.document.getById(imagePreviewLoaderId);
                                            if (loader) {
                                                loader.setStyle('display', '');
                                            }

                                            original.on('load', onImgLoadEvent, dialog);
                                            original.on('error', onImgLoadErrorEvent, dialog);
                                            original.on('abort', onImgLoadErrorEvent, dialog);
                                            original.setAttribute('src', pathToImage);

                                            if (dialog.preview) {
                                                // Query the preloader to figure out the url impacted by based href.
                                                previewPreloader.setAttribute('src', pathToImage);
                                                dialog.preview.setAttribute('src', previewPreloader.$.src);
                                                updatePreview(dialog);
                                            }
                                        } else if (dialog.preview) { // Dont show preview if no URL given.
                                            dialog.preview.removeAttribute('src');
                                            dialog.preview.setStyle('display', 'none');
                                        }
                                    },
                                    setup: function (type, element) {
                                        if (type == IMAGE) {
                                            var dialog = this.getDialog();
                                            var enabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                                            if (!enabled) {
                                                return;
                                            }

                                            this.isSetup = true;
                                            this.urlFromSetup = element.data('cke-saved-src') || element.getAttribute('src');

                                            this.getDialog().dontResetSize = true;

                                            this.setValue('');

                                        }
                                    },
                                    commit: function (type, element) {
                                        var dialog = this.getDialog();
                                        var enabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                                        if (!enabled) {
                                            return;
                                        }

                                        if (type == IMAGE && (this.getValue() || this.isChanged())) {
                                            var newFileName = this.getFileName();
                                            var pathToImage = wrapFileName(newFileName);

                                            element.data('cke-saved-src', pathToImage);
                                            element.setAttribute('src', pathToImage);
                                        } else if (type == CLEANUP) {
                                            element.data('cke-saved-src', '');
                                            element.setAttribute('src', '');
                                        }
                                    },
                                    validate: function () {
                                        if (typeof (this.isSetup) != 'undefined' && this.isSetup) {
                                            this.isSetup = false;

                                            return true;
                                        }

                                        var isValid = true;
                                        var dialog = this.getDialog();

                                        var enabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                                        if (enabled && !this.getFileName()) {
                                            isValid = false;

                                            alert(editor.lang.image.noImageSelected);
                                        }

                                        return isValid;
                                    }
                                }]
						} ]
					},
                    {
                        id: 'txtUrl',
                        type: 'text',
                        label: editor.lang.common.url,
                        onShow: function () {
                            var dialog = this.getDialog();

                            var disabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                            if (disabled) {
                                this.disable();
                            } else {
                                this.enable();
                            }
                        },
                        onChange: function () {
                            var dialog = this.getDialog(),
                                newUrl = this.getValue();

                            //Update original image
                            if (newUrl.length > 0) //Prevent from load before onShow
                            {
                                dialog = this.getDialog();
                                var original = dialog.originalElement;

                                if (dialog.preview) {
                                    dialog.preview.removeStyle('display');
                                }

                                original.setCustomData('isReady', 'false');
                                // Show loader.
                                var loader = CKEDITOR.document.getById(imagePreviewLoaderId);
                                if (loader)
                                    loader.setStyle('display', '');

                                original.on('load', onImgLoadEvent, dialog);
                                original.on('error', onImgLoadErrorEvent, dialog);
                                original.on('abort', onImgLoadErrorEvent, dialog);
                                original.setAttribute('src', newUrl);

                                if (dialog.preview) {
                                    // Query the preloader to figure out the url impacted by based href.
                                    previewPreloader.setAttribute('src', newUrl);
                                    dialog.preview.setAttribute('src', previewPreloader.$.src);
                                    updatePreview(dialog);
                                }
                            }
                            // Dont show preview if no URL given.
                            else if (dialog.preview) {
                                dialog.preview.removeAttribute('src');
                                dialog.preview.setStyle('display', 'none');
                            }
                        },
                        setup: function (type, element) {
                            if (type == IMAGE) {
                                if (!/https?:\/\//i.test(element.getAttribute('src'))) {
                                    return;
                                }

                                var url = element.data('cke-saved-src') || element.getAttribute('src');
                                var field = this;

                                this.getDialog().dontResetSize = true;

                                field.setValue(url);

                                field.setInitValue();
                            }
                        },
                        commit: function (type, element) {
                            var dialog = this.getDialog();
                            var disabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                            if (disabled) {
                                return;
                            }

                            if (type == IMAGE && (this.getValue() || this.isChanged())) {
                                element.data('cke-saved-src', this.getValue());
                                element.setAttribute('src', this.getValue());
                            } else if (type == CLEANUP) {
                                element.setAttribute('src', ''); // If removeAttribute doesn't work.
                                element.removeAttribute('src');
                            }
                        },
                        validate: function () {
                            var isValid = true;
                            var dialog = this.getDialog();

                            var disabled = dialog.getContentElement('info', 'imageFromDisk').getValue();

                            if (!disabled && !this.getValue()) {
                                isValid = false;

                                alert(editor.lang.image.urlMissing);
                            }

                            return isValid;
                        }
                    },
                    {
                        id: 'txtAlt',
                        type: 'text',
                        label: editor.lang.image.alt,
                        accessKey: 'T',
                        'default': '',
                        onChange: function () {
                            updatePreview(this.getDialog());
                        },
                        setup: function (type, element) {
                            if (type == IMAGE)
                                this.setValue(element.getAttribute('alt'));
                        },
                        commit: function (type, element) {
                            if (type == IMAGE) {
                                if (this.getValue() || this.isChanged())
                                    element.setAttribute('alt', this.getValue());
                            } else if (type == PREVIEW)
                                element.setAttribute('alt', this.getValue());
                            else if (type == CLEANUP)
                                element.removeAttribute('alt');

                        }
                    },
                    {
                        type: 'html',
                        id: 'htmlPreview',
                        html: '<div>' + CKEDITOR.tools.htmlEncode(editor.lang.common.preview) + '<br>' +
                            '<div id="' + imagePreviewLoaderId + '" class="ImagePreviewLoader" style="display:none"><div class="loading">&nbsp;</div></div>' +
                            '<div class="ImagePreviewBox">' +
                            '<img id="' + smallPreviewImageId + '" alt="" />' +
                            '</div></div>'
                    } ]
                },
                {
					id: 'attributes',
					label: editor.lang.image.attrTab,
					elements: [
						{
						    type: 'hbox',
						    widths: ['200px', 'auto'],
						    children: [
								{
								    type: 'hbox',
								    requiredContent: 'img{width,height}',
								    widths: ['60px', 'auto'],
								    children: [
										{
										    type: 'vbox',
										    padding: 1,
										    children: [
												{
												    type: 'text',
												    width: '60px',
												    id: 'txtWidth',
												    label: editor.lang.common.width,
												    onKeyUp: onSizeChange,
												    onChange: function () {
												        commitInternally.call(this, 'advanced:txtdlgGenStyle');
												    },
												    validate: function () {
												        var aMatch = this.getValue().match(regexGetSizeOrEmpty),
															isValid = !!(aMatch && parseInt(aMatch[1], 10) !== 0);
												        if (!isValid)
												            alert(editor.lang.common.invalidWidth);
												        return isValid;
												    },
												    setup: setupDimension,
												    commit: function (type, element, internalCommit) {
												        var value = this.getValue();
												        if (type == IMAGE) {
												            if (value && editor.activeFilter.check('img{width,height}'))
												                element.setStyle('width', CKEDITOR.tools.cssLength(value));
												            else
												                element.removeStyle('width');

												            !internalCommit && element.removeAttribute('width');
												        } else if (type == PREVIEW) {
												            var aMatch = value.match(regexGetSize);
												            if (!aMatch) {
												                var oImageOriginal = this.getDialog().originalElement;
												                if (oImageOriginal.getCustomData('isReady') == 'true')
												                    element.setStyle('width', oImageOriginal.$.width + 'px');
												            } else
												                element.setStyle('width', CKEDITOR.tools.cssLength(value));
												        } else if (type == CLEANUP) {
												            element.removeAttribute('width');
												            element.removeStyle('width');
												        }
												    }
												},
												{
												    type: 'text',
												    id: 'txtHeight',
												    width: '60px',
												    label: editor.lang.common.height,
												    onKeyUp: onSizeChange,
												    onChange: function () {
												        commitInternally.call(this, 'advanced:txtdlgGenStyle');
												    },
												    validate: function () {
												        var aMatch = this.getValue().match(regexGetSizeOrEmpty),
															isValid = !!(aMatch && parseInt(aMatch[1], 10) !== 0);
												        if (!isValid)
												            alert(editor.lang.common.invalidHeight);
												        return isValid;
												    },
												    setup: setupDimension,
												    commit: function (type, element, internalCommit) {
												        var value = this.getValue();
												        if (type == IMAGE) {
												            if (value && editor.activeFilter.check('img{width,height}'))
												                element.setStyle('height', CKEDITOR.tools.cssLength(value));
												            else
												                element.removeStyle('height');

												            !internalCommit && element.removeAttribute('height');
												        } else if (type == PREVIEW) {
												            var aMatch = value.match(regexGetSize);
												            if (!aMatch) {
												                var oImageOriginal = this.getDialog().originalElement;
												                if (oImageOriginal.getCustomData('isReady') == 'true')
												                    element.setStyle('height', oImageOriginal.$.height + 'px');
												            } else
												                element.setStyle('height', CKEDITOR.tools.cssLength(value));
												        } else if (type == CLEANUP) {
												            element.removeAttribute('height');
												            element.removeStyle('height');
												        }
												    }
												},
												{
												    type: 'text',
												    id: 'txtBorder',
												    requiredContent: 'img{border-width}',
												    width: '60px',
												    label: editor.lang.image.border,
												    'default': '',
												    onKeyUp: function () {
												        updatePreview(this.getDialog());
												    },
												    onChange: function () {
												        commitInternally.call(this, 'advanced:txtdlgGenStyle');
												    },
												    validate: CKEDITOR.dialog.validate.integer(editor.lang.image.validateBorder),
												    setup: function (type, element) {
												        if (type == IMAGE) {
												            var value,
																borderStyle = element.getStyle('border-width');
												            borderStyle = borderStyle && borderStyle.match(/^(\d+px)(?: \1 \1 \1)?$/);
												            value = borderStyle && parseInt(borderStyle[1], 10);
												            isNaN(parseInt(value, 10)) && (value = element.getAttribute('border'));
												            this.setValue(value);
												        }
												    },
												    commit: function (type, element, internalCommit) {
												        var value = parseInt(this.getValue(), 10);
												        if (type == IMAGE || type == PREVIEW) {
												            if (!isNaN(value)) {
												                element.setStyle('border-width', CKEDITOR.tools.cssLength(value));
												                element.setStyle('border-style', 'solid');
												            } else if (!value && this.isChanged())
												                element.removeStyle('border');

												            if (!internalCommit && type == IMAGE)
												                element.removeAttribute('border');
												        } else if (type == CLEANUP) {
												            element.removeAttribute('border');
												            element.removeStyle('border-width');
												            element.removeStyle('border-style');
												            element.removeStyle('border-color');
												        }
												    }
												}
											]
										},
										{
										    id: 'ratioLock',
										    type: 'html',
										    style: 'width:40px;margin:35px 0 0 0;',
										    onLoad: function () {
										        // Activate Reset button
										        var resetButton = CKEDITOR.document.getById(btnResetSizeId),
													ratioButton = CKEDITOR.document.getById(btnLockSizesId);
										        if (resetButton) {
										            resetButton.on('click', function (evt) {
										                resetSize(this);
										                evt.data && evt.data.preventDefault();
										            }, this.getDialog());
										            resetButton.on('mouseover', function () {
										                this.addClass('cke_btn_over');
										            }, resetButton);
										            resetButton.on('mouseout', function () {
										                this.removeClass('cke_btn_over');
										            }, resetButton);
										        }
										        // Activate (Un)LockRatio button
										        if (ratioButton) {
										            ratioButton.on('click', function (evt) {
										                var locked = switchLockRatio(this),
															oImageOriginal = this.originalElement,
															width = this.getValueOf('attributes', 'txtWidth');

										                if (oImageOriginal.getCustomData('isReady') == 'true' && width) {
										                    var height = oImageOriginal.$.height / oImageOriginal.$.width * width;
										                    if (!isNaN(height)) {
										                        this.setValueOf('attributes', 'txtHeight', Math.round(height));
										                        updatePreview(this);
										                    }
										                }
										                evt.data && evt.data.preventDefault();
										            }, this.getDialog());
										            ratioButton.on('mouseover', function () {
										                this.addClass('cke_btn_over');
										            }, ratioButton);
										            ratioButton.on('mouseout', function () {
										                this.removeClass('cke_btn_over');
										            }, ratioButton);
										        }
										    },
										    html: '<div>' +
												'<a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.lockRatio +
												'" class="cke_btn_locked" id="' + btnLockSizesId + '" role="checkbox"><span class="cke_icon"></span><span class="cke_label">' + editor.lang.image.lockRatio + '</span></a>' +
												'<a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.resetSize +
												'" class="cke_btn_reset" id="' + btnResetSizeId + '" role="button"><span class="cke_label">' + editor.lang.image.resetSize + '</span></a>' +
												'</div>'
										}
									]
								},
								{
								    type: 'vbox',
								    padding: 1,
								    children: [
										{
										    type: 'text',
										    id: 'txtHSpace',
										    requiredContent: 'img{margin-left,margin-right}',
										    width: '60px',
										    label: editor.lang.image.hSpace,
										    'default': '',
										    onKeyUp: function () {
										        updatePreview(this.getDialog());
										    },
										    onChange: function () {
										        commitInternally.call(this, 'advanced:txtdlgGenStyle');
										    },
										    validate: CKEDITOR.dialog.validate.integer(editor.lang.image.validateHSpace),
										    setup: function (type, element) {
										        if (type == IMAGE) {
										            var value, marginLeftPx, marginRightPx,
														marginLeftStyle = element.getStyle('margin-left'),
														marginRightStyle = element.getStyle('margin-right');

										            marginLeftStyle = marginLeftStyle && marginLeftStyle.match(pxLengthRegex);
										            marginRightStyle = marginRightStyle && marginRightStyle.match(pxLengthRegex);
										            marginLeftPx = parseInt(marginLeftStyle, 10);
										            marginRightPx = parseInt(marginRightStyle, 10);

										            value = (marginLeftPx == marginRightPx) && marginLeftPx;
										            isNaN(parseInt(value, 10)) && (value = element.getAttribute('hspace'));

										            this.setValue(value);
										        }
										    },
										    commit: function (type, element, internalCommit) {
										        var value = parseInt(this.getValue(), 10);
										        if (type == IMAGE || type == PREVIEW) {
										            if (!isNaN(value)) {
										                element.setStyle('margin-left', CKEDITOR.tools.cssLength(value));
										                element.setStyle('margin-right', CKEDITOR.tools.cssLength(value));
										            } else if (!value && this.isChanged()) {
										                element.removeStyle('margin-left');
										                element.removeStyle('margin-right');
										            }

										            if (!internalCommit && type == IMAGE)
										                element.removeAttribute('hspace');
										        } else if (type == CLEANUP) {
										            element.removeAttribute('hspace');
										            element.removeStyle('margin-left');
										            element.removeStyle('margin-right');
										        }
										    }
										},
										{
										    type: 'text',
										    id: 'txtVSpace',
										    requiredContent: 'img{margin-top,margin-bottom}',
										    width: '60px',
										    label: editor.lang.image.vSpace,
										    'default': '',
										    onKeyUp: function () {
										        updatePreview(this.getDialog());
										    },
										    onChange: function () {
										        commitInternally.call(this, 'advanced:txtdlgGenStyle');
										    },
										    validate: CKEDITOR.dialog.validate.integer(editor.lang.image.validateVSpace),
										    setup: function (type, element) {
										        if (type == IMAGE) {
										            var value, marginTopPx, marginBottomPx,
														marginTopStyle = element.getStyle('margin-top'),
														marginBottomStyle = element.getStyle('margin-bottom');

										            marginTopStyle = marginTopStyle && marginTopStyle.match(pxLengthRegex);
										            marginBottomStyle = marginBottomStyle && marginBottomStyle.match(pxLengthRegex);
										            marginTopPx = parseInt(marginTopStyle, 10);
										            marginBottomPx = parseInt(marginBottomStyle, 10);

										            value = (marginTopPx == marginBottomPx) && marginTopPx;
										            isNaN(parseInt(value, 10)) && (value = element.getAttribute('vspace'));
										            this.setValue(value);
										        }
										    },
										    commit: function (type, element, internalCommit) {
										        var value = parseInt(this.getValue(), 10);
										        if (type == IMAGE || type == PREVIEW) {
										            if (!isNaN(value)) {
										                element.setStyle('margin-top', CKEDITOR.tools.cssLength(value));
										                element.setStyle('margin-bottom', CKEDITOR.tools.cssLength(value));
										            } else if (!value && this.isChanged()) {
										                element.removeStyle('margin-top');
										                element.removeStyle('margin-bottom');
										            }

										            if (!internalCommit && type == IMAGE)
										                element.removeAttribute('vspace');
										        } else if (type == CLEANUP) {
										            element.removeAttribute('vspace');
										            element.removeStyle('margin-top');
										            element.removeStyle('margin-bottom');
										        }
										    }
										},
										{
										    id: 'cmbAlign',
										    requiredContent: 'img{float}',
										    type: 'select',
										    widths: ['35%', '65%'],
										    style: 'width:125px',
										    label: editor.lang.common.align,
										    'default': '',
										    items: [
												[editor.lang.common.notSet, ''],
												[editor.lang.common.alignLeft, 'left'],
												[editor.lang.common.alignRight, 'right']
										    // Backward compatible with v2 on setup when specified as attribute value,
										    // while these values are no more available as select options.
										    //	[ editor.lang.image.alignAbsBottom , 'absBottom'],
										    //	[ editor.lang.image.alignAbsMiddle , 'absMiddle'],
										    //  [ editor.lang.image.alignBaseline , 'baseline'],
										    //  [ editor.lang.image.alignTextTop , 'text-top'],
										    //  [ editor.lang.image.alignBottom , 'bottom'],
										    //  [ editor.lang.image.alignMiddle , 'middle'],
										    //  [ editor.lang.image.alignTop , 'top']
											],
										    onChange: function () {
										        updatePreview(this.getDialog());
										        commitInternally.call(this, 'advanced:txtdlgGenStyle');
										    },
										    setup: function (type, element) {
										        if (type == IMAGE) {
										            var value = element.getStyle('float');
										            switch (value) {
										                // Ignore those unrelated values.  
										                case 'inherit':
										                case 'none':
										                    value = '';
										            }

										            !value && (value = (element.getAttribute('align') || '').toLowerCase());
										            this.setValue(value);
										        }
										    },
										    commit: function (type, element, internalCommit) {
										        var value = this.getValue();
										        if (type == IMAGE || type == PREVIEW) {
										            if (value)
										                element.setStyle('float', value);
										            else
										                element.removeStyle('float');

										            if (!internalCommit && type == IMAGE) {
										                value = (element.getAttribute('align') || '').toLowerCase();
										                switch (value) {
										                    // we should remove it only if it matches "left" or "right",  
										                    // otherwise leave it intact.  
										                    case 'left':
										                    case 'right':
										                        element.removeAttribute('align');
										                }
										            }
										        } else if (type == CLEANUP)
										            element.removeStyle('float');
										    }
										}
									]
								}
							]
						}
					]
	} ]
			};
		};

	CKEDITOR.dialog.add( 'image', function( editor ) {
		return imageDialog( editor, 'image' );
	} );

	CKEDITOR.dialog.add( 'imagebutton', function( editor ) {
		return imageDialog( editor, 'imagebutton' );
	} );
} )();
