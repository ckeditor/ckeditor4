/* bender-tags: editor */

'use strict';

function parse( html ) {
	return CKEDITOR.htmlParser.fragment.fromHtml( html ).children[ 0 ];
}

function parseFrag( html ) {
	return CKEDITOR.htmlParser.fragment.fromHtml( html );
}

function write( el ) {
	var writer = new CKEDITOR.htmlParser.basicWriter();
	el.writeHtml( writer );
	return writer.getHtml();
}

bender.test( {
	'test replaceWithChildren': function() {
		var el = parse( '<p>A<i>X<b>Y</b>Z</i>B</p>' );

		el.children[ 1 ].replaceWithChildren();

		assert.areEqual( '<p>AX<b>Y</b>ZB</p>', write( el ) );
	},

	'test getFirst': function() {
		var el = parse( '<p><b foo="1">A<u foo="2">C</u></b><i>B</i></p>' ),
			na = el.children[ 0 ], // b[foo=1]
			nb = el.children[ 1 ], // i
			naa = na.children[ 0 ], // A
			nab = na.children[ 1 ]; // u[foo=2]

		assert.areSame( na, el.getFirst(), 'el.getFirst' );
		assert.areSame( nb, el.getFirst( 'i' ), 'el.getFirst i' );
		assert.areSame( nb, el.getFirst( { i: 1, x: 1 } ), 'el.getFirst i,x' );
		assert.areSame( nab, na.getFirst( foo2 ), 'na.getFirst foo2' );
		assert.areSame( naa, na.getFirst(), 'na.getFirst' );
		assert.areSame( nab, na.getFirst( 'u' ), 'na.getFirst u' );

		assert.isNull( el.getFirst( 'x' ), 'el.getFirst x' );
		assert.isNull( el.getFirst( none ), 'el.getFirst none' );

		function foo2( el ) {
			return el.type == CKEDITOR.NODE_ELEMENT && el.attributes.foo == '2';
		}

		function none() {
			return false;
		}
	},

	'test getHtml': function() {
		var el = parse( '<p><b foo="1">A<u foo="2">C</u></b><i>B</i></p>' );

		assert.areSame( '<b foo="1">A<u foo="2">C</u></b><i>B</i>', el.getHtml() );
	},

	'test getOuterHtml': function() {
		var el = parse( '<p foo="1"><b foo="1">A<u foo="2">C</u></b><i>B</i></p>' );

		assert.areSame( '<p foo="1"><b foo="1">A<u foo="2">C</u></b><i>B</i></p>', el.getOuterHtml() );
	},

	'test clone': function() {
		var frag = parseFrag( '<p foo="1" bar="2">A</p>' ),
			el = frag.children[ 0 ],
			clone = el.clone();

		assert.areSame( el.name, clone.name );
		assert.areSame( 0, clone.children.length );
		assert.isFalse( !!clone.parent );
		assert.isTrue( CKEDITOR.tools.objectCompare( el.attributes, clone.attributes ) );
	},

	'test split': function() {
		var frag = parseFrag( '<p foo="1"><b>A</b><i>B</i></p>' ),
			elP = frag.children[ 0 ],
			elPChildren = elP.children;

		var newElP = elP.split( 1 ); // Between <b> and <i>.

		assert.areSame( 2, frag.children.length, 'children.length' );
		assert.areSame( elP, frag.children[ 0 ], 'frag.children[ 0 ]' );
		assert.areSame( newElP, frag.children[ 1 ], 'frag.children[ 1 ]' );
		assert.areSame( frag, newElP.parent, 'newElP.parent' );
		assert.areSame( elP, newElP.previous, 'newElP.previous' );
		assert.areSame( newElP, elP.next, 'elP.next' );
		assert.isNull( elP.children[ 0 ].next, 'elP.children[ 0 ].next' );
		assert.isNull( newElP.children[ 0 ].previous, 'newElP.children[ 0 ].previous' );
		assert.areSame( newElP, newElP.children[ 0 ].parent, 'newElP.children[ 0 ].parent' );
		assert.areSame( 1, elP.children.length, 'elP.children.length' );
		assert.areSame( elPChildren, elP.children, 'elP.children was modified, not overwritten' );

		assert.areSame( '<p foo="1"><b>A</b></p><p foo="1"><i>B</i></p>', write( frag ) );
	},

	'test split at the beginning': function() {
		var frag = parseFrag( '<p foo="1"><b>A</b><i>B</i></p>' ),
			elP = frag.children[ 0 ],
			elPChildren = elP.children;

		var newElP = elP.split( 0 ); // Before <b>.

		assert.areSame( 2, frag.children.length, 'children.length' );
		assert.areSame( elP, frag.children[ 0 ], 'frag.children[ 0 ]' );
		assert.areSame( newElP, frag.children[ 1 ], 'frag.children[ 1 ]' );
		assert.areSame( frag, newElP.parent, 'newElP.parent' );
		assert.areSame( elP, newElP.previous, 'newElP.previous' );
		assert.areSame( newElP, elP.next, 'elP.next' );
		assert.isNull( newElP.children[ 0 ].previous, 'newElP.children[ 0 ].previous' );
		assert.areSame( newElP, newElP.children[ 0 ].parent, 'newElP.children[ 0 ].parent' );
		assert.areSame( 0, elP.children.length, 'elP.children.length' );
		assert.areSame( elPChildren, elP.children, 'elP.children was modified, not overwritten' );

		assert.areSame( '<p foo="1"></p><p foo="1"><b>A</b><i>B</i></p>', write( frag ) );
	},

	'test split at the end': function() {
		var frag = parseFrag( '<p foo="1"><b>A</b><i>B</i></p>' ),
			elP = frag.children[ 0 ],
			elPChildren = elP.children;

		var newElP = elP.split( 2 ); // After <i>.

		assert.areSame( 2, frag.children.length, 'children.length' );
		assert.areSame( elP, frag.children[ 0 ], 'frag.children[ 0 ]' );
		assert.areSame( newElP, frag.children[ 1 ], 'frag.children[ 1 ]' );
		assert.areSame( frag, newElP.parent, 'newElP.parent' );
		assert.areSame( elP, newElP.previous, 'newElP.previous' );
		assert.areSame( newElP, elP.next, 'elP.next' );
		assert.isNull( elP.children[ 1 ].next, 'elP.children[ 1 ].next' );
		assert.areSame( 2, elP.children.length, 'elP.children.length' );
		assert.areSame( elPChildren, elP.children, 'elP.children was modified, not overwritten' );

		assert.areSame( '<p foo="1"><b>A</b><i>B</i></p><p foo="1"></p>', write( frag ) );
	},

	'test addClass': function() {
		var el = parse( '<p>a</p>' );

		assert.areSame( '<p>a</p>', el.getOuterHtml() );

		el.addClass( 'Foo' );
		assert.areSame( '<p class="Foo">a</p>', el.getOuterHtml() );

		el.addClass( 'Foo' );
		assert.areSame( '<p class="Foo">a</p>', el.getOuterHtml(), 'Nothing added' );

		el.addClass( 'foo' );
		assert.areSame( '<p class="Foo foo">a</p>', el.getOuterHtml() );

		el = parse( '<p class="foo \nbar">a</p>' );

		assert.areSame( '<p class="foo \nbar">a</p>', el.getOuterHtml() );

		el.addClass( 'bar' );
		assert.areSame( '<p class="foo \nbar">a</p>', el.getOuterHtml(), 'Nothing added' );

		el.addClass( 'pong' );
		assert.areSame( '<p class="foo \nbar pong">a</p>', el.getOuterHtml() );
	},


	'test removeClass': function() {
		var el = parse( '<p class="Foo foo  bar\nb-om">a</p>' );

		assert.areSame( '<p class="Foo foo  bar\nb-om">a</p>', el.getOuterHtml() );

		el.removeClass( 'Foo' );
		assert.areSame( '<p class="foo  bar\nb-om">a</p>', el.getOuterHtml() );

		el.removeClass( 'bar' );
		assert.areSame( '<p class="foo b-om">a</p>', el.getOuterHtml() );

		el.removeClass( 'om' );
		assert.areSame( '<p class="foo b-om">a</p>', el.getOuterHtml(), 'did nothing' );

		el.removeClass( 'b-om' );
		assert.areSame( '<p class="foo">a</p>', el.getOuterHtml() );

		el.removeClass( 'foo' );
		assert.areSame( '<p>a</p>', el.getOuterHtml() );

		el.removeClass( 'Foo' );
		assert.areSame( '<p>a</p>', el.getOuterHtml(), 'no error' );
	},

	'test hasClass': function() {
		var el = parse( '<p class="Foo foo  bar\nb-om\t">a</p>' );

		assert.isTrue( el.hasClass( 'Foo' ), 'Foo' );
		assert.isTrue( el.hasClass( 'foo' ), 'foo' );
		assert.isTrue( el.hasClass( 'bar' ), 'bar' );
		assert.isTrue( el.hasClass( 'b-om' ), 'b-om' );

		assert.isFalse( el.hasClass( 'x' ), 'x' );
		assert.isFalse( el.hasClass( 'BAR' ), 'BAR' );
		assert.isFalse( el.hasClass( 'om' ), 'om' );

		el = parse( '<p>b</p>' );
		assert.isFalse( el.hasClass( 'foo' ), 'foo' );
	},

	'test getFilterContext - new': function() {
		var el = new CKEDITOR.htmlParser.element( 'p' );

		var ctx = el.getFilterContext( undefined );

		assert.isTypeOf( 'object', ctx );
		assert.isFalse( ctx.nonEditable, 'nonEditable' );
	},

	'test getFilterContext - no changes': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<p>foo</p>' ).children[ 0 ];

		var ctxOld = {},
			ctx = el.getFilterContext( ctxOld );

		assert.areSame( ctx, ctxOld, 'ctx was not modified' );
	},

	'test getFilterContext - non-editable': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<p contenteditable="false">foo</p>' ).children[ 0 ];

		var ctxOld = {},
			ctx = el.getFilterContext( ctxOld );

		assert.isTypeOf( 'object', ctx );
		assert.isTrue( ctx.nonEditable );
		assert.areNotSame( ctx, ctxOld, 'ctx was cloned' );
	},

	'test getFilterContext - no changes - non empty context': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<p>foo</p>' ).children[ 0 ];

		var ctxOld = {
				nonEditable: true
			},
			ctx = el.getFilterContext( ctxOld );

		assert.areSame( ctx, ctxOld, 'ctx was not modified' );
		assert.isTrue( ctx.nonEditable, 'nonEditable' );
	},

	// https://dev.ckeditor.com/ticket/11504
	'test getFilterContext - editable body (fullPage)': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<body contenteditable="true">x</body>' ).children[ 0 ];

		var ctx = el.getFilterContext();

		assert.isFalse( ctx.nestedEditable, 'nestedEditable' );
	},

	'test getFilterContext - nested editable': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<p contenteditable="true">x</p>' ).children[ 0 ];

		var ctx = el.getFilterContext( {
			nonEditable: true
		} );

		assert.isTrue( ctx.nestedEditable, 'nestedEditable' );
		// Once it became non-editable it stays so forver.
		// That's because nested editables have to be processed separately.
		assert.isTrue( ctx.nonEditable, 'nonEditable' );
	},

	// https://dev.ckeditor.com/ticket/11698
	'test getFilterContext - element with contenteditable=true': function() {
		var el = new CKEDITOR.htmlParser.fragment.fromHtml( '<p contenteditable="true">x</p>' ).children[ 0 ];

		var ctx = el.getFilterContext();

		assert.isFalse( ctx.nestedEditable, 'nestedEditable' );
	},

	'test setHtml': function() {
		var el = CKEDITOR.htmlParser.fragment.fromHtml( 'X', 'p' );

		el.setHtml( '<b>A</b>B' );
		assert.areSame( '<b>A</b>B', el.getHtml() );
		assert.areSame( 2, el.children.length );
		assert.areSame( el, el.children[ 0 ].parent );
		assert.areSame( el, el.children[ 1 ].parent );

		el.setHtml( '' );
		assert.areSame( '', el.getHtml() );
		assert.areSame( 0, el.children.length );
	}
} );
