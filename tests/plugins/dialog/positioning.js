/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog, link, toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		setUp: function() {
			// Make sure page is scrollable on vertical screens.
			CKEDITOR.document.getBody().appendHtml( '<div style="height:4000px"></div>' );
		},
		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();
			if ( dialog ) {
				dialog.hide();
			}
		},
		// (#2395).
		'test body has hidden scrollbars when dialog is opened': function() {
			if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				assert.ignore();
			}
			var bot = this.editorBot,
				body = CKEDITOR.document.getBody();

			bot.dialog( 'link', function( dialog ) {
				assert.isTrue( body.hasClass( 'cke_dialog_open' ), 'Body should have proper class.' );

				dialog.hide();

				assert.isFalse( body.hasClass( 'cke_dialog_open' ), 'Body shouldn\'t have class.' );
			} );
		},
		// (#2395).
		'test dialog is initially centered': function() {
			if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				assert.ignore();
			}
			this.editorBot.dialog( 'link', function( dialog ) {
				var container = dialog._.element,
					element = container.getFirst();

				assert.areEqual( container.getStyle( 'display' ), 'flex', 'Dialog container should have `display:flex`.' );
				assert.areEqual( element.getStyle( 'position' ), '', 'Dialog element should\'t have position style.' );
				assert.areEqual( element.getStyle( 'margin' ), 'auto', 'Dialog element should have `margin:auto`.' );

				dialog.hide();
			} );
		},
		// (#2395).
		'test dialog cover styles': function() {
			this.editorBot.dialog( 'link', function( dialog ) {
				var cover = CKEDITOR.document.findOne( '.cke_dialog_background_cover' );

				assert.areEqual( cover.getStyle( 'width' ), '100%', 'Dialog element should have `width:100%`.' );
				assert.areEqual( cover.getStyle( 'height' ), '100%', 'Dialog element should have `height:100%`.' );

				dialog.hide();
			} );
		},
		// When drag starts, dialog becomes centered with `position:absolute`, then it moves together with mouse (#2395).
		//
		// A - mouse cursor
		//
		// Drag start:
		// +----------------------------------+
		// |      Editor viewport             |
		// |                                  |
		// |        +-------------A--+        |
		// |        |                |        |
		// |        |   Dialog       |        |
		// |        |                |        |
		// |        +----------------+        |
		// |                                  |
		// +----------------------------------+
		//
		// Drag end:
		// +----------------------------------+
		// |      Editor viewport             |
		// |                                  |
		// |                                  |
		// |                +-------------A--+|
		// |                |                ||
		// |                |   Dialog       ||
		// |                |                ||
		// |                +----------------+|
		// +----------------------------------+
		//
		'test dialog move': function() {
			var window = CKEDITOR.document.getWindow(),
				viewPaneSize = {
					width: 1000,
					height: 1000
				},
				stubs = {
					getWindow: sinon.stub( CKEDITOR.document, 'getWindow' ),
					getViewPane: sinon.stub( window, 'getViewPaneSize' )
				};

			stubs.getWindow.returns( window );
			stubs.getViewPane.returns( viewPaneSize );

			this.editorBot.dialog( 'link', function( dialog ) {
				var element = dialog._.element.getFirst(),
					dialogSize = dialog.getSize(),
					expectedX = Math.floor( ( viewPaneSize.width - dialogSize.width ) / 2 ),
					expectedY = Math.floor( ( viewPaneSize.height - dialogSize.height ) / 2 );

				dialog.parts.title.fire( 'mousedown', {
					$: {
						screenX: 0,
						screenY: 0
					},
					preventDefault: function() {}
				} );

				var actualX = parseInt( element.getStyle( 'left' ), 10 ),
					actualY = parseInt( element.getStyle( 'top' ), 10 ),
					elementStyle = element.getStyle( 'position' );

				CKEDITOR.document.fire( 'mousemove', {
					$: {
						screenX: 100,
						screenY: 100
					},
					preventDefault: function() {}
				} );

				for ( var key in stubs ) {
					stubs[ key ].restore();
				}

				assert.areEqual( 'absolute', elementStyle, 'Dialog element should have `position:absolute`.' );
				assert.areEqual( expectedX, actualX, 'Dialog should be horizontally centered.' );
				assert.areEqual( expectedY, actualY, 'Dialog should be vertically centered.' );

				actualX = parseInt( element.getStyle( 'left' ), 10 );
				actualY = parseInt( element.getStyle( 'top' ), 10 );

				assert.areEqual( 100, actualX - expectedX, 'Dialog should be moved by 100px to the right.' );
				assert.areEqual( 100, actualY - expectedY, 'Dialog should be moved by 100px down.' );

				CKEDITOR.document.fire( 'mouseup' );
				dialog.hide();
			} );
		},

		'test dialog resize': function() {
			this.editorBot.dialog( 'link', function( dialog ) {
				var dialogSize = dialog.getSize(),
					resizer = dialog._.element.findOne( '.cke_resizer' ),
					sizeChange;

				resizer.$.onmousedown( {
					screenX: 0,
					screenY: 0
				} );

				CKEDITOR.document.fire( 'mousemove', {
					$: {
						screenX: 10,
						screenY: 10
					},
					preventDefault: function() {}
				} );

				CKEDITOR.document.fire( 'mouseup' );

				sizeChange = {
					width: dialog.getSize().width - dialogSize.width,
					height: dialog.getSize().height - dialogSize.height
				};

				// When resizing some floats might be rounded.
				assert.isNumberInRange( 10, sizeChange.width - 1, sizeChange.width );
				assert.isNumberInRange( 10, sizeChange.height - 1, sizeChange.height );
			} );
		}
	} );
} )();
