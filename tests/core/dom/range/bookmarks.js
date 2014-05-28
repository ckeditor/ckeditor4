/* bender-tags: editor,unit,dom,range */

'use strict';

var doc = CKEDITOR.document;

function createPlayground( html ) {
	var playground = doc.getById( 'playground' );

	// Replace dots with elements and then remove all of them leaving
	// split text nodes.
	html = html.replace( /\./g, '<i class="split"></i>' );
	playground.setHtml( html );

	// Hack to avoid merging text nodes by IE 8.
	// We are leaving references to them, so IE won't merge them.
	findNode( playground, '#weLoveIE8' );

	$( '#playground .split' ).remove();

	return playground;
}

function addBookmark2TCs( readyTCs, tcs, tcsGroupName ) {
	var tc, tcName;

	for ( tcName in tcs ) {
		tc = tcs[ tcName ];
		if ( !CKEDITOR.tools.isArray( tc ) )
			addBookmark2TCs( readyTCs, tc, tcName );
		else {
			readyTCs[ 'test ' + ( tcsGroupName ? tcsGroupName + ' - ' : '' ) + tcName ] =
				createBookmark2TC( tc );
			readyTCs[ 'test ' + ( tcsGroupName ? tcsGroupName + ' - ' : '' ) + tcName + ' - normalized' ] =
				createBookmark2TC( tc, true );
		}
	}
}

function createBookmark2TC( tc, normalize ) {
	return function() {
		var playground = createPlayground( tc[ 0 ] ),
			range = createRange( playground, tc[ 1 ] );

		var bm = range.createBookmark2( normalize );

		if ( normalize )
			playground.setHtml( playground.getHtml() );

		var range2 = new CKEDITOR.dom.range( playground );
		range2.moveToBookmark( bm );

		if ( normalize ) {
			assert.areSame( findNode( playground, tc[ 2 ].sc ), range2.startContainer, 'startContainer' );
			assert.areSame( tc[ 2 ].so, range2.startOffset, 'startOffset' );
			assert.areSame( range.collapsed, range2.collapsed, 'collapsed' );
			if ( !range.collapsed ) {
				assert.areSame( findNode( playground, tc[ 2 ].ec ), range2.endContainer, 'endContainer' );
				assert.areSame( tc[ 2 ].eo, range2.endOffset, 'endOffset' );
			}
		} else {
			assert.areSame( range.startContainer, range2.startContainer, 'startContainer' );
			assert.areSame( range.endContainer, range2.endContainer, 'endContainer' );
			assert.areSame( range.startOffset, range2.startOffset, 'startOffset' );
			assert.areSame( range.endOffset, range2.endOffset, 'endOffset' );
			assert.areSame( range.collapsed, range2.collapsed, 'collapsed' );
		}
	};
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

	var textQuery = query.indexOf( '#' ) == 0 ? query.slice( 1 ) : false,
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

var tcs = {
	'test util createPlayground': function() {
		var playground = createPlayground( 'a.b<i>c.d.e</i>' );

		assert.areSame( 'ab<i>cde</i>', bender.tools.compatHtml( playground.getHtml() ) );
		assert.areSame( 3, playground.getChildCount() );
		assert.areSame( 'd', playground.getChild( 2 ).getChild( 1 ).getText() );
	},

	'test util findNode': function() {
		var container = CKEDITOR.dom.element.createFromHtml( '<p>ab<i>c</i></p>' );

		assert.areSame( container.getFirst(), findNode( container, '#ab' ) );
		assert.areSame( container.getLast(), findNode( container, 'i' ) );
		assert.areSame( 'c', findNode( container, '#c' ).getText() );
		assert.areSame( container, findNode( container, 'root' ) );
	}
};

// TC format:
// 0 - HTML to be tested. Note that text nodes are split in place of '.' characters.
// 1 - Input range - 'sc' means startContainer and it's passed through findNode(), 'so' means startOffset.
//		If 'ec' and 'eo' are not passed range is collapsed to start.
// 2 - Output range (the same format as input).
//
// Each TC is used in two scenarios:
// 		* no normalization case:
//			* create range and create bookmark,
//			* create new range and move it to bookmark,
//			* compare ranges;
//		* normalization case:
//			* create range and create normalized bookmark,
//			* container.setHtml( container.getHtml() ) to merge text nodes,
//			* create range and move it to bookmark,
//			* compare output range with created range.
addBookmark2TCs( tcs, {
	'collapsed in text': {
		'ab offset 0': [ 'ab', { sc: '#ab', so: 0 }, { sc: '#ab', so: 0 } ],
		'ab offset 1': [ 'ab', { sc: '#ab', so: 1 }, { sc: '#ab', so: 1 } ],
		'ab offset 2': [ 'ab', { sc: '#ab', so: 2 }, { sc: '#ab', so: 2 } ],

		'c offset 1': [ 'c.de', { sc: '#c', so: 1 }, { sc: '#cde', so: 1 } ],
		'de offset 0': [ 'c.de', { sc: '#de', so: 0 }, { sc: '#cde', so: 1 } ],
		'de offset 2': [ 'c.de', { sc: '#de', so: 2 }, { sc: '#cde', so: 3 } ],

		'h offset 0': [ 'f.g.h', { sc: '#h', so: 0 }, { sc: '#fgh', so: 2 } ],
		'h offset 1': [ 'f.g.h', { sc: '#h', so: 1 }, { sc: '#fgh', so: 3 } ],

		'j offset 1': [ 'i.j<i>k</i>l.m', { sc: '#j', so: 1 }, { sc: '#ij', so: 2 } ],
		'k offset 0': [ 'i.j<i>k</i>l.m', { sc: '#k', so: 0 }, { sc: '#k', so: 0 } ],
		'l offset 0': [ 'i.j<i>k</i>l.m', { sc: '#l', so: 0 }, { sc: '#lm', so: 0 } ],
		'm offset 1': [ 'i.j<i>k</i>l.m', { sc: '#m', so: 1 }, { sc: '#lm', so: 2 } ]
	},

	'collapsed in element': {
		'a root offset 0': [ 'a', { sc: 'root', so: 0 }, { sc: 'root', so: 0 } ],
		'a root offset 1': [ 'a', { sc: 'root', so: 1 }, { sc: 'root', so: 1 } ],

		'bcde offset 0': [ 'b.cd.e', { sc: 'root', so: 0 }, { sc: 'root', so: 0 } ],
		'bcde offset 1': [ 'b.cd.e', { sc: 'root', so: 1 }, { sc: '#bcde', so: 1 } ],
		'bcde offset 2': [ 'b.cd.e', { sc: 'root', so: 2 }, { sc: '#bcde', so: 3 } ],
		'bcde offset 3': [ 'b.cd.e', { sc: 'root', so: 3 }, { sc: 'root', so: 1 } ],

		'fghijkl offset 2': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 2 }, { sc: 'root', so: 1 } ],
		'fghijkl offset 3': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 3 }, { sc: 'root', so: 2 } ],
		'fghijkl offset 4': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 4 }, { sc: '#ijk', so: 2 } ],
		'fghijkl offset 5': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 5 }, { sc: 'root', so: 3 } ],
		'fghijkl offset 6': [ 'f.g<i>h</i>ij.k<u>l</u>', { sc: 'root', so: 6 }, { sc: 'root', so: 4 } ],

		'pqrs offset 0': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 0 }, { sc: 'i', so: 0 } ],
		'pqrs offset 1': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 1 }, { sc: '#pqrs', so: 2 } ],
		'pqrs offset 2': [ 'm.no<i>pq.rs</i>', { sc: 'i', so: 2 }, { sc: 'i', so: 1 } ],

		'tu offset 1': [ '<i>t</i><i>u</i>', { sc: 'root', so: 1 }, { sc: 'root', so: 1 } ],
		'tu offset 2': [ '<i>t</i><i>u</i>', { sc: 'root', so: 2 }, { sc: 'root', so: 2 } ],

		'wxyz offset 0': [ '<i>w</i>xy.z', { sc: 'root', so: 0 }, { sc: 'root', so: 0 } ],
		'wxyz offset 1': [ '<i>w</i>xy.z', { sc: 'root', so: 1 }, { sc: 'root', so: 1 } ],
		'wxyz offset 2': [ '<i>w</i>xy.z', { sc: 'root', so: 2 }, { sc: '#xyz', so: 2 } ],
		'wxyz offset 3': [ '<i>w</i>xy.z', { sc: 'root', so: 3 }, { sc: 'root', so: 2 } ]
	},

	'element selection': {
		'a': [ '<i>a</i>', { sc: 'root', so: 0, ec: 'root', eo: 1 }, { sc: 'root', so: 0, ec: 'root', eo: 1 } ],

		'b': [ 'x<i>b</i>y', { sc: 'root', so: 1, ec: 'root', eo: 2 }, { sc: 'root', so: 1, ec: 'root', eo: 2 } ],
		'b 2': [ 'x.y<i>b</i>z', { sc: '#y', so: 1, ec: '#z', eo: 0 }, { sc: '#xy', so: 2, ec: '#z', eo: 0 } ],

		'c': [ '<u><i>c</i></u>', { sc: 'u', so: 0, ec: 'u', eo: 1 }, { sc: 'u', so: 0, ec: 'u', eo: 1 } ],

		'd': [ '<u>x<i>d</i><b>y</b></u>', { sc: '#x', so: 1, ec: 'u', eo: 2 }, { sc: '#x', so: 1, ec: 'u', eo: 2 } ]
	},

	'text selection': {
		'ab 1': [ '<i>a</i><u>b</u>', { sc: 'i', so: 0, ec: 'u', eo: 1 }, { sc: 'i', so: 0, ec: 'u', eo: 1 } ],
		'ab 2': [ '<i>a</i><u>b</u>', { sc: '#a', so: 1, ec: '#b', eo: 0 }, { sc: '#a', so: 1, ec: '#b', eo: 0 } ],

		'#10301 1': [ '<p>a.b<i>c</i>d.e</p>', { sc: '#e', so: 0, ec: '#e', eo: 1 }, { sc: '#de', so: 1, ec: '#de', eo: 2 } ],
		'#10301 2': [ '<p>a.b<i>c</i>d.e</p>', { sc: 'p', so: 4, ec: 'p', eo: 5 }, { sc: '#de', so: 1, ec: 'p', eo: 3 } ]
	}
} );

bender.test( tcs );