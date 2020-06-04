/* bender-tags: editor,dom,range */
/* bender-include: ../../../plugins/uploadfile/_helpers/waitForImage.js */
/* global waitForImage */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		isTravisAndFirefox = bender.config.isTravis && CKEDITOR.env.gecko,

	tests = {
		setUp: function() {
			this.playground = doc.getById( 'playground' );
		},

		_should: {
			ignore: {
				// Tests randomly fails on FF in Travis
				'test only element selection': isTravisAndFirefox,
				'test last element selection': isTravisAndFirefox,
				'test two line selection': isTravisAndFirefox,
				'test three line selection': isTravisAndFirefox
			}
		},

		'test only element selection': function() {
			this._assertRectList( 'only-element-selection', {
				defaultExpected: {
					0: {
						x: 100,
						y: 100,
						width: 163,
						height: 61,
						top: 100,
						right: 263,
						bottom: 161,
						left: 100
					}
				}
			} );
		},

		'test last element selection': function() {
			this._assertRectList( 'last-element-selection', {
				defaultExpected: {
					0: {
						x: 426,
						y: 100,
						width: 163,
						height: 61,
						top: 100,
						right: 589,
						bottom: 161,
						left: 426
					}
				}
			} );
		},

		'test two line selection': function() {
			this._assertRectList( 'two-line-selection', {
				defaultExpected: {
					0: {
						x: 426,
						y: 100,
						width: 163,
						height: 61,
						top: 100,
						right: 589,
						bottom: 161,
						left: 426
					},
					1: {
						x: 100,
						y: 161,
						width: 163,
						height: 61,
						top: 161,
						right: 263,
						bottom: 222,
						left: 100
					}
				},
				polyfill: {
					0: {
						right: 426,
						bottom: 222,
						left: 263,
						top: 142,
						width: 163,
						height: 80
					}
				}
			} );
		},

		'test three line selection': function() {
			this._assertRectList( 'three-line-selection', {
				defaultExpected: {
					0: {
						x: 426,
						y: 100,
						width: 163,
						height: 61,
						top: 100,
						right: 589,
						bottom: 161,
						left: 426
					},
					1: {
						x: 100,
						y: 161,
						width: 163,
						height: 61,
						top: 161,
						right: 263,
						bottom: 222,
						left: 100
					},
					2: {
						x: 263,
						y: 161,
						width: 163,
						height: 61,
						top: 161,
						right: 426,
						bottom: 222,
						left: 263
					},
					3: {
						x: 426,
						y: 161,
						width: 163,
						height: 61,
						top: 161,
						right: 589,
						bottom: 222,
						left: 426
					},
					4: {
						x: 100,
						y: 222,
						width: 163,
						height: 61,
						top: 222,
						right: 263,
						bottom: 283,
						left: 100
					}
				},
				ie: {
					0: {
						width: 163,
						height: 61,
						top: 100,
						right: 589,
						bottom: 161,
						left: 426
					},
					1: {
						width: 489,
						height: 61,
						top: 161,
						right: 589,
						bottom: 222,
						left: 100
					},
					2: {
						width: 163,
						height: 61,
						top: 222,
						right: 263,
						bottom: 283,
						left: 100
					}
				},
				polyfill: {
					0: {
						right: 426,
						bottom: 283,
						left: 263,
						top: 142,
						width: 163,
						height: 141
					}
				}
			} );
		},


		_selectFixture: function( fixtureId ) {
			var range = bender.tools.range.setWithHtml( this.playground, doc.getById( fixtureId ).getHtml().replace( /[\t\n]/g, '' ) );

			doc.getSelection().selectRanges( [ range ] );

			return range;
		},

		_assertRectList: function( fixtureId, expectedMap ) {
			var range = this._selectFixture( fixtureId ),
				playground = this.playground,
				expectedKey = 'defaultExpected',
				rects,
				expectedRects,
				curExpectedRect;

			if ( typeof document.getSelection !== 'function' ) {
				expectedKey = 'polyfill';
			} else
			// Edge 18+ has updated `getClientRects` so it matches Chrome and other modern browsers (#3183).
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 18 ) {
				expectedKey = 'ie';
			}

			expectedRects = expectedMap[ expectedKey ] || expectedMap.defaultExpected;

			if ( CKEDITOR.env.safari ) {
				waitForImage( playground.getLast(), assertRectsAfterImageLoad );
			} else {
				assertRectsAfterImageLoad();
			}

			function assertRectsAfterImageLoad() {
				rects = range.getClientRects();
				for ( var index in expectedRects ) {
					if ( CKEDITOR.env.ie ) {
						// IE and Edge doesn't return x and y properties, emulate that. (#1852)
						if ( typeof expectedRects[ index ].x !== 'undefined' ) {
							delete expectedRects[ index ].x;
						}

						if ( typeof expectedRects[ index ].y !== 'undefined' ) {
							delete expectedRects[ index ].y;
						}
					}

					for ( var key in expectedRects[ index ] ) {
						curExpectedRect = rects[ index ][ key ];

						if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
							if ( rects.length === 1 && ( key === 'height' || key === 'top' ) ) {
								// Selecting image alone on IE will return an empty rect. Using fallback for that case will return wrong height and top.
								continue;
							} else if ( key === 'width' || key === 'right' ) {
								// IE returns width and right bigger by small value.
								curExpectedRect = Math.floor( curExpectedRect * 10 ) / 10;
							}
						}
						assert.areEqual( expectedRects[ index ][ key ], curExpectedRect, fixtureId + ': rect[ ' + index + ' ].' + key );
					}
				}
			}
		}
	};

	bender.test( tests );
} )();
