/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,

		expected = (
			function() {

				// Expected results for modern browsers other than Edge.
				var defaultReturn = {
					onlyElement: {
						0: { x: 100, y: 100, width: 163, height: 61, top: 100, right: 263, bottom: 161, left: 100 }
					},

					lastElement: {
						0: { x: 426, y: 100, width: 163, height: 61, top: 100, right: 589, bottom: 161, left: 426 }
					},

					twoLine: {
						0: { x: 426, y: 100, width: 163, height: 61, top: 100, right: 589, bottom: 161, left: 426 },
						1: { x: 100, y: 161, width: 163, height: 61, top: 161, right: 263, bottom: 222, left: 100 },
						2: { x: 263, y: 161, width: 163, height: 61, top: 161, right: 426, bottom: 222, left: 263 }
					},

					threeLine: {
						0: { x: 426, y: 100, width: 163, height: 61, top: 100, right: 589, bottom: 161, left: 426 },
						1: { x: 100, y: 161, width: 163, height: 61, top: 161, right: 263, bottom: 222, left: 100 },
						2: { x: 263, y: 161, width: 163, height: 61, top: 161, right: 426, bottom: 222, left: 263 },
						3: { x: 426, y: 161, width: 163, height: 61, top: 161, right: 589, bottom: 222, left: 426 },
						4: { x: 100, y: 222, width: 163, height: 61, top: 222, right: 263, bottom: 283, left: 100 }
					}
				};

				if ( CKEDITOR.env.ie ) {
					// Lets get rid of those right now, so we don't need to ignore 'x' and 'y' in asserts on IE/Edge.
					for ( var index in defaultReturn ) {
						for ( var key in defaultReturn[ index ] ) {
							delete defaultReturn[ index ][ key ].x;
							delete defaultReturn[ index ][ key ].y;
						}
					}
				}

				if ( CKEDITOR.env.ie && CKEDITOR.env.version > 8 || CKEDITOR.env.edge ) {

					// Expected results for Edge and newer IEs.
					return {
						onlyElement: defaultReturn.onlyElement,
						lastElement: defaultReturn.lastElement,
						twoLine: {
							0: defaultReturn.twoLine[ 0 ],
							1: { width: 326, height: 61, top: 161, right: 426, bottom: 222, left: 100 }
						},
						threeLine: {
							0: defaultReturn.twoLine[ 0 ],
							1: { width: 489, height: 61, top: 161, right: 589, bottom: 222, left: 100 },
							2: defaultReturn.threeLine[ 4 ]
						}
					};

				} else if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {

					// Expected result for IE 8.
					return {
						onlyElement: defaultReturn.onlyElement,
						lastElement: defaultReturn.lastElement,
						twoLine: {
							0: { right: 426, bottom: 222, left: 426, top: 142, width: 0, height: 80 }
						},
						threeLine: {
							0: { right: 426, bottom: 283, left: 263, top: 142, width: 163, height: 141 }
						}
					};
				}

				return defaultReturn;
			} )(),

		tests = {
			setUp: function() {
				this.playground = doc.getById( 'playground' );
			},

			'test only element selection': function() {
				this._setTest( 'only-element-selection', expected.onlyElement );
			},

			'test last element selection': function() {
				this._setTest( 'last-element-selection', expected.lastElement );
			},

			'test two line selection': function() {
				this._setTest( 'two-line-selection', expected.twoLine );
			},

			'test three line selection': function() {
				this._setTest( 'three-line-selection', expected.threeLine );
			},


			_selectFixture: function( fixtureId ) {
				var range = bender.tools.range.setWithHtml( this.playground, doc.getById( fixtureId ).getHtml().replace( /[\t\n]/g, '' ) );

				doc.getSelection().selectRanges( [ range ] );

				return range;
			},

			_setTest: function( fixture, expectedRects ) {

				var range = this._selectFixture( fixture ),
					rects = range.getClientRects(),
					actual;

				for ( var index in expectedRects ) {
					for ( var key in expectedRects[ index ] ) {
						actual = rects[ index ][ key ];

						if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
							// Selecting only image on IE will return empty rect. Using fallback for that case will return wrong height and top.
							if ( rects.length === 1 && key === 'height' || rects.length === 1 && key === 'top' ) {
								continue;
							}
							// IE returns width and right bigger by small value.
							else if ( key === 'width' || key === 'right' ) {
								actual = Math.floor( actual * 10 ) / 10;
							}
						}
						assert.areEqual( expectedRects[ index ][ key ], actual, 'rect[ ' + index + ' ].' + key );
					}
				}
			}
		};

	bender.test( tests );
} )();
