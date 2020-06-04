/* bender-tags: editor */
/* bender-ckeditor-plugins: textmatch */
/* bender-tags: unit, jquery */
/* global $ */

( function() {
	'use strict';

	var tcs = {},
		rangeRoot = new CKEDITOR.dom.element( 'div' ),
		tcGenerators;

	function setupPlayground( html, suffix ) {
		suffix = ( typeof suffix == 'string' ? suffix : '' );
		var playground = CKEDITOR.document.getById( 'playground' + suffix );

		// Replace dots with elements and then remove all of them leaving
		// split text nodes.
		html = html.replace( /\./g, '<i class="split"></i>' );
		bender.tools.range.setWithHtml( playground, html );

		// Hack to avoid merging text nodes by IE 8.
		// We are leaving references to them, so IE won't merge them.
		findNode( playground, '#weLoveIE8' );

		$( '#playground' + suffix + ' .split' ).remove();

		return playground;
	}

	function createRange( root, position ) {
		var range = new CKEDITOR.dom.range( root );

		range.setStart( findNode( root, position.sc ), position.so );
		if ( position.ec )
			range.setEnd( findNode( root, position.ec ), position.eo );
		else
			range.collapse( true );

		return range;
	}

	function findNode( container, query ) {
		// Special case.
		if ( query == 'root' )
			return container;

		var textQuery = query.indexOf( '#' ) === 0 ? query.slice( 1 ) : false,
			range = new CKEDITOR.dom.range( container ),
			node,
			walker;

		range.selectNodeContents( container );
		walker = new CKEDITOR.dom.walker( range );

		while ( ( node = walker.next() ) ) {
			if ( textQuery && node.type == CKEDITOR.NODE_TEXT && node.getText() == textQuery )
				return node;
			else if ( !textQuery && node.type == CKEDITOR.NODE_ELEMENT && node.is( query ) )
				return node;
		}
	}

	function addTestCases( readyTCs, tcs ) {
		var tcType, tcName;

		for ( tcType in tcs ) {
			for ( tcName in tcs[ tcType ] ) {
				readyTCs[ 'test ' + tcType + ' - ' + tcName ] = tcGenerators[ tcType ].apply( null, tcs[ tcType ][ tcName].concat( tcName ) );
			}
		}
	}

	tcGenerators = {
		getAdjacentTextNodes: function( input, rangeData, expected ) {
			return function() {
				var playground = setupPlayground( input ),
					range = createRange( playground, rangeData ),
					ret = CKEDITOR.plugins.textMatch.getAdjacentTextNodes( range );

				input, rangeData, expected;

				assert.areSame( expected.length, ret.length );

				var max = ret.length;
				for ( var i = 0; i < max; i += 1 ) {
					assert.areSame( expected[ i ], ret[ i ].getText() );
				}
			};
		},

		getTextAndRange: function( input, rangeData, text, offset ) {
			return function() {
				var playground = setupPlayground( input ),
					range = createRange( playground, rangeData );

				var ret = CKEDITOR.plugins.textMatch.getTextAndOffset( range );

				assert.areSame( text, ret.text );
				assert.areSame( offset, ret.offset );
			};
		},

		getRangeInText: function( input, inputRangeData, start, end, output, outputRangeData ) {
			return function() {
				var inputPlayground = setupPlayground( input ),
					inputRange = createRange( inputPlayground, inputRangeData ),
					outputPlayground = setupPlayground( output, '2' ),
					outputRange = createRange( outputPlayground, outputRangeData ),
					ret = CKEDITOR.plugins.textMatch.getRangeInText( inputRange, start, end );

				assert.areSame( outputRange.startContainer.getText(), ret.startContainer.getText() );
				assert.areSame( outputRange.endContainer.getText(), ret.endContainer.getText() );

				assert.areSame( outputRange.startOffset, ret.startOffset );
				assert.areSame( outputRange.endOffset, ret.endOffset );
			};
		}
	};

	tcs[ 'test textMatch' ] = function() {
		var range = bender.tools.range.setWithHtml( rangeRoot, '<p>Hel{}lo</p>' ),
			result = CKEDITOR.plugins.textMatch.match( range, function( text, offset ) {

				assert.areEqual( 'Hello', text );
				assert.areEqual( 3, offset );

				return {
					start: 0,
					end: 3
				};
			} );

		assert.areSame( 'Hel', result.text );
		assert.areSame( range.startContainer, result.range.startContainer );
		assert.areSame( 0, result.range.startOffset );
		assert.areSame( 3, result.range.endOffset );
	};

	// (#2038)
	tcs[ 'test textMatch with filling char sequence' ] = function() {
		var html = '<p>' + CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE + 'Hel{}lo</p>',
			range = bender.tools.range.setWithHtml( rangeRoot, html ),
			result = CKEDITOR.plugins.textMatch.match( range, function( text, offset ) {

				assert.areEqual( 'Hello', text );
				assert.areEqual( 3, offset );

				return {
					start: 0,
					end: 3
				};
			} );

		assert.areSame( 'Hel', result.text );
		assert.areSame( range.startContainer, result.range.startContainer );
		assert.areSame( 0, result.range.startOffset );
		assert.areSame( 10, result.range.endOffset );
	};

	addTestCases( tcs, {
		getAdjacentTextNodes: {
			'a0': [ '<p>he.llo</p>', { sc: 'p', so: 0 }, [ 'he', 'llo' ] ],
			'a1': [ '<p>he.llo</p>', { sc: 'p', so: 1 }, [ 'he', 'llo' ] ],
			'a2': [ '<p>he.llo</p>', { sc: 'p', so: 2 }, [ 'he', 'llo' ] ],

			'b0': [ '<p>he.ll<i>o</i></p>', { sc: 'p', so: 0 }, [ 'he', 'll' ] ],
			'b1': [ '<p>he.ll<i>o</i></p>', { sc: 'p', so: 1 }, [ 'he', 'll' ] ],
			'b2': [ '<p>he.ll<i>o</i></p>', { sc: 'p', so: 2 }, [ 'he', 'll' ] ],
			'b3': [ '<p>he.ll<i>o</i></p>', { sc: 'p', so: 3 }, [] ],

			'c0': [ '<p>he<i>ll</i>o.i<p>', { sc: 'p', so: 0 }, [ 'he' ] ],
			'c1': [ '<p>he<i>ll</i>o.i<p>', { sc: 'p', so: 1 }, [ 'he' ] ],
			'c2': [ '<p>he<i>ll</i>o.i<p>', { sc: 'p', so: 2 }, [ 'o', 'i' ] ],
			'c3': [ '<p>he<i>ll</i>o.i<p>', { sc: 'p', so: 3 }, [ 'o', 'i' ] ],
			'c4': [ '<p>he<i>ll</i>o.i<p>', { sc: 'p', so: 4 }, [ 'o', 'i' ] ],

			'd0': [ '<p><i></i>me.to</p>', { sc: 'p', so: 0 }, [] ],
			'd1': [ '<p><i></i>me.to</p>', { sc: 'p', so: 1 }, [ 'me', 'to' ] ],
			'd2': [ '<p><i></i>me.to</p>', { sc: 'p', so: 2 }, [ 'me', 'to' ] ],
			'd3': [ '<p><i></i>me.to</p>', { sc: 'p', so: 3 }, [ 'me', 'to' ] ],

			'e0': [ '<p><i></i><i></i></p>', { sc: 'p', so: 0 }, [] ],
			'e1': [ '<p><i></i><i></i></p>', { sc: 'p', so: 1 }, [] ],
			'e2': [ '<p><i></i><i></i></p>', { sc: 'p', so: 2 }, [] ],

			'#a0': [ '<p>he.llo</p>', { sc: '#he', so: 0 }, [ 'he', 'llo' ] ],
			'#a1': [ '<p>he.llo</p>', { sc: '#he', so: 1 }, [ 'he', 'llo' ] ],
			'#a2': [ '<p>he.llo</p>', { sc: '#llo', so: 1 }, [ 'he', 'llo' ] ],

			'#b0': [ '<p>he.ll<i>o</i></p>', { sc: '#he', so: 0 }, [ 'he', 'll' ] ],
			'#b1': [ '<p>he.ll<i>o</i></p>', { sc: '#ll', so: 0 }, [ 'he', 'll' ] ],
			'#b2': [ '<p>he.ll<i>o</i></p>', { sc: '#ll', so: 1 }, [ 'he', 'll' ] ],
			'#b3': [ '<p>he.ll<i>o</i></p>', { sc: '#o', so: 0 }, [ 'o' ] ],

			'#c0': [ '<p>he<i>ll</i>o.i<p>', { sc: '#he', so: 0 }, [ 'he' ] ],
			'#c1': [ '<p>he<i>ll</i>o.i<p>', { sc: '#he', so: 1 }, [ 'he' ] ],
			'#c2': [ '<p>he<i>ll</i>o.i<p>', { sc: '#ll', so: 0 }, [ 'll' ] ],
			'#c3': [ '<p>he<i>ll</i>o.i<p>', { sc: '#o', so: 1 }, [ 'o', 'i' ] ],
			'#c4': [ '<p>he<i>ll</i>o.i<p>', { sc: '#i', so: 0 }, [ 'o', 'i' ] ],

			'#d0': [ '<p><i></i>me.to</p>', { sc: '#me', so: 0 }, [ 'me', 'to' ] ],
			'#d1': [ '<p><i></i>me.to</p>', { sc: '#me', so: 1 }, [ 'me', 'to' ] ],
			'#d2': [ '<p><i></i>me.to</p>', { sc: '#to', so: 0 }, [ 'me', 'to' ] ],
			'#d3': [ '<p><i></i>me.to</p>', { sc: '#to', so: 1 }, [ 'me', 'to' ] ]
		},

		getTextAndRange: {
			'collapsed in text ab offset 0': [ 'ab', { sc: '#ab', so: 0 }, 'ab', 0 ],
			'collapsed in text ab offset 1': [ 'ab', { sc: '#ab', so: 1 }, 'ab', 1 ],
			'collapsed in text ab offset 2': [ 'ab', { sc: '#ab', so: 2 }, 'ab', 2 ],

			'collapsed in text c offset 1': [ 'c.de', { sc: '#c', so: 1 }, 'cde', 1 ],
			'collapsed in text de offset 0': [ 'c.de', { sc: '#de', so: 0 }, 'cde', 1 ],
			'collapsed in text de offset 2': [ 'c.de', { sc: '#de', so: 2 }, 'cde', 3 ],

			'collapsed in text h offset 0': [ 'f.g.h', { sc: '#h', so: 0 }, 'fgh', 2 ],
			'collapsed in text h offset 1': [ 'f.g.h', { sc: '#h', so: 1 }, 'fgh', 3 ],

			'collapsed in text j offset 1': [ 'i.j<i>k</i>l.m', { sc: '#j', so: 1 }, 'ij', 2 ],
			'collapsed in text k offset 0': [ 'i.j<i>k</i>l.m', { sc: '#k', so: 0 }, 'k', 0 ],
			'collapsed in text l offset 0': [ 'i.j<i>k</i>l.m', { sc: '#l', so: 0 }, 'lm', 0 ],
			'collapsed in text m offset 1': [ 'i.j<i>k</i>l.m', { sc: '#m', so: 1 }, 'lm', 2 ],

			'single paragraph index 0': [ '<p>{}Hello</p>', { sc: '#Hello', so: 0 }, 'Hello', 0 ],
			'single paragraph index 3': [ '<p>Hel{}lo</p>', { sc: '#Hello', so: 3 }, 'Hello', 3 ],
			'single paragraph index 5': [ '<p>Hello{}</p>', { sc: '#Hello', so: 5 }, 'Hello', 5 ],
			'sophisticated': [ '<p><strong>Foo</strong>Hell{}o<br />You</p>', { sc: '#Hello', so: 4 }, 'Hello', 4 ],

			'collapsed in text bc offset 1 #1': [ '<p>a.bc</p>', { sc: '#bc', so: 1 }, 'abc', 2 ],
			'collapsed in text bc offset 1 #2': [ '<p><i>foo</i>a.bc</p>', { sc: '#bc', so: 1 }, 'abc', 2 ],
			'collapsed in text bs offset 1 #3': [ '<p><i>fo.o</i>a.bc</p>', { sc: '#bc', so: 1 }, 'abc', 2 ],


			'collapsed in element a root offset 0': [ 'a', { sc: 'root', so: 0 }, 'a', 0 ],
			'collapsed in element a root offset 1': [ 'a', { sc: 'root', so: 1 }, 'a', 1 ],

			'collapsed in element bcde offset 0': [ 'b.cd.e', { sc: 'root', so: 0 }, 'bcde', 0 ],
			'collapsed in element bcde offset 1': [ 'b.cd.e', { sc: 'root', so: 1 }, 'bcde', 1 ],
			'collapsed in element bcde offset 2': [ 'b.cd.e', { sc: 'root', so: 2 }, 'bcde', 3 ],
			'collapsed in element bcde offset 3': [ 'b.cd.e', { sc: 'root', so: 3 }, 'bcde', 4 ],

			'collapsed in element fghijkl offset 0': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 0 }, 'fg', 0 ],
			'collapsed in element fghijkl offset 1': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 1 }, 'fg', 1 ],
			'collapsed in element fghijkl offset 2': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 2 }, 'fg', 2 ],
			'collapsed in element fghijkl offset 3': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 3 }, 'ijk', 0 ],
			'collapsed in element fghijkl offset 4': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 4 }, 'ijk', 2 ],
			'collapsed in element fghijkl offset 5': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 5 }, 'ijk', 3 ],
			'collapsed in element fghijkl offset 6': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 6 }, '', 0 ],

			'collapsed in element pqrs offset 0': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 0 }, 'pqrs',0 ],
			'collapsed in element pqrs offset 1': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 1 }, 'pqrs', 2 ],
			'collapsed in element pqrs offset 2': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 2 }, 'pqrs', 4 ],

			'collapsed in element tu offset 1': [ '<i>t</i><i>u</i>', { sc: 'root', so: 1 }, '', 0 ],
			'collapsed in element tu offset 2': [ '<i>t</i><i>u</i>', { sc: 'root', so: 2 }, '',0 ],

			'collapsed in element wxyz offset 0': [ '<i>w</i>xy.z', { sc: 'root', so: 0 }, '', 0 ],
			'collapsed in element wxyz offset 1': [ '<i>w</i>xy.z', { sc: 'root', so: 1 }, 'xyz', 0 ],
			'collapsed in element wxyz offset 2': [ '<i>w</i>xy.z', { sc: 'root', so: 2 }, 'xyz', 2 ],
			'collapsed in element wxyz offset 3': [ '<i>w</i>xy.z', { sc: 'root', so: 3 }, 'xyz', 3 ]
		},

		getRangeInText: {
			'two text nodes - range at first': [ '<p>foo.bar</p>', { sc: '#foo', so: 2, ec: '#foo', eo: 2 }, 1, 3, 'foo', { sc: '#foo', so: 1, ec: '#foo', eo: 3 } ],
			'two text nodes - range at second': [ '<p>foo.bar</p>', { sc: '#foo', so: 0, ec: '#foo', eo: 0 }, 3, 5, 'foo.bar', { sc: '#foo', so: 3, ec: '#bar', eo: 2 } ],
			'two text nodes - range at both': [ '<p>foo.bar</p>', { sc: '#foo', so: 2, ec: '#foo', eo: 2 }, 1, 5, 'foo.bar', { sc: '#foo', so: 1, ec: '#bar', eo: 2 } ],
			'begin to middle': [ '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 0 }, 0, 1, '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 1 } ],
			'middle to middle': [ '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 0 }, 2, 3, '<p>Hello</p>', { sc: '#Hello', so: 2, ec: '#Hello', eo: 3 } ],
			'middle to end': [ '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 0 }, 3, 5, '<p>Hello</p>', { sc: '#Hello', so: 3, ec: '#Hello', eo: 5 } ],
			'begin to end': [ '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 0 }, 0, 5, '<p>Hello</p>', { sc: '#Hello', so: 0, ec: '#Hello', eo: 5 } ]

		}
	} );

	bender.test( tcs );
} )();
