/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		tests = {
			setUp: function() {
				this.playground = doc.getById( 'playground' );
			},

			'test simple single line selection': function() {
				var range = this._selectFixture( 'simple-selection' ),
					rects = range.getClientRects(),
					actual;
				range.shrink();

				var expectedRect = { x: 100, y: 100, width: 163, height: 61, top: 100, right: 263, bottom: 161, left: 100 };

				for ( var key in expectedRect ) {
					// Edge and IE don't return x and y.
					if ( CKEDITOR.env.ie && key === 'x' || key === 'y' ) {
						continue;
					}

					actual = rects[ 0 ][ key ];

					if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
						// Selecting only image on IE will return empty rect. Using fallback for that case will return wrong height and top.
						if ( key === 'height' || key === 'top' ) {
							continue;
						}
						// IE returns width and right bigger by small value.
						else if ( key === 'width' || key === 'right' ) {
							actual = Math.floor( actual * 10 ) / 10;
						}
					}
					assert.areEqual( expectedRect[ key ], actual, 'rect[ 0 ].' + key );
				}
			},

			_selectFixture: function( fixtureId ) {
				var range = bender.tools.range.setWithHtml( this.playground, doc.getById( fixtureId ).getHtml().replace( /[\t\r\n]/g, '' ) );

				doc.getSelection().selectRanges( [ range ] );

				return range;
			}
		};

	bender.test( tests );
} )();
