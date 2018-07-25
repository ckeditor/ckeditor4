/* bender-tags: a11ychecker,balloonpanel */
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
				var rect = { height: 15, width: 25, left: 390, bottom: 454.34375, right: 415, top: 439.34375 };

				this.testBalloonPanelPosition( rect, 180, 346.84375 );
			},

			'test classic - out of view - bottom center': function() {
				// Position acts as if the editor viewport was at position x: 260, 0.
				var rect = { height: 15, width: 25, left: 130, bottom: 759.34375, right: 155, top: 744.34375 };
				this.testBalloonPanelPosition( rect, 92.5, 422 );
			},

			'test classic - out of view - left vcenter': function() {
				// Position acts as if the editor viewport was at position x: 420, 260.
				var rect = { height: 15, width: 25, left: -30, bottom: 499.34375, right: -5, top: 484.34375 };
				this.testBalloonPanelPosition( rect, 21, 391.84375 );
			},

			'test classic - out of view - hcenter top': function() {
				// Position acts as if the editor viewport was at position x: 260, 500.
				var rect = { height: 15, width: 25, left: 130, bottom: 267.34375, right: 155, top: 252.3475 };
				this.testBalloonPanelPosition( rect, 92.5, 363 );
			},

			'test classic - inside viewport - left top': function() {
				// Position acts as if the editor viewport was at position x: 388, 400.
				var rect = { height: 15, width: 25, left: 2, bottom: 359.34375, right: 27, top: 344.34375 };
				this.testBalloonPanelPosition( rect, -25.5, 379.34375 );
			},

			'test classic - inside viewport - right bottom': function() {
				// Position acts as if the editor viewport was at position x: 114, 101.
				var rect = { height: 15, width: 25, left: 276, bottom: 658.34375, right: 301, top: 643.34375 };
				this.testBalloonPanelPosition( rect, 228.5, 422 );
			},

			createSelectionForTests: function( rect ) {
				var selection = new CKEDITOR.dom.selection( this.editor.editable() );

				selection.getRanges = function() {
					var range = {
						getClientRects: sinon.stub().returns( [ rect ] )
					};
					return [ range ];
				};

				return selection;
			},

			testBalloonPanelPosition: function( rect, expectedX, expectedY ) {
				var moveSpy = spy( this.balloon, 'move' ),
					selection = this.createSelectionForTests( rect );

				this.markerElement.getClientRect = sinon.stub().returns( rect );

				balloonTestsTools.attachBalloon( this.balloon, this.markerElement );
				balloonTestsTools.assertMoveTo( moveSpy, expectedX, expectedY );

				moveSpy.restore();

				balloonTestsTools.attachBalloon( this.balloon, selection );
				balloonTestsTools.assertMoveTo( moveSpy, expectedX, expectedY );

				moveSpy.restore();
			}
		};

	bender.test( tests );
} )();
