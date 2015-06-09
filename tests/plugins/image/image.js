/* bender-tags: editor,unit,image */
/* bender-ckeditor-plugins: image,button,toolbar,link */
( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			autoParagraph: false
		}
	};

	var SRC = '%BASE_PATH%_assets/logo.png';

	var imageProps = {
		txtWidth: 414,
		txtHeight: 86,
		txtBorder: 2,
		txtHSpace: 5,
		txtVSpace: 10,
		cmbAlign: 'right'
	};

	function downloadImage( src, cb ) {
		var img = new CKEDITOR.dom.element( 'img' );

		img.once( 'load', onDone );
		img.once( 'error', onDone );

		function onDone() {
			setTimeout( cb, 0 );
		}

		img.setAttribute( 'src', src );
	}

	function testReadImage( bot, htmlWithSelection, inpValMap, onDialogShowCb ) {
		var key,
			inputName,
			tabName = 'info';

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
					// typeof NaN == number, so if NaN is passed as expected value, input value will be parsed
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

			assert.areEqual( expectedOutput.toLowerCase(), bot.getData( true ) );
		} );
	}

	function chooseExpectedOutput( o ) {
		return ( CKEDITOR.env.ie && CKEDITOR.env.version >= 11 ) ? o.outputNewIE2
			: ( CKEDITOR.env.ie && document.documentMode > 8 ) ? o.outputNewIE
			: CKEDITOR.env.ie ? o.outputIE
			: CKEDITOR.env.gecko ? o.standard
			: CKEDITOR.env.safari && CKEDITOR.env.version < 536 ? o.outputSafari5
			: CKEDITOR.env.webkit ? o.standard
			: o.outputOpera;
	}

	bender.test( {
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
			var htmlWithSelection = '[<img src="' + SRC + '" style="height:300px;width:200px;border: 1px solid;float:left"/>]';

			// jscs:disable maximumLineLength
			var expectedOutput = chooseExpectedOutput( {
				standard: '<img src="' + SRC + '" style="border:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputIE: '<img src="' + SRC + '" style="border-bottom:2px solid;border-left:2px solid;border-right:2px solid;border-top:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE: '<img src="' + SRC + '" style="border:2px solid currentcolor;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE2: '<img src="' + SRC + '" style="border:2px solid currentcolor;border-image:none;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputOpera: '<img src="' + SRC + '" style="border-bottom-color:currentcolor;border-bottom-style:solid;border-bottom-width:2px;border-left-color:currentcolor;border-left-style:solid;border-left-width:2px;border-right-color:currentcolor;border-right-style:solid;border-right-width:2px;border-top-color:currentcolor;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />',
				outputSafari5: '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-color:initial;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />'
			} );
			// jscs:enable maximumLineLength

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, imageProps );
		},

		'test update image (attributes)': function() {
			var htmlWithSelection = '[<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>]';

			// jscs:disable maximumLineLength
			var expectedOutput = chooseExpectedOutput( {
				standard: '<img src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputIE: '<img src="' + SRC + '" style="border-bottom:2px solid;border-left:2px solid;border-right:2px solid;border-top:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE: '<img src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE2: '<img src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputOpera: '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />',
				outputSafari5: '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />'
			} );
			// jscs:enable maximumLineLength

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, imageProps );
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

		// #10867
		'test set encoded URI as image\'s link': function() {
			var uri = 'http://ckeditor.dev/?q=%C5rsrapport';
			var htmlWithSelection = '<p>[<img src="' + SRC + '" />]</p>';
			var expectedOutput = '<p><a href="' + uri + '"><img src="' + SRC + '" /></a></p>';

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
				'Link:txtUrl': uri
			} );
		},

		// #12132
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
			var htmlWithSelection = '';

			// jscs:disable maximumLineLength
			var expectedOutput = chooseExpectedOutput( {
				standard: '<img alt="" src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputIE: '<img alt="" src="' + SRC + '" style="border-bottom:2px solid;border-left:2px solid;border-right:2px solid;border-top:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE: '<img alt="" src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE2: '<img alt="" src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputOpera: '<img alt="" src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />',
				outputSafari5: '<img alt="" src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />'
			} );
			// jscs:enable maximumLineLength

			testUpdateImage( this.editorBot, htmlWithSelection, expectedOutput, {
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

				// setting up txtHeight and txtWidth so the test will be unified across browsers
				// without them, all browsers except of IE8 have style attribute empty, but IE8 sets it anyway
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
//]]>
