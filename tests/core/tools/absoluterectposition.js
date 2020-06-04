/* bender-tags: editor, tools */

( function() {
	'use strict';

	var scrollPositionMock,
		tests = {
			setUp: function() {
				CKEDITOR.document.getBody().setStyle( 'height', '5000px' );
			},
			tearDown: function() {
				if ( scrollPositionMock ) {
					scrollPositionMock.restore();
					scrollPositionMock = null;
				}
			},
			'test absolute rect inline': function() {
				scrollPositionMock = sinon.stub( CKEDITOR.dom.window.prototype, 'getScrollPosition' ).returns( { x: 0, y: 0 } );

				var rect = {
						bottom: 10,
						height: 10,
						left: 0,
						right: 10,
						top: 0,
						width: 10,
						x: 0,
						y: 0
					},
					expected = CKEDITOR.tools.copy( rect ),
					// Mimic inline editor, as it is outside of an iframe.
					mockedWindow = {
						getFrame: function() {
							return null;
						}
					},
					absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( mockedWindow, rect );

				assertRect( absoluteRect, expected );

				scrollPositionMock.returns( { x: 0, y: 100 } );
				// We are adjusting the rect, as an element would move when scrolling.
				updateVerticalRectParts( rect, -100 );
				absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( mockedWindow, rect );

				assertRect( absoluteRect, expected );
			},
			'test absolute rect classic': function() {
				scrollPositionMock = sinon.stub( CKEDITOR.dom.window.prototype, 'getScrollPosition' ).returns( { x: 0, y: 0 } );

				var rect = {
						bottom: 10,
						height: 10,
						left: 0,
						right: 10,
						top: 0,
						width: 10,
						x: 0,
						y: 0
					},
					expected = {
						bottom: 119,
						height: 10,
						left: 100,
						right: 110,
						top: 109,
						width: 10,
						x: 100,
						y: 109
					},
					frameRect = {
						bottom: 309,
						height: 200,
						left: 100,
						right: 400,
						top: 109,
						width: 300,
						x: 100,
						y: 109
					},
					// Mimic classic editor, as it would be inside an iframe.
					mockedWindow = {
						getFrame: function() {
							return {
								getClientRect: function() {
									return frameRect;
								},
								getWindow: function() {
									return {
										getFrame: function() {}
									};
								}
							};
						}
					},
					absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( mockedWindow, rect );

				assertRect( absoluteRect, expected );

				scrollPositionMock.returns( { x: 0, y: 100 } );
				// We need to change frameRect as it would be scrolled.
				updateVerticalRectParts( frameRect, -100 );
				absoluteRect = CKEDITOR.tools.getAbsoluteRectPosition( mockedWindow, rect );

				assertRect( absoluteRect, expected );
			}
		};

	bender.test( tests );

	function updateVerticalRectParts( rect, value ) {
		CKEDITOR.tools.array.forEach( [ 'top', 'bottom', 'y' ], function( key ) {
			if ( key in rect ) {
				rect[ key ] += value;
			}
		} );
	}

	function assertRect( actual, expected ) {
		for ( var key in expected ) {
			assert.areEqual( expected[ key ], actual[ key ] );
		}
	}
} )();
