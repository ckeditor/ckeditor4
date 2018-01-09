/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: toolbar,link,balloontoolbar */
/* bender-include: _helpers/default.js */
/* global ignoreUnsupportedEnvironment */

( function() {
	'use strict';
	bender.editors = {
		editor1: {
			name: 'editor1',
			creator: 'replace',
			config: {
				extraAllowedContent: 'span[id];p{height};img[src]{margin-left}',
				height: 200
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			config: {
				extraPlugins: 'divarea',
				extraAllowedContent: 'span[id];p{height};img[src]{margin-left}',
				height: 200
			}
		}
	};

	var parentFrame = window.frameElement,
		originalHeight = parentFrame && parentFrame.style.height;
	function makeExpectedLeft( data ) {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 9 ) {
			return data.toFixed( 0 ) + '.00';
		} else {
			return data.toFixed( 2 );
		}
	}

	var tests = {
		setUp: function() {
			if ( parentFrame ) {
				parentFrame.style.height = '900px';
			}
		},

		tearDown: function() {
			if ( parentFrame ) {
				parentFrame.style.height = originalHeight;
			}
		},

		'test divaera - out of view - bottom center': function( editor ) {
			// Due to a high instability of this test, that fails on mobile devices, small screens
			// and when devtools are open, it's disabled for 4.8.0 release (#1295).
			assert.ignore();

			if ( editor.name == 'divarea' ) {
				// divarea tests are failing, it's an upstream issue from balloonpanel (#1064).
				assert.ignore();
			}

			var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
					width: 100,
					height: 200
				} ),
				markerElement = editor.editable().findOne( '#marker' ),
				frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect(),
				elementFrame = markerElement.getClientRect(),
				balloonToolbarRect;

			balloonToolbar.attach( markerElement );
			balloonToolbarRect = balloonToolbar.parts.panel.getClientRect();

			var expectedLeft = makeExpectedLeft( frame.left + elementFrame.left + elementFrame.width / 2 - 50 );
			assert.areEqual( expectedLeft, balloonToolbarRect.left.toFixed( 2 ), 'left align' );
			// We have to add 1px because of border.
			assert.areEqual( ( balloonToolbarRect.top + balloonToolbar.height + balloonToolbar.triangleHeight + 1 ).toFixed( 2 ),
				( frame.top + frame.height ).toFixed( 2 ), 'top align' );
			balloonToolbar.destroy();
			balloonToolbar = null;
		},

		'test divaera - out of view - hcenter top': function( editor ) {
			// Due to a high instability of this test, that fails on mobile devices, small screens
			// and when devtools are open, it's disabled for 4.8.0 release (#1295).
			assert.ignore();

			if ( editor.name == 'divarea' ) {
				// divarea tests are failing, it's an upstream issue from balloonpanel (#1064).
				assert.ignore();
			}

			var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
					width: 100,
					height: 200
				} ),
				markerElement = editor.editable().findOne( '#marker' ),
				frame = editor.editable().isInline() ? editor.editable().getClientRect() : editor.window.getFrame().getClientRect(),
				elementFrame = markerElement.getClientRect(),
				balloonToolbarRect;

			markerElement.getParent().getNext().scrollIntoView( true );
			balloonToolbar.attach( markerElement );
			balloonToolbarRect = balloonToolbar.parts.panel.getClientRect();

			var expectedLeft = makeExpectedLeft( frame.left + elementFrame.left + elementFrame.width / 2 - 50 );
			assert.areEqual( expectedLeft, balloonToolbarRect.left.toFixed( 2 ), 'left align' );
			assert.areEqual( frame.top.toFixed( 2 ), ( balloonToolbarRect.top - balloonToolbar.triangleHeight ).toFixed( 2 ), 'top align' );
			balloonToolbar.destroy();
			balloonToolbar = null;
		},

		'test panel adds cke_balloontoolbar class': function( editor ) {
			var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
				width: 100,
				height: 200
			} ),
				markerElement = editor.editable().findOne( '#marker' );
			balloonToolbar.attach( markerElement );

			assert.isTrue( balloonToolbar.parts.panel.hasClass( 'cke_balloontoolbar' ), 'Panel has a cke_balloontoolbar class' );
			assert.isTrue( balloonToolbar.parts.panel.hasClass( 'cke_balloon' ), 'Class cke_balloon class was not removed' );
			balloonToolbar.destroy();
			balloonToolbar = null;
		},

		'test panel prefers bottom positioning': function( editor ) {
			var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
					width: 100,
					height: 200
				} ),
				res = balloonToolbar._getAlignments( editor.editable().getFirst().getClientRect(), 10, 10 );

			arrayAssert.itemsAreEqual( [ 'bottom hcenter', 'top hcenter' ], CKEDITOR.tools.objectKeys( res ) );
		},

		// #1342
		'test panel refresh position': function( editor, bot ) {

			bot.setData( '<img src="' + bender.basePath + '/_assets/lena.jpg">', function() {
				var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
						width: 100,
						height: 200
					} ),
					markerElement = editor.editable().findOne( 'img' ),
					initialPosition,
					currentPosition;

				balloonToolbar.attach( markerElement );
				initialPosition = balloonToolbar.parts.panel.getClientRect();

				editor.once( 'change', function() {
					resume( function() {
						currentPosition = balloonToolbar.parts.panel.getClientRect();
						assert.areNotSame( initialPosition.left, currentPosition.left, 'position of toolbar' );
					} );
				} );

				markerElement.setStyle( 'margin-left', '200px' );
				editor.fire( 'change' );

				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
