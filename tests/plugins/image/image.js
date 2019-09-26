/* bender-tags: editor,image,dialog */
/* bender-ckeditor-plugins: image,button,toolbar,link */

( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			autoParagraph: false
		}
	};

	var SRC = '%BASE_PATH%_assets/logo.png',
		imgs = [
			{ url: '%BASE_PATH%_assets/logo.png', width: '163', height: '61' },
			{ url: '%BASE_PATH%_assets/large.jpg', width: '1008', height: '550' }
		],
		downloadImage = bender.tools.downloadImage;

	var imageProps = {
		txtWidth: 414,
		txtHeight: 86,
		txtBorder: 2,
		txtHSpace: 5,
		txtVSpace: 10,
		cmbAlign: 'right'
	};

	function testReadImage( bot, htmlWithSelection, inpValMap, onDialogShowCb ) {
		var key,
			inputName,
			tabName = 'info';

		bot.editor.focus();
		bot.setHtmlWithSelection( htmlWithSelection );

		bot.dialog( 'image', function( dialog ) {
			if ( typeof onDialogShowCb == 'function' ) {
				onDialogShowCb( dialog );
			}

			for ( key in inpValMap ) {
				if ( inpValMap.hasOwnProperty( key ) ) {
					var expectedValue = inpValMap[ key ];

					var keySplit = key.split( ':' );

					if ( keySplit.length == 1 )
						inputName = keySplit[ 0 ];
					else {
						inputName = keySplit[ 1 ];
						tabName = keySplit[ 0 ];
					}

					var field = dialog.getContentElement( tabName, inputName );
					// Typeof NaN == number, so if NaN is passed as expected value, input value will be parsed.
					var realValue = ( typeof expectedValue == 'number' ) ? parseInt( field.getValue(), 10 ) : field.getValue();
					var errorMessage = 'Wrong value for input ' + inputName + '.';

					if ( isNaN( expectedValue ) )
						assert.isNaN( realValue, errorMessage );
					else
						assert.areSame( expectedValue, realValue, errorMessage );
				}
			}

			dialog.getButton( 'ok' ).click();
		} );
	}

	function testUpdateImage( bot, htmlWithSelection, expectedOutput, inpValMap ) {
		var key,
			inputName,
			tabName = 'info';

		bot.editor.focus();
		bot.setHtmlWithSelection( htmlWithSelection );

		bot.dialog( 'image', function( dialog ) {
			for ( key in inpValMap ) {
				if ( inpValMap.hasOwnProperty( key ) ) {
					var keySplit = key.split( ':' );

					if ( keySplit.length == 1 )
						inputName = keySplit[ 0 ];
					else {
						inputName = keySplit[ 1 ];
						tabName = keySplit[ 0 ];
					}

					var field = dialog.getContentElement( tabName, inputName );

					field.setValue( inpValMap[ key ] );
				}
			}

			dialog.getButton( 'ok' ).click();

			if ( typeof expectedOutput == 'function' ) {
				expectedOutput();
			} else {
				assert.areEqual( expectedOutput.toLowerCase(), bot.getData( true ) );
			}
		} );
	}

	bender.test( {
		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}
		},

		// (#2423)
		'test image dialog model during image creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'image', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		// (#2423)
		'test dialog model with existing image': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '<image src="' + SRC + '"/>', function() {
				bot.dialog( 'image', function( dialog ) {
					var img = editor.editable().findOne( 'img' );

					editor.getSelection().selectElement( img );

					assert.areEqual( img, dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		'test read image (inline styles)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" style="border:solid 2px;height:86px;margin:10px 5px;float:right;width:414px;">]';

			testReadImage( this.editorBot, htmlWithSelection, imageProps );
		},

		'test read image (attributes)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" border="2" height="86" width="414" vspace="10" hspace="5" align="right">]';

			testReadImage( this.editorBot, htmlWithSelection, imageProps );
		},

		'test read image (align)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" align="texttop" style="float:inherit">]';

			testReadImage( this.editorBot, htmlWithSelection, {
				cmbAlign: ''
			} );
		},

		'test read image (inline v.s. attributes)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" ' +
				'border="1" height="43" width="212" vspace="0" hspace="0" align="left" ' +
				'style="border:solid 2px blue;width:414px;height:86px;margin:10px 5px;vertical-align:bottom;float:right">]';

			testReadImage( this.editorBot, htmlWithSelection, imageProps );
		},

		'test read image (border/margin styles)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" ' +
				'style="border-bottom-width:2px;border-left-width:2px;border-right-width:2px;border-top-width:2px;' +
				'margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;">]';

			testReadImage( this.editorBot, htmlWithSelection, {
				txtBorder: 2,
				txtHSpace: 5,
				txtVSpace: 10
			} );
		},

		'test read image (unrecognized border styles)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" ' +
				'style="border-style:solid;border-bottom-width:1px;border-left-width:2px;border-right-width:2px;border-top-width:2px;' +
				'margin: 10px 5px 11px;">]';

			testReadImage( this.editorBot, htmlWithSelection, {
				txtBorder: Number.NaN,
				txtHSpace: 5,
				txtVSpace: Number.NaN
			} );
		},

		'test read image (sync styles from advanced tab)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" style="">]';

			testReadImage( this.editorBot, htmlWithSelection, {
				txtWidth: 200,
				txtHeight: 300,
				txtBorder: 1,
				txtHSpace: 5,
				txtVSpace: 10,
				cmbAlign: 'left'
			}, function( dialog ) {
				var styleTextField = dialog.getContentElement( 'advanced', 'txtdlgGenStyle' );
				styleTextField.setValue( 'height:300px;width:200px;border: 1px solid;margin:10px 5px;vertical-align:top;float:left' );
			} );
		},

		'test update image (inline styles)': function() {
			var bot = this.editorBot;
			var htmlWithSelection = '[<img src="' + SRC + '" style="height:300px;width:200px;border: 1px solid;float:left"/>]';

			testUpdateImage( this.editorBot, htmlWithSelection, function() {
				var img = bot.editor.editable().findOne( 'img' );
				assert.areEqual( '2px', img.getStyle( 'border-width' ) );
				assert.areEqual( 'solid', img.getStyle( 'border-style' ) );
				assert.areEqual( '10px 5px', img.getStyle( 'margin' ) );
				assert.areEqual( 'right', img.getStyle( 'float' ) );
				assert.areEqual( '86px', img.getStyle( 'height' ) );
				assert.areEqual( '414px', img.getStyle( 'width' ) );
				assert.areEqual( SRC, img.getAttribute( 'src' ) );
			}, imageProps );
		},

		'test update image (attributes)': function() {
			var bot = this.editorBot;
			var htmlWithSelection = '[<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>]';

			testUpdateImage( this.editorBot, htmlWithSelection, function() {
				var img = bot.editor.editable().findOne( 'img' );
				assert.areEqual( '2px', img.getStyle( 'border-width' ) );
				assert.areEqual( 'solid', img.getStyle( 'border-style' ) );
				assert.areEqual( '10px 5px', img.getStyle( 'margin' ) );
				assert.areEqual( 'right', img.getStyle( 'float' ) );
				assert.areEqual( '86px', img.getStyle( 'height' ) );
				assert.areEqual( '414px', img.getStyle( 'width' ) );
				assert.areEqual( SRC, img.getAttribute( 'src' ) );
			}, imageProps );
		},

		'test update image (remove)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>]';
			var expectedOutput = '<img src="' + SRC + '" />';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				txtWidth: '',
				txtHeight: '',
				txtBorder: '',
				txtHSpace: '',
				txtVSpace: '',
				cmbAlign: ''
			} );
		},

		'test align=left attribute transformation': function() {
			this.editorBot.assertInputOutput(
				'<p><img align="left" src="http://test/x" /></p>',
				/<p><img data-cke-saved-src="http:\/\/test\/x" src="http:\/\/test\/x" style="float: ?left;?" \/>(<br \/>)?<\/p>/i,
				'<p><img src="http://test/x" style="float:left" /></p>'
			);
		},

		'test float:left style transformation': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor_float_transformation',
				config: {
					allowedContent: 'p; img[src,align]'
				}
			},
			function( bot ) {
				bot.assertInputOutput(
					'<p><img src="http://test/x" style="float:right" /></p>',
					'<p><img align="right" data-cke-saved-src="http://test/x" src="http://test/x" /></p>',
					'<p><img align="right" src="http://test/x" /></p>'
				);
			} );
		},

		// https://dev.ckeditor.com/ticket/10867
		'test set encoded URI as image\'s link': function() {
			var uri = 'http://ckeditor.dev/?q=%C5rsrapport';
			var htmlWithSelection = '<p>[<img src="' + SRC + '" />]</p>';
			var expectedOutput = '<p><a href="' + uri + '"><img src="' + SRC + '" /></a></p>';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				'Link:txtUrl': uri
			} );
		},

		// https://dev.ckeditor.com/ticket/12132
		'test width and height not set when not allowed': function() {
			bender.editorBot.create( {
				name: 'editor_disallowed_dimension',
				creator: 'inline',
				config: {
					disallowedContent: 'img{width, height}[width, height]'
				}
			},
			function( bot ) {
				var editor = bot.editor;

				bot.dialog( 'image', function( dialog ) {
					var imgUrl = '%BASE_PATH%_assets/logo.png';

					dialog.setValueOf( 'info', 'txtUrl', imgUrl );

					downloadImage( imgUrl, function() {
						dialog.getButton( 'ok' ).click();

						var img = editor.editable().findOne( 'img' );

						resume( function() {
							assert.isNull( img.getAttribute( 'style' ), 'Styles should not be set.' );
						} );
					} );

					wait();
				} );
			} );
		},

		/**
		 * https://dev.ckeditor.com/ticket/12126
		 *
		 * 1. Open image dialog.
		 * 2. Set some proper image url and focus out.
		 * 3. Dimensions inputs should be empty.
		 * 4. Set another proper image url and focus out.
		 * 5. Again dimensions inputs should be empty.
		 */
		'test dimensions not set automatically when disbled in option': function() {
			bender.editorBot.create( {
				name: 'editor_disabled_autodimensions',
				creator: 'inline',
				config: {
					image_prefillDimensions: false
				}
			},
			function( bot ) {
				bot.dialog( 'image', function( dialog ) {
					var i = 0,
						heightInput = dialog.getContentElement( 'info', 'txtHeight' ),
						widthInput = dialog.getContentElement( 'info', 'txtWidth' );

					dialog.setValueOf( 'info', 'txtUrl', imgs[ i ].url );
					downloadImage( imgs[ i ].url, onDownload );

					function onDownload() {
						resume( onResume );
					}

					function onResume() {
						dialog.getContentElement( 'info', 'txtHeight' ).getValue();
						assert.areSame( '', widthInput.getValue() );
						assert.areSame( '', heightInput.getValue() );

						if ( i === 0 ) {
							dialog.setValueOf( 'info', 'txtUrl', imgs[ ++i ].url );
							downloadImage( imgs[ i ].url, onDownload );
							wait();
						}
					}

					wait();
				} );
			} );
		},

		// (#2254)
		'test lock ratio status after image resize': function() {
			var image = imgs[ 1 ];
			bender.editorBot.create( {
				name: 'editor_lockratio'
			},
				function( bot ) {
					bot.dialog( 'image', function( dialog ) {
						var stub = sinon.stub( dialog, 'getValueOf', function( field, prop ) {
							return prop === 'txtWidth' ? getFixedImageSize( 'width' ) : getFixedImageSize( 'height' );
						} );

						dialog.originalElement.once( 'load', function() {
							setTimeout( function() {
								resume( function() {
									stub.restore();
									assert.isTrue( dialog.lockRatio );
								} );
							} );

						}, null, null, 999 );

						// Changing image url triggers load event.
						dialog.getContentElement( 'info', 'txtUrl' ).setValue( image.url );

						wait();

						function getFixedImageSize( prop ) {
							return Math.round( Number( image[ prop ] ) / 3.6 );
						}
					} );
				} );
		},

		/**
		 * https://dev.ckeditor.com/ticket/12126
		 *
		 * 1. Open image dialog.
		 * 2. Set some proper image url and focus out.
		 * 3. Click button "Reset Size".
		 * 4. Set some proper image url and focus out.
		 * 5. Dimensions inputs should be empty.
		 */
		'test dimension should be empty after resetting size and loading image': function() {
			bender.editorBot.create( {
				name: 'editor_disabled_autodimensions2',
				creator: 'inline',
				config: {
					image_prefillDimensions: false
				}
			},
			function( bot ) {
				bot.dialog( 'image', function( dialog ) {
					var i = 0,
						resetBtn = bot.editor.document.getById( dialog.getContentElement( 'info', 'ratioLock' ).domId ).find( '.cke_btn_reset' ).getItem( 0 );

					dialog.setValueOf( 'info', 'txtUrl', imgs[ i ].url );
					downloadImage( imgs[ i ].url, onDownload );

					function onDownload() {
						resume( onResume );
					}

					function onResume() {
						resetBtn.fire( 'click' );
						assert.areSame( imgs[ i ].width, dialog.getContentElement( 'info', 'txtWidth' ).getValue() );
						assert.areSame( imgs[ i ].height, dialog.getContentElement( 'info', 'txtHeight' ).getValue() );

						dialog.setValueOf( 'info', 'txtUrl', imgs[ ++i ].url );
						downloadImage( imgs[ i ].url, function() {
							resume( function() {
								assert.areSame( '', dialog.getContentElement( 'info', 'txtWidth' ).getValue() );
								assert.areSame( '', dialog.getContentElement( 'info', 'txtHeight' ).getValue() );
							} );
						} );

						wait();
					}

					wait();
				} );
			} );
		},

		// This TC verifies also the above test's correctness.
		'test width and height are automatically set': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p>^foo</p>' );
			bot.dialog( 'image', function( dialog ) {
				var imgUrl = '%BASE_PATH%_assets/logo.png';

				dialog.setValueOf( 'info', 'txtUrl', imgUrl );

				downloadImage( imgUrl, function() {
					dialog.getButton( 'ok' ).click();

					var img = editor.editable().findOne( 'img' );

					resume( function() {
						assert.areSame( '163px', img.getStyle( 'width' ), 'Width should be set.' );
						assert.areSame( '61px', img.getStyle( 'height' ), 'Height should be set.' );
					} );
				} );

				wait();
			} );
		},

		'test insert new image': function() {
			var bot = this.editorBot;
			var htmlWithSelection = '<p>^foo</p>';

			testUpdateImage( this.editorBot, htmlWithSelection, function() {
				var img = bot.editor.editable().findOne( 'img' );
				assert.areEqual( '2px', img.getStyle( 'border-width' ) );
				assert.areEqual( 'solid', img.getStyle( 'border-style' ) );
				assert.areEqual( '10px 5px', img.getStyle( 'margin' ) );
				assert.areEqual( 'right', img.getStyle( 'float' ) );
				assert.areEqual( '86px', img.getStyle( 'height' ) );
				assert.areEqual( '414px', img.getStyle( 'width' ) );
				assert.areEqual( SRC, img.getAttribute( 'src' ) );
			}, {
				txtUrl: SRC, // set txtUrl first because it will overwrite txtHeight and txtWidth after image loads
				txtWidth: 414,
				txtHeight: 86,
				txtBorder: 2,
				txtHSpace: 5,
				txtVSpace: 10,
				cmbAlign: 'right'
			} );
		},

		'test replace selected content': function() {
			var htmlWithSelection = '<p>my [old] content</p>';
			var expectedOutput = '<p>my <img alt="" src="' + SRC + '" style="height:10px;width:10px;" /> content</p>';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				txtUrl: SRC,

				// Setting up txtHeight and txtWidth so the test will be unified across browsers
				// without them, all browsers except of IE8 have style attribute empty, but IE8 sets it anyway.
				txtHeight: 10,
				txtWidth: 10
			} );
		},

		'test replace selected content in link': function() {
			var htmlWithSelection = '<p>x<a href="#">y[<span contenteditable="false">foo</span>]y</a>x</p>';
			var expectedOutput = '<p>x<a href="#">y<img alt="" src="' + SRC + '" style="height:10px;width:10px;" />y</a>x</p>';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				txtUrl: SRC,
				txtHeight: 10,
				txtWidth: 10
			} );
		},

		'test replace link with text': function() {
			var htmlWithSelection = '<p>x[<a href="#">foo bar</a>]x</p>';
			var expectedOutput = '<p>x<a href="#"><img alt="" src="' + SRC + '" style="height:10px;width:10px;" /></a>x</p>';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				txtUrl: SRC,
				txtHeight: 10,
				txtWidth: 10
			} );
		}
	} );
} )();
