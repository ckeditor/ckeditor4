/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'img figure[id]',
			autoParagraph: false
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById,
		fixHtml = image2TestsTools.fixHtml,
		assertWidgetDialog = widgetTestsTools.assertWidgetDialog,
		widgetsHtml = '<img src="_assets/foo.png" alt="xalt" width="100" id="x" />' +
			'<p>X</p>' +
			'<figure class="image" id="y">' +
				'<img src="_assets/bar.png" alt="yalt" />' +
				'<figcaption>boo</figcaption>' +
			'</figure>',
		imgs = [
			{ url: '%BASE_PATH%_assets/logo.png', width: '163', height: '61' },
			{ url: '%BASE_PATH%_assets/large.jpg', width: '1008', height: '550' }
		],
		downloadImage = bender.tools.downloadImage;

	function assertDialogFields( dialog, data ) {
		for ( var i in data )
			assert.areSame( data[ i ], dialog.getValueOf( 'info', i ), 'Value must match.' );
	}

	bender.test( {
		'test edit inline widget with global command': function() {

			assertWidgetDialog( this.editorBot, 'image', widgetsHtml, 'x', {
				src: '_assets/foo.png',
				alt: 'xalt',
				width: '100',
				height: '',
				align: 'none',
				hasCaption: false
			} );

		},

		'test edit block widget with global command': function() {

			// atm this code can not be checked with assertWidgetDialog
			var bot = this.editorBot,
				editor = bot.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				resume( function() {
					assertDialogFields( dialog, {
						src: '_assets/bar.png',
						alt: 'yalt',
						width: '',
						height: '',
						align: 'none',
						hasCaption: true
					} );

					dialog.hide();
				} );
			} );

			getWidgetById( editor, 'y' ).focus();
			editor.execCommand( 'image' );
			wait();
		},

		// (#1348)
		'test image dialog has correct aspect ratio after src change': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data,
					widthInput = CKEDITOR.document.findOne( '#' + dialog.getContentElement( 'info', 'width' )._.inputId );

				dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
				downloadImage( '_assets/foo.png', assertImage );

				function assertImage() {
					widthInput.fire( 'keyup', new CKEDITOR.dom.event( {} ) ); // It will force image dialog to recalculate width and height.

					assert.areEqual( 50, dialog.getContentElement( 'info', 'width' ).getValue(), 'invalid width' );
					assert.areEqual( 120, dialog.getContentElement( 'info', 'height' ).getValue(), 'invalid height' );

					dialog.hide();

					resume();
				}
			} );

			bot.setData( widgetsHtml, function() {
				getWidgetById( editor, 'y' ).focus();
				editor.execCommand( 'image' );
				wait();
			} );
		},

		'test create inline widget with a global command': function() {
			var editorBot = this.editorBot,
				onResume = function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( '<p>x<img alt="" src="_assets/foo.png" />x</p>', fixHtml( editorBot.editor.getData() ) );
				};

			assertWidgetDialog( editorBot, 'image', '', null, {
				src: '',
				alt: '',
				width: '',
				height: '',
				align: 'none',
				hasCaption: false
			}, '<p>x^x</p>', onResume );
		},

		'test create block widget in wrong context': function() {

			var editorBot = this.editorBot,
				onResume = function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.setValueOf( 'info', 'align', 'center' );

					dialog.getButton( 'ok' ).click();
					assert.areSame(
						'<p><span>foo</span></p>' +
						'<p style="text-align:center;">' +
							'<img alt="" src="_assets/foo.png" />' +
						'</p>' +
						'<p><span>bar</span></p>',
						fixHtml( editorBot.editor.getData() ),
						'Paragraph got split.' );
				};

			assertWidgetDialog( editorBot, 'image', '', null, null, '<p><span>foo^bar</span></p>', onResume );
		},

		/**
		 * https://dev.ckeditor.com/ticket/12126
		 *
		 * 1. Open image2 dialog.
		 * 2. Set some proper image url and focus out.
		 * 3. Dimensions inputs should be empty.
		 * 4. Set another proper image url and focus out.
		 * 5. Again dimensions inputs should be empty.
		 */
		'test dimensions not set automatically when disabled in option': function() {
			bender.editorBot.create( {
				name: 'editor_disabled_autodimensions',
				creator: 'inline',
				config: {
					extraPlugins: 'image2',
					image2_prefillDimensions: false
				}
			},
			function( bot ) {
				bot.dialog( 'image', function( dialog ) {
					var i = 0,
					heightInput = dialog.getContentElement( 'info', 'height' ),
					widthInput = dialog.getContentElement( 'info', 'width' );

					dialog.setValueOf( 'info', 'src', imgs[ i ].url );
					downloadImage( imgs[ i ].url, onDownload );

					function onDownload() {
						resume( onResume );
					}

					function onResume() {
						dialog.getContentElement( 'info', 'height' ).getValue();
						assert.areSame( '', widthInput.getValue() );
						assert.areSame( '', heightInput.getValue() );

						if ( i === 0 ) {
							dialog.setValueOf( 'info', 'src', imgs[ ++i ].url );
							downloadImage( imgs[ i ].url, onDownload );
							wait();
						} else {
							dialog.hide();
						}
					}

					wait();
				} );
			} );
		},

		/**
		 * https://dev.ckeditor.com/ticket/12126
		 *
		 * 1. Open image2 dialog.
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
					extraPlugins: 'image2',
					image2_prefillDimensions: false
				}
			},
			function( bot ) {
				bot.dialog( 'image', function( dialog ) {
					var i = 0,
					resetBtn = bot.editor.document.getById( dialog.getContentElement( 'info', 'lock' ).domId ).find( '.cke_btn_reset' ).getItem( 0 );

					dialog.setValueOf( 'info', 'src', imgs[ i ].url );
					downloadImage( imgs[ i ].url, onDownload );

					function onDownload() {
						resume( onResume );
					}

					function onResume() {
						resetBtn.fire( 'click' );
						assert.areSame( imgs[ i ].width, dialog.getContentElement( 'info', 'width' ).getValue() );
						assert.areSame( imgs[ i ].height, dialog.getContentElement( 'info', 'height' ).getValue() );

						dialog.setValueOf( 'info', 'src', imgs[ ++i ].url );
						downloadImage( imgs[ i ].url, function() {
							resume( function() {
								assert.areSame( '', dialog.getContentElement( 'info', 'width' ).getValue() );
								assert.areSame( '', dialog.getContentElement( 'info', 'height' ).getValue() );
							} );
						} );

						wait();
					}

					wait();
				} );
			} );
		}
	} );
} )();
