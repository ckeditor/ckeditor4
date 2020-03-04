/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar, clipboard */

( function() {
	'use strict';

	var IMG = {
		JPEG: '<img src="data:image/jpeg;base64,foo">',
		GIF: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">',
		PNG: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=">',
		BMP: '<img src="data:image/bmp;base64,foo">',
		SVG: '<img src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E">',
		FAKE_IMAGE: '<img src="data:image/foobar;base64,foobarbaz">',
		HTML: '<img src="data:text/html;charset=utf8,%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3C%2Fhtml%3E">'
	};

	bender.editor = true;

	function assertEasyImageUpcast( config ) {
		var bot = config.bot,
			editor = bot.editor,
			pastedData = config.pastedData,
			shouldUpcast = config.shouldUpcast,
			// spy checks if paste listener in easyimage plugin activates an early return,
			// by spying the method available after the early return statement.
			upcastSpy = sinon.spy( editor.widgets.registered.easyimage, '_spawnLoader' );

		bot.setData( '', function() {
			bender.tools.range.setWithHtml( editor.editable(), '<p>[]</p>' );

			bender.tools.emulatePaste( editor, pastedData );

			editor.once( 'afterPaste', function() {
				resume( function() {
					upcastSpy.restore();

					if ( shouldUpcast ) {
						sinon.assert.calledOnce( upcastSpy );

						assert.areNotSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should be the image upcasted to the easyimage widget' );
					} else {
						sinon.assert.notCalled( upcastSpy );

						assert.areSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should not be an image upcasted to the easyimage widget' );
					}
				} );
			} );

			wait();
		} );
	}

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test easyimage upcasts image/jpeg': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.JPEG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/gif': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.GIF,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/png': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.PNG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/bmp': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.BMP,
				shouldUpcast: true
			} );
		},

		'test easyimage not upcasts image/svg': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.SVG,
				shouldUpcast: false
			} );
		},

		'test easyimage not upcasts image/foobar': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.FAKE_IMAGE,
				shouldUpcast: false
			} );
		},

		'test easyimage not upcasts text/html': function() {
			assertEasyImageUpcast( {
				bot: this.editorBot,
				pastedData: IMG.HTML,
				shouldUpcast: false
			} );
		}
	} );
} )();
