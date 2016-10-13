/* bender-tags: editor, tabletools */
/* bender-ckeditor-plugins: tabletools, toolbar */

( function() {
	'use strict';

	// Based on http://yuilibrary.com/yui/docs/api/files/test_js_ObjectAssert.js.html#l12.
	YUITest.ObjectAssert.areDeepEqual = function( expected, actual, message ) {
		var expectedKeys = YUITest.Object.keys( expected ),
			actualKeys = YUITest.Object.keys( actual ),
			areEqual = YUITest.ObjectAssert.areEqual;

		YUITest.Assert._increment();

		// First check keys array length.
		if ( expectedKeys.length != actualKeys.length ) {
			YUITest.Assert.fail( YUITest.Assert._formatMessage( message,
				'Object should have ' + expectedKeys.length + ' keys but has ' + actualKeys.length ) );
		}

		// Then check values.
		for ( var name in expected ) {
			if ( expected.hasOwnProperty( name ) ) {
				if ( typeof expected[ name ] === 'object' ) {
					areEqual( expected[ name ], actual[ name ] );
				}
				else if ( expected[ name ] !== actual[ name ] ) {
					throw new YUITest.ComparisonFailure( YUITest.Assert._formatMessage( message,
						'Values should be equal for property ' + name ), expected[ name ], actual[ name ] );
				}
			}
		}
	};

	function createMap( table, pattern ) {
		var cells = table.find( 'td, th' ),
			map = [],
			i,
			j;

		for ( i = 0; i < pattern.length; i++ ) {
			if ( !map[ i ] ) {
				map[ i ] = [];
			}

			for ( j = 0; j < pattern[ i ].length; j++ ) {
				map[ i ][ j ] = cells.getItem( pattern[ i ][ j ] ).$;
			}
		}

		return map;
	}

	var mapsPatterns = [
		// 0
		[
			[ 0, 1, 2, 3, 4 ],
			[ 5, 6, 7, 8, 9 ],
			[ 10, 11, 12, 13, 14 ],
			[ 15, 16, 17, 18, 19 ],
			[ 20, 21, 22, 23, 24 ]
		],

		// 1
		[
			[ 0, 0, 1, 2 ],
			[ 3, 4, 1, 5 ],
			[ 6, 6, 6, 7 ],
			[ 6, 6, 6, 8 ]
		],

		// 2
		[
			[ 1, 2, 3 ],
			[ 6, 7, 8 ],
			[ 11, 12, 13 ]
		],

		// 3
		[
			[ 0, 0 ],
			[ 3, 4 ]
		],

		// 4
		[
			[ 6, 6, 6, 7 ],
			[ 6, 6, 6, 8 ]
		],

		// 5
		[
			[ 0, 1, 2, 3 ],
			[ 4, 5, 6, 7 ],
			[ 8, 9, 10, 11 ],
			[ 12, 13, 14, 15 ],
			[ 16, 17, 18, 19 ]
		],

		// 6
		[
			[ 4, 5, 6, 7 ],
			[ 8, 9, 10, 11 ],
			[ 12, 13, 14, 15 ],
			[ 16, 17, 18, 19 ],
			[ 0, 1, 2, 3 ]
		],

		// 7
		[
			[ 0, 1, 2, 3 ],
			[ 8, 9, 10, 11 ],
			[ 12, 13, 14, 15 ],
			[ 16, 17, 18, 19 ],
			[ 20, 21, 22, 23 ],
			[ 4, 5, 6, 7 ]
		],

		// 8
		[
			[ 1 ],
			[ 5 ],
			[ 9 ]
		],

		// 9
		[
			[ 18, 19 ],
			[ 2, 3 ]
		],

		// 10
		[
			[ 1 ],
			[ 9 ],
			[ 13 ],
			[ 17 ],
			[ 21 ],
			[ 5 ]
		],

		// 11
		[
			[ 11, 12, 13 ],
			[ 11, 16, 17 ]
		]
	];

	bender.editor = {};

	bender.test( {
		doTest: function( tableID, mapID, mapParams ) {
			mapParams = mapParams || [];

			var bot = this.editorBot,
				editor = this.editor,
				editable = editor.editable(),
				expectedMap,
				map;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( tableID ).getOuterHtml() );
			mapParams.unshift( editable.findOne( 'table' ) );

			expectedMap = createMap( mapParams[ 0 ], mapsPatterns[ mapID ] );
			map = CKEDITOR.tools.buildTableMap.apply( null, mapParams );

			objectAssert.areDeepEqual( expectedMap, map );
		},

		'test whole map, normal table (#0)': function() {
			this.doTest( 'normal', 0 );
		},

		'test whole map, table with [rowspan] and [colspan] (#1)': function() {
			this.doTest( 'spanny', 1 );
		},

		'test fragment map, normal table (#2)': function() {
			this.doTest( 'normal', 2, [ 0, 1, 2, 3 ] );
		},

		'test fragment map, table with [rowspan] and [colspan] (#3)': function() {
			this.doTest( 'spanny', 3, [ 0, 0, 1, 1 ] );
		},

		'test fragment map, table with [rowspan] and [colspan] (#4)': function() {
			this.doTest( 'spanny', 4, [ 2, 0, 3, 3 ] );
		},

		'test whole map, table with thead (#5)': function() {
			this.doTest( 'thead', 5 );
		},

		'test whole map, table with tfoot (#6)': function() {
			this.doTest( 'tfoot', 6 );
		},

		'test whole map, table with thead, tfoot (#7)': function() {
			this.doTest( 'theadtfoot', 7 );
		},

		'test fragment map, table with thead (#8)': function() {
			this.doTest( 'thead', 8, [ 0, 1, 2, 1 ] );
		},

		'test fragment map, table with tfoot (#9)': function() {
			this.doTest( 'tfoot', 9, [ 3, 2, 4, 3 ] );
		},

		'test fragment map, table with thead, tfoot (#10)': function() {
			this.doTest( 'theadtfoot', 10, [ 0, 1, 5, 1 ] );
		},

		'test fragment map, table with [rowspan]s (#11)': function() {
			this.doTest( 'rowspan', 11, [ 2, 2, 3, 4 ] );
		}
	} );
} )();
