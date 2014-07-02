/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: image,button,toolbar,link */
( function() {
	'use strict';

	bender.editor = { creator: 'inline', config : { autoParagraph : false } };

	var SRC = '%BASE_PATH%_assets/logo.png';

	bender.test(
	{
		'test read image (inline styles)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" style="border:solid 2px;height:86px;margin:10px 5px;float:right;width:414px;">]' );
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
					heightField = dialog.getContentElement( 'info', 'txtHeight' ),
					borderField = dialog.getContentElement( 'info', 'txtBorder' ),
					hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
					vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
					alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				assert.areSame( 414, parseInt( widthField.getValue(), 10 ) );
				assert.areSame( 86, parseInt( heightField.getValue(), 10 ) );
				assert.areSame( 2, parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.areSame( 10, parseInt( vspaceField.getValue(), 10 ) );
				assert.areSame( 'right', alignField.getValue(), 10 );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test read image (attributes)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" border="2" height="86" width="414" vspace="10" hspace="5" align="left">]' );
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
					heightField = dialog.getContentElement( 'info', 'txtHeight' ),
					borderField = dialog.getContentElement( 'info', 'txtBorder' ),
					hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
					vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
					alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				assert.areSame( 414, parseInt( widthField.getValue(), 10 ) );
				assert.areSame( 86, parseInt( heightField.getValue(), 10 ) );
				assert.areSame( 2, parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.areSame( 10, parseInt( vspaceField.getValue(), 10 ) );
				assert.areSame( 'left', alignField.getValue() );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test read image (align)' : function() {
			var bot = this.editorBot, tc = this;

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" align="texttop" style="float:inherit">]' );
			bot.dialog( 'image', function( dialog ) {
				var alignField = dialog.getContentElement( 'info', 'cmbAlign' );
				assert.areSame( '', alignField.getValue() );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test read image (inline v.s. attributes)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection
			(
			'[<img src="' + SRC + '" ' +
			'border="1" height="43" width="212" vspace="0" hspace="0" align="left" ' +
			'style="border:solid 2px blue;width:414px;height:86px;margin:10px 5px;vertical-align:bottom;float:right">]'
			);
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
						heightField = dialog.getContentElement( 'info', 'txtHeight' ),
						borderField = dialog.getContentElement( 'info', 'txtBorder' ),
						hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
						vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
						alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				assert.areSame( 414, parseInt( widthField.getValue(), 10 ) );
				assert.areSame( 86, parseInt( heightField.getValue(), 10 ) );
				assert.areSame( 2, parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.areSame( 10, parseInt( vspaceField.getValue(), 10 ) );
				assert.areSame( 'right', alignField.getValue() );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test read image (border/margin styles)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection
			(
			'[<img src="' + SRC + '" ' +
			'style="border-bottom-width:2px;border-left-width:2px;border-right-width:2px;border-top-width:2px;' +
			'margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;">]'
			);

			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
						heightField = dialog.getContentElement( 'info', 'txtHeight' ),
						borderField = dialog.getContentElement( 'info', 'txtBorder' ),
						hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
						vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
						alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				assert.areSame( 2, parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.areSame( 10, parseInt( vspaceField.getValue(), 10 ) );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test read image (unrecognized border styles)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection
			(
			'[<img src="' + SRC + '" ' +
			'style="border-style:solid;border-bottom-width:1px;border-left-width:2px;border-right-width:2px;border-top-width:2px;' +
			'margin: 10px 5px 11px;">]'
			);

			bot.dialog( 'image', function( dialog ) {
				var borderField = dialog.getContentElement( 'info', 'txtBorder' ),
				hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
				vspaceField = dialog.getContentElement( 'info', 'txtVSpace' );

				assert.isNaN( parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.isNaN( parseInt( vspaceField.getValue(), 10 ) );

				dialog.getButton( 'ok' ).click();

			} );
		},

		'test read image (sync styles from advanced tab)' : function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" style="">]' );

			bot.dialog( 'image', function( dialog ) {
				var styleTextField = dialog.getContentElement( 'advanced', 'txtdlgGenStyle' ),
				widthField = dialog.getContentElement( 'info', 'txtWidth' ),
				heightField = dialog.getContentElement( 'info', 'txtHeight' ),
				borderField = dialog.getContentElement( 'info', 'txtBorder' ),
				hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
				vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
				alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				styleTextField.setValue( 'height:300px;width:200px;border: 1px solid;margin:10px 5px;vertical-align:top;float:left' );

				assert.areSame( 200, parseInt( widthField.getValue(), 10 ) );
				assert.areSame( 300, parseInt( heightField.getValue(), 10 ) );
				assert.areSame( 1, parseInt( borderField.getValue(), 10 ) );
				assert.areSame( 5, parseInt( hspaceField.getValue(), 10 ) );
				assert.areSame( 10, parseInt( vspaceField.getValue(), 10 ) );
				assert.areSame( 'left', alignField.getValue(), 10 );

				dialog.getButton( 'ok' ).click();
			} );
		},

		'test update image (inline styles)': function() {
			var bot = this.editorBot,
				standard = '<img src="' + SRC + '" style="border:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputIE = '<img src="' + SRC + '" style="border-bottom:2px solid;border-left:2px solid;border-right:2px solid;border-top:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE = '<img src="' + SRC + '" style="border:2px solid currentcolor;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputNewIE2 = '<img src="' + SRC + '" style="border:2px solid currentcolor;border-image:none;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputOpera = '<img src="' + SRC + '" style="border-bottom-color:currentcolor;border-bottom-style:solid;border-bottom-width:2px;border-left-color:currentcolor;border-left-style:solid;border-left-width:2px;border-right-color:currentcolor;border-right-style:solid;border-right-width:2px;border-top-color:currentcolor;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />',
				outputSafari5 = '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-color:initial;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />';

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" style="height:300px;width:200px;border: 1px solid;float:right"/>]' );
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
					heightField = dialog.getContentElement( 'info', 'txtHeight' ),
					borderField = dialog.getContentElement( 'info', 'txtBorder' ),
					hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
					vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
					alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				widthField.setValue( 414 );
				heightField.setValue( 86 );
				borderField.setValue( 2 );
				hspaceField.setValue( 5 );
				vspaceField.setValue( 10 );
				alignField.setValue( 'right' );

				dialog.getButton( 'ok' ).click();

				assert.areEqual(
					( CKEDITOR.env.ie && ( CKEDITOR.env.version >= 11 ) ) ? outputNewIE2
					: ( CKEDITOR.env.ie && !!( document.documentMode > 8 ) ) ? outputNewIE
					: CKEDITOR.env.ie ? outputIE
					: CKEDITOR.env.gecko ? standard
					: CKEDITOR.env.safari && CKEDITOR.env.version < 536 ? outputSafari5
					: CKEDITOR.env.webkit ? standard
					: outputOpera , bot.getData( true ) );
			} );
		},

		'test update image (attributes)': function() {
			var bot = this.editorBot,
				standard = '<img src="' + SRC + '" style="border-style:solid;border-width:2px;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputIE = '<img src="' + SRC + '" style="border-bottom:2px solid;border-left:2px solid;border-right:2px solid;border-top:2px solid;float:right;height:86px;margin:10px 5px;width:414px;" />',
				outputOpera = '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />',
				outputSafari5 = '<img src="' + SRC + '" style="border-bottom-style:solid;border-bottom-width:2px;border-left-style:solid;border-left-width:2px;border-right-style:solid;border-right-width:2px;border-top-style:solid;border-top-width:2px;float:right;height:86px;margin-bottom:10px;margin-left:5px;margin-right:5px;margin-top:10px;width:414px;" />';

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>]' );
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
				heightField = dialog.getContentElement( 'info', 'txtHeight' ),
				borderField = dialog.getContentElement( 'info', 'txtBorder' ),
				hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
				vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
				alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				widthField.setValue( 414 );
				heightField.setValue( 86 );
				borderField.setValue( 2 );
				hspaceField.setValue( 5 );
				vspaceField.setValue( 10 );
				alignField.setValue( 'right' );

				dialog.getButton( 'ok' ).click();

				assert.areEqual(
					( CKEDITOR.env.ie && !!( document.documentMode > 8 ) ) ? standard
					: CKEDITOR.env.ie ? outputIE
					: CKEDITOR.env.gecko ? standard
					: CKEDITOR.env.safari && CKEDITOR.env.version < 536 ? outputSafari5
					: CKEDITOR.env.webkit ? standard
					: outputOpera, bot.getData( true ) );
			} );
		},

		'test update image (remove)' : function() {
			var bot = this.editorBot,
				input = '<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>',
				output = '<img src="' + SRC + '" />';

			bot.setHtmlWithSelection( '[<img src="' + SRC + '" height="300" width="200" border="1" align="right" vspace="10" hspace="5"/>]' );
			bot.dialog( 'image', function( dialog ) {
				var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
				heightField = dialog.getContentElement( 'info', 'txtHeight' ),
				borderField = dialog.getContentElement( 'info', 'txtBorder' ),
				hspaceField = dialog.getContentElement( 'info', 'txtHSpace' ),
				vspaceField = dialog.getContentElement( 'info', 'txtVSpace' ),
				alignField = dialog.getContentElement( 'info', 'cmbAlign' );

				widthField.setValue( '' );
				heightField.setValue( '' );
				borderField.setValue( '' );
				hspaceField.setValue( '' );
				vspaceField.setValue( '' );
				alignField.setValue( '' );

				dialog.getButton( 'ok' ).click();
				assert.areEqual( output, bot.getData( true ) );
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
			var bot = this.editorBot,
				uri = 'http://ckeditor.dev/?q=%C5rsrapport';

			bot.setHtmlWithSelection( '<p>[<img src="' + SRC + '" />]</p>' );
			bot.dialog( 'image', function( dialog ) {
				var linkInput = dialog.getContentElement( 'Link', 'txtUrl' );

				linkInput.setValue( uri );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<p><a href="' + uri + '"><img src="' + SRC + '" /></a></p>', bot.editor.getData() );
			} );
		},

		// #12132
		'test width and height not set when not allowed': function() {
			bender.editorBot.create( {
				name: 'editor_disallowed_dimension',
				creator: 'inline',
				config: {
					disallowedContent : 'img{width, height}[width, height]'
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

			bot.setHtmlWithSelection( '<p>^</p>' );
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
		}
	} );

	function downloadImage( src, cb ) {
		var img = new CKEDITOR.dom.element( 'img' );

		img.once( 'load', onDone );
		img.once( 'error', onDone );

		function onDone() {
			setTimeout( cb, 0 );
		}

		img.setAttribute( 'src', src );
	}

} )();
//]]>