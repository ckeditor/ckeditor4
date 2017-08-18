/* bender-tags: editor */

'use strict';

function parse( html ) {
	return CKEDITOR.htmlParser.fragment.fromHtml( html ).children[ 0 ];
}

function write( el ) {
	var writer = new CKEDITOR.htmlParser.basicWriter();
	el.writeHtml( writer );
	return writer.getHtml();
}

bender.test( {
	'test remove': function() {
		var el = parse( '<p>A<b>B</b>C</p>' ),
			n1 = el.children[ 0 ],
			n2 = el.children[ 1 ],
			n3 = el.children[ 2 ];

		n2.remove();
		assert.isNull( n2.parent );
		assert.areEqual( 2, el.children.length );
		assert.areSame( n1, el.children[ 0 ] );
		assert.areSame( n3, el.children[ 1 ] );
		assert.areSame( n3, n1.next );
		assert.areSame( n1, n3.previous );

		n3.remove();
		assert.isNull( n3.parent );
		assert.areEqual( 1, el.children.length );
		assert.areSame( n1, el.children[ 0 ] );
		assert.isTrue( !n1.next );

		n1.remove();
		assert.isNull( n1.parent );
		assert.areEqual( 0, el.children.length );
	},

	'test replaceWith': function() {
		var el = parse( '<p>A<b>B</b>C</p>' ),
			n1 = el.children[ 0 ],
			n2 = el.children[ 1 ],
			n3 = el.children[ 2 ],
			r1 = parse( '<i>X</i>' ),
			r2 = parse( 'Y' ),
			r3 = parse( 'Z' );

		n1.replaceWith( r1 );
		assert.areSame( el, r1.parent );
		assert.isNull( n1.parent );
		assert.areEqual( 3, el.children.length );
		assert.areSame( r1, el.children[ 0 ] );
		assert.areSame( n2, el.children[ 1 ] );
		assert.areSame( n3, el.children[ 2 ] );
		assert.areSame( n2, r1.next );
		assert.isTrue( !r1.previous );
		assert.areSame( r1, n2.previous );

		n2.replaceWith( r2 );
		assert.areSame( el, r2.parent );
		assert.isNull( n2.parent );
		assert.areEqual( 3, el.children.length );
		assert.areSame( r1, el.children[ 0 ] );
		assert.areSame( r2, el.children[ 1 ] );
		assert.areSame( n3, el.children[ 2 ] );
		assert.areSame( n3, r2.next );
		assert.areSame( r1, r2.previous );
		assert.areSame( r2, n3.previous );

		n3.replaceWith( r3 );
		assert.areSame( el, r3.parent );
		assert.isNull( n3.parent );
		assert.areEqual( 3, el.children.length );
		assert.areSame( r1, el.children[ 0 ] );
		assert.areSame( r2, el.children[ 1 ] );
		assert.areSame( r3, el.children[ 2 ] );
		assert.isTrue( !r3.next );
		assert.areSame( r2, r3.previous );
		assert.areSame( r3, r2.next );
	},

	'test insertAfter': function() {
		var el = parse( '<p>A<b>B</b></p>' ),
			n1 = el.children[ 0 ],
			n2 = el.children[ 1 ],
			i1 = parse( '<i>X</i>' ),
			i2 = parse( 'Y' );

		i1.insertAfter( n1 );
		assert.areSame( el, i1.parent );
		assert.areEqual( 3, el.children.length );
		assert.areSame( n1, el.children[ 0 ] );
		assert.areSame( i1, el.children[ 1 ] );
		assert.areSame( n2, el.children[ 2 ] );
		assert.areSame( i1, n1.next );
		assert.areSame( n1, i1.previous );
		assert.areSame( n2, i1.next );

		i2.insertAfter( n2 );
		assert.areSame( el, i2.parent );
		assert.areEqual( 4, el.children.length );
		assert.areSame( n1, el.children[ 0 ] );
		assert.areSame( i1, el.children[ 1 ] );
		assert.areSame( n2, el.children[ 2 ] );
		assert.areSame( i2, el.children[ 3 ] );
		assert.areSame( i2, n2.next );
		assert.areSame( n2, i2.previous );
		assert.isTrue( !i2.next );

		assert.areSame( '<p>A<i>X</i><b>B</b>Y</p>', write( el ) );
	},

	'test insertBefore': function() {
		var el = parse( '<p>A<b>B</b></p>' ),
			n1 = el.children[ 0 ],
			n2 = el.children[ 1 ],
			i1 = parse( '<i>X</i>' ),
			i2 = parse( 'Y' );

		i1.insertBefore( n1 );
		assert.areSame( el, i1.parent );
		assert.areEqual( 3, el.children.length );
		assert.areSame( i1, el.children[ 0 ] );
		assert.areSame( n1, el.children[ 1 ] );
		assert.areSame( n2, el.children[ 2 ] );
		assert.isTrue( !i1.previous );
		assert.areSame( n1, i1.next );
		assert.areSame( i1, n1.previous );

		i2.insertBefore( n2 );
		assert.areSame( el, i2.parent );
		assert.areEqual( 4, el.children.length );
		assert.areSame( i1, el.children[ 0 ] );
		assert.areSame( n1, el.children[ 1 ] );
		assert.areSame( i2, el.children[ 2 ] );
		assert.areSame( n2, el.children[ 3 ] );
		assert.areSame( n1, i2.previous );
		assert.areSame( n2, i2.next );
		assert.areSame( i2, n2.previous );
		assert.areSame( i2, n1.next );

		assert.areSame( '<p><i>X</i>AY<b>B</b></p>', write( el ) );
	},

	'test hasAscendant': function() {
		var el = parse( '<p><b foo="1"><b foo="2"><i>B</i></b></b></p>' ),
			n1 = el.children[ 0 ], // b[foo=1]
			n2 = n1.children[ 0 ], // b[foo=2]
			n3 = n2.children[ 0 ], // i
			n4 = n3.children[ 0 ]; // B

		assert.areSame( CKEDITOR.NODE_TEXT, n4.type );
		assert.areSame( n3, n4.getAscendant( 'i' ),				'n4 - i' );
		assert.areSame( n2, n4.getAscendant( { b: 1, p: 1 } ),		'n4 - b,p' );
		assert.areSame( n2, n4.getAscendant( 'b' ),				'n4 - b' );
		assert.areSame( n1, n4.getAscendant( foo1 ),			'n4 - foo1' );

		assert.isNull( n4.getAscendant( 'x' ),					'n4 - x' );
		assert.isNull( n3.getAscendant( 'i' ),					'n3 - i' );

		function foo1( el ) {
			return el.attributes.foo == '1';
		}
	},

	'test wrapWith': function() {
		var el = parse( '<p>X<b>foo<br />bar</b>Y</p>' );

		var wrapper = new CKEDITOR.htmlParser.element( 'i' );
		assert.areSame( wrapper, el.children[ 1 ].wrapWith( wrapper ) );
		assert.areEqual( '<p>X<i><b>foo<br />bar</b></i>Y</p>', write( el ) );

		el.children[ 0 ].wrapWith( new CKEDITOR.htmlParser.element( 'u' ) );
		assert.areEqual( '<p><u>X</u><i><b>foo<br />bar</b></i>Y</p>', write( el ) );
	},

	'test getIndex': function() {
		var el = parse( '<p>X<b>foo</b>bar<br />Y</p>' );

		assert.areSame( 0, el.children[ 0 ].getIndex() ); // X
		assert.areSame( 1, el.children[ 1 ].getIndex() ); // <b>
		assert.areSame( 2, el.children[ 2 ].getIndex() ); // bar
		assert.areSame( 3, el.children[ 3 ].getIndex() ); // <br />
		assert.areSame( 4, el.children[ 4 ].getIndex() ); // Y
	}
} );
