/* bender-tags: editor,unit,dom,range */

'use strict';

var doc = CKEDITOR.document,
	FCS = CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE,
	FCSLength = FCS.length,

	removeFillingCharSequenceString = CKEDITOR.dom.selection._removeFillingCharSequenceString,
	createFillingCharSequenceNode = CKEDITOR.dom.selection._createFillingCharSequenceNode;

function createPlayground( html ) {
	var playground = doc.createElement( 'div' );
	CKEDITOR.document.getBody().append( playground );

	// Replace dots with elements and then remove all of them leaving
	// split text nodes.
	html = html.replace( /\./g, '<i class="split"></i>' );

	// Replace % with Filling Character Sequence dummy element.
	// Dummy will, in turn, be converted into a real FCSeq text node (#13816).
	html = html.replace( /%/g, '<b class="fcseq"></b>' );

	// Creating empty elements...
	html = html.replace( /\((\w+)\)/g, function( match, $0 ) {
		return '<i class="empty" data-id="' + $0 + '"></i>';
	} );

	playground.setHtml( html );

	// ... and then replacing then with empty text nodes.
	var empty = playground.find( '.empty' ),
		split = playground.find( '.split' ),
		i;

	// ... but IE8 doesn't support custom data on text nodes, so we must ignore these tests.
	if ( empty.count() && CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
		assert.ignore();
	}

	for ( i = 0; i < empty.count(); i++ ) {
		var current = empty.getItem( i ),
			emptyTextNode = new CKEDITOR.dom.text( '' );

		// Setting custom id to have reference for later usage.
		emptyTextNode.setCustomData( 'id', current.getAttribute( 'data-id' ) );
		emptyTextNode.replace( current );
	}

	// Hack to avoid merging text nodes by IE 8.
	// We are leaving references to them, so IE won't merge them.
	findNode( playground, '#weLoveIE8' );

	for ( i = 0; i < split.count(); i++ ) {
		split.getItem( i ).remove();
	}

	// Find the FCSeq dummy element and replace it with a real FCSeq (#13816).
	var fillingCharDummy = playground.findOne( '.fcseq' );

	if ( fillingCharDummy ) {
		var fillingChar = createFillingCharSequenceNode( playground ),
			fillingCharFollowing;

		fillingChar.replace( fillingCharDummy );

		// Merge the following text node with Filling Char Sequence text node, if such exist.
		// Note: Don't merge with empty text nodes because they have a special purpose in tests.
		if ( ( fillingCharFollowing = fillingChar.getNext() ) && fillingCharFollowing.type == CKEDITOR.NODE_TEXT && fillingCharFollowing.getText() ) {
			fillingChar.setText( fillingChar.getText() + fillingCharFollowing.getText() );
			fillingCharFollowing.remove();
		}
	}

	return playground;
}

function addBookmarkTCs( readyTCs, tcs, tcsGroupName ) {
	var tc, tcName;

	for ( tcName in tcs ) {
		tc = tcs[ tcName ];
		if ( !CKEDITOR.tools.isArray( tc ) )
			addBookmarkTCs( readyTCs, tc, tcName );
		else {
			readyTCs[ 'test ' + ( tcsGroupName ? tcsGroupName + ' - ' : '' ) + tcName + ' - createBookmark' ] =
				createBookmarkTC( tc );
		}
	}
}

function createBookmarkTC( tc ) {
	return function() {
		var playground = createPlayground( tc[ 0 ] ),
			range = createRange( playground, tc[ 1 ] );

		var bm = range.createBookmark();

		compareRangeWithPattern( playground, range, tc[ 2 ], 'initial range after creating a bookmark' );

		var range2 = new CKEDITOR.dom.range( playground );
		range2.moveToBookmark( bm );
		compareRangeWithPattern( playground, range2, tc[ 3 ] || tc[ 1 ], 'restored range' );
	};
}

function addBookmark2TCs( readyTCs, tcs, tcsGroupName ) {
	var tc, tcName;

	for ( tcName in tcs ) {
		tc = tcs[ tcName ];
		if ( !CKEDITOR.tools.isArray( tc ) )
			addBookmark2TCs( readyTCs, tc, tcName );
		else {
			readyTCs[ 'test ' + ( tcsGroupName ? tcsGroupName + ' - ' : '' ) + tcName + ' - createBookmark2' ] =
				createBookmark2TC( tc );
			readyTCs[ 'test ' + ( tcsGroupName ? tcsGroupName + ' - ' : '' ) + tcName + ' - createBookmark2, normalized' ] =
				createBookmark2TC( tc, true );
		}
	}
}

function createBookmark2TC( tc, normalize ) {
	return function() {
		var playground = createPlayground( tc[ 0 ] ),
			range = createRange( playground, tc[ 1 ] );

		var bm = range.createBookmark2( normalize );

		if ( normalize ) {
			playground.setHtml( removeFillingCharSequenceString( playground.getHtml() ) );
		}

		var range2 = new CKEDITOR.dom.range( playground );
		range2.moveToBookmark( bm );

		if ( normalize ) {
			compareRangeWithPattern( playground, range2, tc[ 2 ], 'restored range' );
		} else {
			compareRanges( range2, range );
		}
	};
}

function compareRanges( range, expected ) {
	assert.areSame( expected.startContainer, range.startContainer, 'startContainer' );
	assert.areSame( expected.endContainer, range.endContainer, 'endContainer' );
	assert.areSame( expected.startOffset, range.startOffset, 'startOffset' );
	assert.areSame( expected.endOffset, range.endOffset, 'endOffset' );
	assert.areSame( expected.collapsed, range.collapsed, 'collapsed' );
}

function compareRangeWithPattern( playground, range, pattern, msg ) {
	assert.areSame( findNode( playground, pattern.sc ), range.startContainer, msg + ' - startContainer' );
	assert.areSame( pattern.so, range.startOffset, msg + ' - startOffset' );
	if ( pattern.ec ) {
		assert.areSame( findNode( playground, pattern.ec ), range.endContainer, msg + ' - endContainer' );
		assert.areSame( pattern.eo, range.endOffset, msg + ' - endOffset' );
	}
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

	var fcseqQuery = query == '%',
		textQuery = query.indexOf( '#' ) === 0 ? query.slice( 1 ) : false,
		emptyTextQuery = query.match( /^\(\w+\)$/g ),
		range = new CKEDITOR.dom.range( container ),
		node,
		walker;

	if ( emptyTextQuery ) {
		query = query.replace( /^\(|\)$/g, '' );
	}

	range.selectNodeContents( container );
	walker = new CKEDITOR.dom.walker( range );

	while ( ( node = walker.next() ) ) {
		if ( fcseqQuery && node.getText() == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE ) {
			return node;
		} else if ( textQuery && node.type == CKEDITOR.NODE_TEXT && removeFillingCharSequenceString( node.getText() ) == textQuery ) {
			return node;
		} else if ( !textQuery && node.type == CKEDITOR.NODE_ELEMENT && node.is( query ) ) {
			return node;
		} else if ( emptyTextQuery && node.type == CKEDITOR.NODE_TEXT && node.getCustomData( 'id' ) == query ) {
			return node;
		}
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
// 0 - HTML to be tested.
// 1 - Input range - 'sc' means startContainer and it's passed through findNode(), 'so' means startOffset.
//		If 'ec' and 'eo' are not passed range is collapsed to start.
// 2 - Range after creating bookmark (note that range must be moved when bookmark spans are inserted).
// 3 - Output range (the same format as input). If not passed, the input range will be used.
addBookmarkTCs( tcs, {
	'collapsed in text': {
		'ab offset 0': [ 'ab', { sc: '#ab', so: 0 }, { sc: 'root', so: 1 }, { sc: 'root', so: 0 } ],
		'ab offset 1': [ 'ab', { sc: '#ab', so: 1 }, { sc: 'root', so: 2 }, { sc: 'root', so: 1 } ],
		'ab offset 2': [ 'ab', { sc: '#ab', so: 2 }, { sc: 'root', so: 2 }, { sc: 'root', so: 1 } ]
	},

	'collapsed in element': {
		'a root offset 0': [ 'a', { sc: 'root', so: 0 }, { sc: 'root', so: 1 } ],
		'a root offset 1': [ 'a', { sc: 'root', so: 1 }, { sc: 'root', so: 2 } ],

		'bcde offset 0': [ 'b.cd.e', { sc: 'root', so: 0 }, { sc: 'root', so: 1 } ],
		'bcde offset 1': [ 'b.cd.e', { sc: 'root', so: 1 }, { sc: 'root', so: 2 } ],
		'bcde offset 3': [ 'b.cd.e', { sc: 'root', so: 3 }, { sc: 'root', so: 4 } ],

		'tu offset 1': [ '<i>t</i><i>u</i>', { sc: 'root', so: 1 }, { sc: 'root', so: 2 } ],
		'tu offset 2': [ '<i>t</i><i>u</i>', { sc: 'root', so: 2 }, { sc: 'root', so: 3 } ],

		'br offset 0': [ '<br />', { sc: 'root', so: 0 }, { sc: 'root', so: 1 }, { sc: 'root', so: 0 } ]
	},

	'element selection': {
		'a': [ '<i>a</i>', { sc: 'root', so: 0, ec: 'root', eo: 1 }, { sc: 'root', so: 1, ec: 'root', eo: 2 } ],

		'b': [ 'x<i>b</i>y', { sc: 'root', so: 1, ec: 'root', eo: 2 }, { sc: 'root', so: 2, ec: 'root', eo: 3 } ],
		'b 2': [ 'x.y<i>b</i>z', { sc: '#y', so: 1, ec: '#z', eo: 0 }, { sc: 'root', so: 3, ec: 'root', eo: 4 }, { sc: 'root', so: 2, ec: 'root', eo: 3 } ],

		'c': [ '<u><i>c</i></u>', { sc: 'u', so: 0, ec: 'u', eo: 1 }, { sc: 'u', so: 1, ec: 'u', eo: 2 } ],

		'd': [ '<u>x<i>d</i><b>y</b></u>', { sc: '#x', so: 1, ec: 'u', eo: 2 }, { sc: 'u', so: 2, ec: 'u', eo: 3 }, { sc: 'u', so: 1, ec: 'u', eo: 2 } ]
	},

	'text selection': {
		'ab 1': [ '<i>a</i><u>b</u>', { sc: 'i', so: 0, ec: 'u', eo: 1 }, { sc: 'i', so: 1, ec: 'u', eo: 1 } ],
		'ab 2': [ '<i>a</i><u>b</u>', { sc: '#a', so: 1, ec: '#b', eo: 0 }, { sc: 'i', so: 2, ec: 'u', eo: 0 }, { sc: 'i', so: 1, ec: 'u', eo: 0 } ],

		'#10301 1': [ '<p>a.b<i>c</i>d.e</p>', { sc: '#e', so: 0, ec: '#e', eo: 1 }, { sc: 'p', so: 5, ec: 'p', eo: 6 }, { sc: 'p', so: 4, ec: 'p', eo: 5 } ],
		'#10301 2': [ '<p>a.b<i>c</i>d.e</p>', { sc: 'p', so: 4, ec: 'p', eo: 5 }, { sc: 'p', so: 5, ec: 'p', eo: 6 } ]
	}
} );

// TC format:
// 0 - HTML to be tested.
//		* '.' means that text nodes are split at that position,
//		* '(foo)' means an empty text node identified as 'foo'.
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

	'collapsed in empty text nodes': {
		'ab(foo) - range in foo': [ 'ab(foo)', { sc: '(foo)', so: 0 }, { sc: '#ab', so: 2 } ],
		'a<i>b</i>(foo) - range in foo': [ 'a<i>b</i>(foo)', { sc: '(foo)', so: 0 }, { sc: 'root', so: 2 } ],
		'(foo)ab - range in foo': [ '(foo)ab', { sc: '(foo)', so: 0 }, { sc: 'root', so: 0 } ],
		'(foo)ab(bar) - range in foo': [ '(foo)ab(bar)', { sc: '(foo)', so: 0 }, { sc: 'root', so: 0 } ],
		'(foo)ab(bar) - range in bar': [ '(foo)ab(bar)', { sc: '(bar)', so: 0 }, { sc: '#ab', so: 2 } ],
		'<i>a</i>(foo)(bar)<u>b</u> - range in bar': [ '<i>a</i>(foo)(bar)<u>b</u>', { sc: '(bar)', so: 0 }, { sc: 'root', so: 1 } ],
		'(foo)<i>a</i> - range in foo': [ '(foo)<i>a</i>', { sc: '(foo)', so: 0 }, { sc: 'root', so: 0 } ]
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
		'wxyz offset 3': [ '<i>w</i>xy.z', { sc: 'root', so: 3 }, { sc: 'root', so: 2 } ],

		'br offset 0': [ '<br />', { sc: 'root', so: 0 }, { sc: 'root', so: 0 } ],

		// <b>(foo)[<i>d]ef</i></b>
		'abcdef 1': [ '<b>(foo)<i>def</i></b>', { sc: 'b', so: 1, ec: '#def', eo: 1 }, { sc: 'b', so: 0, ec: '#def', eo: 1 } ],
		// <b>(foo)(bar)[<i>d]ef</i></b>
		'abcdef 2': [ '<b>(foo)(bar)<i>def</i></b>', { sc: 'b', so: 2, ec: '#def', eo: 1 }, { sc: 'b', so: 0, ec: '#def', eo: 1 } ],

		'<i>a</i>(foo)<u>b</u>': [ '<i>a</i>(foo)<u>b</u>', { sc: 'root', so: 2 }, { sc: 'root', so: 1 } ]
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
	},

	// #13816
	'filling character sequence': {
		'tc 1': [ '<p>abc</p><p><b>%def</b></p>', { sc: '#abc', so: 1, ec: '#def', eo: FCSLength + 2 }, { sc: '#abc', so: 1, ec: '#def', eo: 2 } ],
		'tc 2': [ '%abc<b>def</b>', { sc: '#abc', so: FCSLength + 1, ec: '#def', eo: 1 }, { sc: '#abc', so: 1, ec: '#def', eo: 1 } ],
		'tc 2b': [ '%<b>def</b>', { sc: 'root', so: 1, ec: '#def', eo: 1 }, { sc: 'root', so: 0, ec: '#def', eo: 1 } ],
		'tc 2c': [ '%<b>def</b>', { sc: '%', so: FCSLength }, { sc: 'root', so: 0 } ],
		'tc 2d': [ '%<b>def</b>', { sc: '%', so: 0 }, { sc: 'root', so: 0 } ],
		'tc 3': [ '<b>a</b>%<b>c</b>d<i>e</i>', { sc: 'root', so: 2, ec: '#e', eo: 1 }, { sc: 'root', so: 1, ec: '#e', eo: 1 } ],
		'tc 4': [ '<b>%<i>abc</i></b>', { sc: 'b', so: 1, ec: 'b', eo: 2 }, { sc: 'b', so: 0, ec: 'b', eo: 1 } ],
		'tc 5': [ '<b>%(foo)abc<i>def</i></b>', { sc: 'b', so: 2, ec: 'b', eo: 4 }, { sc: 'b', so: 0, ec: 'b', eo: 2 } ],
		'tc 5b': [ '<b>%abc<i>def</i></b>', { sc: 'b', so: 1, ec: 'b', eo: 2 }, { sc: 'b', so: 1, ec: 'b', eo: 2 } ],
		'tc 5c': [ '<b>%abc<i>def</i></b>', { sc: 'b', so: 1 }, { sc: 'b', so: 1 } ],
		'tc 5d': [ '<b>%(foo)abc<i>def</i></b>', { sc: 'b', so: 2 }, { sc: 'b', so: 0 } ],
		'tc 5e': [ '<b>%</b>', { sc: 'b', so: 1 }, { sc: 'b', so: 0 } ],
		'tc 5f': [ '<b>%</b>', { sc: 'b', so: 0 }, { sc: 'b', so: 0 } ],
		'tc 5g': [ '<b>%</b>', { sc: 'b', so: 0, ec: 'b', eo: 1 }, { sc: 'b', so: 0, ec: 'b', eo: 0 } ],
		'tc 5h': [ '<b>%</b>', { sc: 'b', so: 1, ec: 'root', eo: 1 }, { sc: 'b', so: 0, ec: 'root', eo: 1 } ],
		'tc 6': [ '<b>%(foo)<i>def</i></b>', { sc: 'b', so: 2, ec: '#def', eo: 1 }, { sc: 'b', so: 0, ec: '#def', eo: 1 } ],
		'tc 6b': [ '<b>%(foo)(bar)<i>def</i></b>', { sc: 'b', so: 2, ec: '#def', eo: 1 }, { sc: 'b', so: 0, ec: '#def', eo: 1 } ],
		'tc 6c': [ '<b>%(foo)(bar)<i>def</i></b>', { sc: '(bar)', so: 0, ec: '#def', eo: 1 }, { sc: 'b', so: 0, ec: '#def', eo: 1 } ],
		// between foo and bar.
		'tc 6d': [ '<b>abc%(foo)(bar)cba<i>def</i></b>', { sc: 'b', so: 3, ec: '#def', eo: 1 }, { sc: '#abccba', so: 3, ec: '#def', eo: 1 } ]
	}
} );

bender.test( tcs );
