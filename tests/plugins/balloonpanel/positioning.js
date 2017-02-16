/* bender-tags: a11ychecker,unit,balloonpanel */
/* bender-ckeditor-plugins: toolbar,link,balloonpanel */
/* bender-include: _helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	CKEDITOR.dom.window.prototype.getViewPaneSize = function() {
		return {
			width: 1183,
			height: 1818
		};
	};

	bender.editor = {
		name: 'editor1',
		config: {
			allowedContent: true,
			height: 300,
			width: 300
		}
	};

	var balloonConfig = {
			title: 'Test panel #1',
			width: 100,
			height: 200
		},
		spy = sinon.spy,
		tests = {
			// This test contains classic editor positioning tests.
			//
			// Editor has a tiny size (300x300), containing a bigger content with a span#marker.
			// Each TC will attach balloon to the marker but will put viewport in different positions.
			//
			// Marker is has width: 25, height: 15
			// And is located at: x: 389, y: 401 (absolutely to top left corner of the content).
			//
			// +--------------300px-----------------+ - - - - - - - content - - - - - - - - +
			// |                                    |                                       |
			// |              editor                |
			// |                                    |                                       |
			// |                                    |
			// |                                    |                                       |
			// |                                    |
			// |                                    |                                       |
			// +------------------------------------+
			// |                                                                            |
			//
			// |                                               +-------------+              |
			//                                                 |   marker    |
			// |                                               +-------------+              |
			//
			// |                                                                            |
			//
			// |                                                                            |
			//
			// |                                                                            |
			//
			// +----------------------------------------------------------------------------+
			//
			// Marker position (getClientRect method) is mocked, because browsers are returning different
			// px results for marker position, and editor frame position (even depending if u're running
			// from dashboard or directly).
			//
			// There's no need to call editor.window.scrollTo, because balloon logic initialy considers only
			// scrolling of **outer window**. It does not care about editable window, as its scrolling is already
			// "contained" in result returned by the element.getClientRect() of marker.
			_getFrameMethodReplaced: false,

			setUp: function() {
				this.balloon = new CKEDITOR.ui.balloonPanel( this.editor, balloonConfig );

				this.markerElement = this.editor.editable().findOne( '#marker' );

				// Make sure that global window is scrolled down to 0,0.
				window.scrollTo( 0, 0 );

				if ( !this._getFrameMethodReplaced ) {
					// The problem is also window.getFrame().getClientRect() as it retursn different results from dashboard and directly.
					this._getFrameMethodReplaced = true;
					var orig = this.editor.window.getFrame;

					this.editor.window.getFrame = function() {
						var ret = orig.call( this );

						if ( ret ) {
							ret.getClientRect = function() {
								return { height: 300, width: 300, left: 1, bottom: 643, right: 301, top: 343 };
							};
						}

						return ret;
					};
				}
			},

			tearDown: function() {
				this.balloon.destroy();
				this.balloon = null;
			},

			'test classic - out of view - right': function() {
				// Check balloon position if the elemnt outside of right border of the editor.
				//
				// +-------------------------+
				// |                         |
				// |                         |		+---------------+
				// |         editor          |		|    marker     |
				// |                         |		+---------------+
				// |                         |
				// +-------------------------+
				// Position acts as if the editor viewport was at position x: 0, 305.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 389, bottom: 111.34375, right: 414, top: 96.34375 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 180, 346.84375 );

				moveSpy.restore();
			},

			'test classic - out of view - bottom center': function() {
				// Position acts as if the editor viewport was at position x: 260, 0.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: 416.34375, right: 154, top: 401.34375 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 92.5, 422 );

				moveSpy.restore();
			},

			'test classic - out of view - left vcenter': function() {
				// Position acts as if the editor viewport was at position x: 420, 260.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: -31, bottom: 156.34375, right: -6, top: 141.34375 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 21, 391.84375 );

				moveSpy.restore();
			},

			'test classic - out of view - hcenter top': function() {
				// Position acts as if the editor viewport was at position x: 260, 500.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 129, bottom: -75.65625, right: 154, top: -90.65625 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 92.5, 363 );

				moveSpy.restore();
			},

			'test classic - inside viewport - left top': function() {
				// Position acts as if the editor viewport was at position x: 388, 400.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 1, bottom: 16.34375, right: 26, top: 1.34375 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				// Most likely we'll have to work on this case, since balloon is cropped.
				balloonTestsTools.assertMoveTo( moveSpy, -25.5, 379.34375 );

				moveSpy.restore();
			},

			'test classic - inside viewport - right bottom': function() {
				// Position acts as if the editor viewport was at position x: 114, 101.
				this.markerElement.getClientRect = sinon.stub().returns( { height: 15, width: 25, left: 275, bottom: 315.34375, right: 300, top: 300.34375 } );
				var moveSpy = spy( this.balloon, 'move' );
				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );

				balloonTestsTools.assertMoveTo( moveSpy, 228.5, 422 );

				moveSpy.restore();
			}
		};

	bender.test( tests );
} )();
