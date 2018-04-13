/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,

	tests = {
		setUp: function() {
			this.playground = doc.getById( 'playground' );
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
				},
				// Due to #1852 IE and Edge won't return 'x' and 'y', so we are not testing it. Same for other TCs.
				ie: {
					0: {
						width: 163,
						height: 61,
						top: 100,
						right: 263,
						bottom: 161,
						left: 100
					}
				},
				polyfill: {
					0: {
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
				},
				ie: {
					0: {
						width: 163,
						height: 61,
						top: 100,
						right: 589,
						bottom: 161,
						left: 426
					}
				},
				polyfill: {
					0: {
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
						width: 326,
						height: 61,
						top: 161,
						right: 426,
						bottom: 222,
						left: 100
					}
				},
				polyfill: {
					0: {
						right: 426,
						bottom: 222,
						left: 426,
						top: 142,
						width: 0,
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

		_assertRectList: function( fixture, config ) {
			var range = this._selectFixture( fixture ),
				rects = range.getClientRects(),
				expectedRects = CKEDITOR.env.ie ? ( CKEDITOR.env.version === 8 ? config.polyfill : config.ie ) : config.defaultExpected,
				actual;

			for ( var index in expectedRects ) {
				for ( var key in expectedRects[ index ] ) {
					actual = rects[ index ][ key ];

					if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
						// Selecting only image on IE will return empty rect. Using fallback for that case will return wrong height and top.
						if ( rects.length === 1 && key === 'height' || key === 'top' ) {
							continue;
						}
						// IE returns width and right bigger by small value.
						else if ( key === 'width' || key === 'right' ) {
							actual = Math.floor( actual * 10 ) / 10;
						}
					}
					if ( key === 'right' )
					assert.areEqual( expectedRects[ index ][ key ], actual, 'rect[ ' + index + ' ].' + key );
				}
			}
		}
	};

	bender.test( tests );
} )();
