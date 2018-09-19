/* bender-tags: a11ychecker,balloonpanel */
/* bender-ckeditor-plugins: balloonpanel */
/* bender-include: _helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';
	// Iframes on Safari mobile cannot be scrolled. That's why method `_scrollViewport` quietly failed (#441).
	if ( CKEDITOR.env.iOS && CKEDITOR.env.safari ) {
		bender.ignore();
	}

	// We need to lie about view pane size. This is due running test from dashboard might have random, tiny size for
	// the iframe, this will result with unpredictable balloon positioning. Not that it's relatively safe, because in
	// case of inline balloon we're checking only view pane of global window (because there's no iframe).
	CKEDITOR.dom.window.prototype.getViewPaneSize = sinon.stub().returns( {
		width: screen.availWidth,
		height: screen.availHeight
	} );

	// Tests for all the method related to scrolling detection.
	var screenSize = CKEDITOR.document.getWindow().getViewPaneSize(),
		balloonSize = {
			width: 100,
			height: 200
		};

	bender.editor = {
		creator: 'inline',
		name: 'editor1',
		config: {
			allowedContent: true
		}
	};

	var balloonConfig = {
			title: 'Test panel #1',
			width: 100,
			height: 200
		},
		spy = sinon.spy;

	// Some init logic, we need to properly place elements according to the screen size.

	// Make body big enough so scrollbars are visibly on any screen resolution.
	CKEDITOR.document.getBody().setStyles( {
		height: screenSize.height * 10 + 'px',
		width: screenSize.width * 10 + 'px'
	} );

	// Set reference element size.
	CKEDITOR.document.getById( 'reference' ).setStyles( {
		height: screenSize.height + 'px',
		width: screenSize.width + 'px'
	} );
	positionMisplacedElements();

	bender.test( {
		_should: {
			ignore: {
				// IE8 is doing its iexplorish thing and will return you wrong screen size if you're using multiple display setup...
				'test classic - out of view - center bottom': CKEDITOR.env.ie && CKEDITOR.env.version == 8
			}
		},

		setUp: function() {
			// Same viewport position forced for all tests, so there will be no random viewport position. And
			// TC order won't matter.
			this._scrollViewport( 0, 0 );
			this.balloon = new CKEDITOR.ui.balloonPanel( this.editor, balloonConfig );
		},

		tearDown: function() {
			// Scroll to 0, 0 - so we can actualy see test runner results :).
			this._scrollViewport( 0, 0 );
		},

		'test classic - out of view - right top': function() {
			this._scrollViewport( 0, screenSize.height );
			var moveSpy = spy( this.balloon, 'move' );
			balloonTestsTools.attachBalloon( this.balloon, 'center' );

			balloonTestsTools.assertMoveTo( {
				moveMethod: moveSpy,
				expectedX: screenSize.width - balloonSize.width - 40,
				expectedY: screenSize.height,
				maxX: screenSize.width - balloonSize.width,
				maxY: screenSize.height * 2,
				shouldRound: true
			} );
			moveSpy.restore();
		},

		'test classic - inside of view - center': function() {
			this._scrollViewport( screenSize.width, screenSize.height );
			var moveSpy = spy( this.balloon, 'move' );
			balloonTestsTools.attachBalloon( this.balloon, 'center' );

			// Should appear on the right-hand side.
			balloonTestsTools.assertMoveTo( {
				moveMethod: moveSpy,
				expectedX: screenSize.width * 1.5,
				expectedY: screenSize.height * 1.5 - balloonSize.height / 2,
				maxX: screenSize.width * 2,
				maxY: screenSize.height * 1.5,
				shouldRound: true
			} );
			moveSpy.restore();
		},

		'test classic - out of view - center bottom': function() {
			this._scrollViewport( screenSize.width, screenSize.height * 2 );
			var moveSpy = spy( this.balloon, 'move' );
			balloonTestsTools.attachBalloon( this.balloon, 'center' );

			// Should appear on the right-hand side.
			balloonTestsTools.assertMoveTo( {
				moveMethod: moveSpy,
				expectedX: screenSize.width * 1.5 - balloonSize.width,
				expectedY: screenSize.height * 2 + 20,
				maxX: screenSize.width * 1.5 + balloonSize.width,
				maxY: screenSize.height * 2 + 21,
				shouldRound: true
			} );
			moveSpy.restore();
		},

		// Scrolls the viewport of classic editor.
		_scrollViewport: function( x, y ) {
			this.editor.window.$.scrollTo( x, y );
		}
	} );

	// A preparation function that will put elements in correct place.
	function positionMisplacedElements() {
		var screenWidth = screenSize.width,
			screenHeight = screenSize.height,
			reposition = function( elemId, x, y ) {
				CKEDITOR.document.getById( elemId ).setStyles( {
					top: y + 'px',
					left: x + 'px'
				} );
			};

		reposition( 'center', screenWidth * 1.5, screenHeight * 1.5 );
		reposition( 'reference', screenWidth, screenHeight );
	}
} )();
