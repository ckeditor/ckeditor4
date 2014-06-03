/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		playground = doc.getById( 'playground' ),
		setHtmlWithRange2 = bender.tools.setHtmlWithRange2,
		getHtmlWithRange = bender.tools.getHtmlWithRange,
		playgroundAddress = playground.getAddress();

	// Asserts setHtmlWithRange2 and getHtmlWithRange.
	function s( html, collapsed, startAddress, startOffset, endAddress, endOffset ) {
		return function() {
			var range = setHtmlWithRange2( playground, html ),
				startContainer, endContainer, range;

			// Get startContainer by address.
			if ( startAddress && startOffset != undefined )
				startContainer = doc.getByAddress( playgroundAddress.concat( startAddress ) );

			// Get endContainer by address.
			if ( collapsed === true ) {
				endContainer = startContainer;
				endOffset = startOffset;
			} else if ( collapsed === false )
				endContainer = doc.getByAddress( playgroundAddress.concat( endAddress ) );

			if ( startContainer && endContainer ) {
				assert.isTrue( startContainer.equals( range.startContainer ), 'startContainer' );
				assert.isTrue( endContainer.equals( range.endContainer ), 'endContainer' );
				assert.areSame( startOffset, range.startOffset, 'startOffset' );
				assert.areSame( endOffset, range.endOffset, 'endOffset' );
				assert.areSame( collapsed, range.collapsed, 'collapsed' );
			} else {
				assert.isNull( range, 'No ranges returned' );
				assert.areSame( html, bender.tools.fixHtml( playground.getHtml(), 1, 1 ), 'Plain HTML set' );
			}

			assert.areSame( html, getHtmlWithRange( playground, range ), 'getHtmlWithRange' );
		};
	}

	//																												Collapsed 	Start Address 		Start Offset 	End Address 		End offset
	bender.test( {
		'test text #0': 			s( '' 																																							),
		'test text #1': 			s( '{}' 																																						),
		'test text #2': 			s( '<p>x</p>' 																																					),
		'test text #3': 			s( '<p>x{}x</p>', 																true, 		[ 0, 0 ], 			1 												),
		'test text #4': 			s( '<p>{}x</p>', 																true, 		[ 0, 0 ], 			0 												),
		'test text #5': 			s( '<p>x{}</p>', 																true, 		[ 0, 0 ], 			1 												),
		'test text #6': 			s( '<p>{x}</p>', 																false, 		[ 0, 0 ], 			0, 				[ 0, 0 ], 			1 			),
		'test text #7': 			s( '<p>{x</p><p>y}</p>', 														false, 		[ 0, 0 ], 			0, 				[ 1, 0 ], 			1 			),
		'test text #8': 			s( '<p>x{</p><p>y}</p>', 														false, 		[ 0, 0 ], 			1, 				[ 1, 0 ], 			1 			),
		'test text #9': 			s( '<p>x{</p><p>}y</p>', 														false, 		[ 0, 0 ], 			1, 				[ 1, 0 ], 			0 			),
		'test text #10': 			s( '<ul><li>x{x</li><li>}y</li></ul>', 											false, 		[ 0, 0, 0 ], 		1, 				[ 0, 1, 0 ], 		0 			),
		'test text #11': 			s( '<ol><li>x{}<ul><li>y</li></ul></li></ol>', 									true, 		[ 0, 0, 0 ], 		1 												),
		'test text #12': 			s( '<p>{}<span>x</span></p>' 																																	),
		'test text #13': 			s( '<p>{<span>x</span>}</p>' 																																	),

		'test element #0': 			s( '[]', 																		true, 		[], 				0 												),
		'test element #1': 			s( '<p>x[]x</p>', 																true, 		[ 0 ], 				1 												),
		'test element #2': 			s( '<p>[]x</p>', 																true, 		[ 0 ], 				0 												),
		'test element #3': 			s( '<p>x[]</p>', 																true, 		[ 0 ], 				1 												),
		'test element #4': 			s( '<p>[x]</p>', 																false, 		[ 0 ], 				0,				[ 0 ],				1 			),
		'test element #5': 			s( '<ul>[<li>x</li><li>y</li>]</ul>', 											false, 		[ 0 ], 				0,				[ 0 ],				2 			),
		'test element #6': 			s( '<ul><li>x[x</li><li>]y</li></ul>', 											false, 		[ 0, 0 ], 			1, 				[ 0, 1 ],	 		0 			),
		'test element #7': 			s( '<p>x[<span>y</span>]</p>', 													false, 		[ 0 ],	 			1, 				[ 0 ],	 			2 			),
		'test element #8': 			s( '<p>[]<span>x</span></p>', 													true, 		[ 0 ],	 			0												),
		'test element #9': 			s( '<table><tbody><tr>[<td>x</td>]<td>x</td></tr></tbody></table>', 			false, 		[ 0, 0, 0 ], 		0, 				[ 0, 0, 0 ],	 	1 			),
		'test element #10': 		s( '<ol><li>x[]<ul><li>y</li></ul></li></ol>', 									true, 		[ 0, 0 ], 			1 												),
		'test element #11': 		s( '<ol>[<li>x</li><li>y<ul><li>z</li>]<li>a</li></ul></li></ol>', 				false, 		[ 0 ], 				0,				[ 0, 1, 1 ],		1 			),

		'test mixed #1': 			s( '<p>x{x]</p>', 																false, 		[ 0, 0 ], 			1,				[ 0 ],				1 			),
		'test mixed #2': 			s( '<p>{x]</p>', 																false, 		[ 0, 0 ], 			0,				[ 0 ],				1 			),
		'test mixed #3': 			s( '<p>[x}</p>', 																false, 		[ 0 ], 				0,				[ 0, 0 ],			1 			),
		'test mixed #4': 			s( '<p>[}x</p>', 																false, 		[ 0 ], 				0,				[ 0, 0 ],			0 			),
		'test mixed #5': 			s( '<p>x{]</p>', 																false, 		[ 0, 0 ], 			1,				[ 0 ],				1 			),
		'test mixed #6': 			s( '<p>[x</p><p>y}</p>', 														false, 		[ 0 ],	 			0, 				[ 1, 0 ], 			1 			)
	} );
} )();