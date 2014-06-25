/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		playground = doc.getById( 'playground' ),
		setRange = bender.tools.range.setWithHtml,
		getRange = bender.tools.range.getWithHtml,
		playgroundAddress = playground.getAddress(),

		failIE11 = CKEDITOR.env.ie && CKEDITOR.env.version > 10,
		failIE8 = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

	// Asserts setRange and getRange.
	function s( html, collapsed, startAddress, startOffset, endAddress, endOffset, htmlWithRangeOrCallback ) {
		return function() {
			var range = setRange( playground, html ),
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
			}

			if ( typeof htmlWithRangeOrCallback == 'function' ) {
				htmlWithRangeOrCallback( playground, range );
			} else {
				assert.areSame( html.replace( /[\{\}\[\]]/g, '' ), bender.tools.fixHtml( playground.getHtml(), 1, 1 ), 'Markers cleaned - setRange' );
				if ( htmlWithRangeOrCallback == undefined )
					htmlWithRangeOrCallback = html;
				assert.areSame( htmlWithRangeOrCallback, bender.tools.fixHtml( getRange( playground, range ), 1, 1 ), 'getRange' );
			}
		};
	}

	bender.test( {
		_should: {
			ignore: {
				// IE11 inserts extra <br>.
				'test text #0': failIE11,

				// IE8 normalizes double spaces, etc.
				'test text #16': failIE8,
				'test text #18': failIE8,
				'test text #19': failIE8,
				'test element #13': failIE8,
				'test element #14': failIE8,
				'test element #15': failIE8,
				'test element #16': failIE8,
				'test element #17': failIE8,
				'test mixed #8': failIE8
			}
		},

		//																											Collapsed 	Start Address 		Start Offset 	End Address 		End offset 		HtmlWithRange/callback
		'test text #0': 			s( '' 																																															),
		'test text #1': 			s( '{}', 																		null,		null,				null,			null,				null,			''							),
		'test text #2': 			s( '<p>x</p>' 																																													),
		'test text #3': 			s( '<p>x{}x</p>', 																true, 		[ 0, 0 ], 			1 																				),
		'test text #4': 			s( '<p>{}x</p>', 																true, 		[ 0, 0 ], 			0 																				),
		'test text #5': 			s( '<p>x{}</p>', 																true, 		[ 0, 0 ], 			1 																				),
		'test text #6': 			s( '<p>{x}</p>', 																false, 		[ 0, 0 ], 			0, 				[ 0, 0 ], 			1 											),
		'test text #7': 			s( '<p>{x</p><p>y}</p>', 														false, 		[ 0, 0 ], 			0, 				[ 1, 0 ], 			1 											),
		'test text #8': 			s( '<p>x{</p><p>y}</p>', 														false, 		[ 0, 0 ], 			1, 				[ 1, 0 ], 			1 											),
		'test text #9': 			s( '<p>x{</p><p>}y</p>', 														false, 		[ 0, 0 ], 			1, 				[ 1, 0 ], 			0 											),
		'test text #10': 			s( '<ul><li>x{x</li><li>}y</li></ul>', 											false, 		[ 0, 0, 0 ], 		1, 				[ 0, 1, 0 ], 		0 											),
		'test text #11': 			s( '<ol><li>x{}<ul><li>y</li></ul></li></ol>', 									true, 		[ 0, 0, 0 ], 		1 																				),
		'test text #12': 			s( '<p>{}<span>x</span></p>', 													null,		null,				null,			null,				null,			'<p><span>x</span></p>'		),
		'test text #13': 			s( '<p>{<span>x</span>}</p>', 													null,		null,				null,			null,				null,			'<p><span>x</span></p>'		),
		'test text #14': 			s( '<p>x {}</p>', 																true, 		[ 0, 0 ], 			2 																				),
		'test text #15': 			s( '<p>{} x</p>', 																true, 		[ 0, 0 ], 			0 																				),
		'test text #16': 			s( '<p> {} </p>', 																true, 		[ 0, 0 ], 			1 																				),
		'test text #17': 			s( '<p>{ }</p>', 																false, 		[ 0, 0 ], 			0,				[ 0, 0 ], 			1											),
		'test text #18': 			s( '<p>{  }</p>', 																false, 		[ 0, 0 ], 			0,				[ 0, 0 ], 			2											),
		'test text #19': 			s( '<div>{ <p> }</p></div>', 													false, 		[ 0, 0 ], 			0,				[ 0, 1, 0 ], 		1											),
		'test text #20': 			s( '<p>{<span>x</span> }</p>', 													false, 		null,	 			null,			null, 				null,			'<p><span>x</span> </p>'	),
		'test text #21': 			s( '<p id="foo">x{}</p>', 														true, 		[ 0, 0 ], 			1 																				),

		'test element #0': 			s( '[]', 																		true, 		[], 				0 																				),
		'test element #1': 			s( '<p>x[]x</p>', 																true, 		[ 0 ], 				1 																				),
		'test element #2': 			s( '<p>[]x</p>', 																true, 		[ 0 ], 				0 																				),
		'test element #3': 			s( '<p>x[]</p>', 																true, 		[ 0 ], 				1 																				),
		'test element #4': 			s( '<p>[x]</p>', 																false, 		[ 0 ], 				0,				[ 0 ],				1 											),
		'test element #5': 			s( '<ul>[<li>x</li><li>y</li>]</ul>', 											false, 		[ 0 ], 				0,				[ 0 ],				2 											),
		'test element #6': 			s( '<ul><li>x[x</li><li>]y</li></ul>', 											false, 		[ 0, 0 ], 			1, 				[ 0, 1 ],	 		0 											),
		'test element #7': 			s( '<p>x[<span>y</span>]</p>', 													false, 		[ 0 ],	 			1, 				[ 0 ],	 			2 											),
		'test element #8': 			s( '<p>[]<span>x</span></p>', 													true, 		[ 0 ],	 			0																				),
		'test element #9': 			s( '<table><tbody><tr>[<td>x</td>]<td>x</td></tr></tbody></table>', 			false, 		[ 0, 0, 0 ], 		0, 				[ 0, 0, 0 ],	 	1 											),
		'test element #10': 		s( '<ol><li>x[]<ul><li>y</li></ul></li></ol>', 									true, 		[ 0, 0 ], 			1 																				),
		'test element #11': 		s( '<ol>[<li>x</li><li>y<ul><li>z</li>]<li>a</li></ul></li></ol>', 				false, 		[ 0 ], 				0,				[ 0, 1, 1 ],		1 											),
		'test element #12': 		s( '<p>x []</p>', 																true, 		[ 0 ], 				1 																				),
		'test element #13': 		s( '<p>[] x</p>', 																true, 		[ 0 ],	 			0 																				),
		'test element #14': 		s( '<p> [] </p>', 																true, 		[ 0 ], 				1 																				),
		'test element #15': 		s( '<p>[ ]</p>', 																false, 		[ 0 ], 				0,				[ 0 ], 				1											),
		'test element #16': 		s( '<p>[  ]</p>', 																false, 		[ 0 ], 				0,				[ 0 ], 				1											),
		'test element #17': 		s( '<div>[ <p> ]</p></div>', 													false, 		[ 0 ], 				0,				[ 0, 1 ], 			1											),

		'test mixed #1': 			s( '<p>x{x]</p>', 																false, 		[ 0, 0 ], 			1,				[ 0 ],				1 											),
		'test mixed #2': 			s( '<p>{x]</p>', 																false, 		[ 0, 0 ], 			0,				[ 0 ],				1 											),
		'test mixed #3': 			s( '<p>[x}</p>', 																false, 		[ 0 ], 				0,				[ 0, 0 ],			1 											),
		'test mixed #4': 			s( '<p>[}x</p>', 																false, 		[ 0 ], 				0,				[ 0, 0 ],			0 											),
		'test mixed #5': 			s( '<p>x{]</p>', 																false, 		[ 0, 0 ], 			1,				[ 0 ],				1 											),
		'test mixed #6': 			s( '<p>[x</p><p>y}</p>', 														false, 		[ 0 ],	 			0, 				[ 1, 0 ], 			1 											),
		'test mixed #7': 			s( '<p>{ ]</p>', 																false, 		[ 0, 0 ], 			0,				[ 0 ],				1 											),
		'test mixed #8': 			s( '<p> { ] </p>', 																false, 		[ 0, 0 ], 			1,				[ 0 ],				1 											),

		// IE9-11 aren't any better than IE8 and lose empty text nodes between elements
		// when cloning a tree. We need special clone method to workaround this.
		'test special #1': 			s( '<p>x<br>{}y<br></p>', 														true, 		[ 0, 2 ],	 		0,				null, 				null,
			function( playground, range ) {
				// Let's remove "y".
				var text = playground.getChild( [ 0, 2 ] );
				assert.areSame( 'y', text.getText(), 'we found the right node' );
				text.setText( '' );

				assert.areSame( '<p>x<br>{}<br></p>', bender.tools.fixHtml( getRange( playground, range ), 1, 1 ), 'getRange' );
			} ),
	} );
} )();