/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		html2 = document.getElementById( 'playground2' ).innerHTML;

	var tests = {
		setUp: function() {
			document.getElementById( 'playground2' ).innerHTML = html2;
		},

		test_shrink_text: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartBefore( doc.getById( '_ShrinkB1' ) );
			range.setEndAt( doc.getById( '_ShrinkB1' ).getNext(), CKEDITOR.POSITION_AFTER_START );
			// <p>Test shrink [<b><i>text</i></b>].</p>

			range.shrink( CKEDITOR.SHRINK_TEXT );

			// <p>Test shrink <b><i>[text]</i></b>.</p>
			assert.areSame( doc.getById( '_ShrinkI1' ).$, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( doc.getById( '_ShrinkI1' ).$, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_shrink_text2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartBefore( doc.getById( '_ShrinkB2' ) );
			range.setEnd( doc.getById( '_ShrinkI2' ).getFirst(), 2 );

			// <p>Test [<b>shrink <i>te]xt</i></b>.</p>
			range.shrink( CKEDITOR.SHRINK_TEXT );

			// <p>Test <b>[shrink <i>te]xt</i></b>.</p>
			assert.areSame( doc.getById( '_ShrinkB2' ).$, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( doc.getById( '_ShrinkI2' ).getFirst().$, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text3: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_L1' ), CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( doc.getById( '_L1' ), CKEDITOR.POSITION_AFTER_END );
			// <p id="_P1">some text and [<a href="#">a link</a>]</p>

			range.shrink();

			// <p id="_P1">some text and <a href="#">[a link]</a></p>
			assert.areSame( doc.getById( '_L1' ).$, range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).$, range.endContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( 1, range.endOffset );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text4: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_B2' ), CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( doc.getById( '_L1' ), CKEDITOR.POSITION_AFTER_END );
			// <p id="_P1">some text and [<b><a href="#">a link</a>]</b></p>

			range.shrink();

			// <p id="_P1">some text and <a href="#">[a link]</a></p>
			assert.areSame( doc.getById( '_L1' ).$, range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).$, range.endContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( 1, range.endOffset );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text5: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_I2' ), CKEDITOR.POSITION_BEFORE_END );
			range.setEndAt( doc.getById( '_P1' ), CKEDITOR.POSITION_AFTER_END );
			// <p id="_P1">some text <i>and[</i><b><a href="#">a link</a></b></p>]

			range.shrink();

			// <p id="_P1">some text and <a href="#">[a link]</a></p>
			assert.areSame( doc.getById( '_L1' ).$, range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).$, range.endContainer.$ );
			assert.areSame( 0, range.startOffset );
			assert.areSame( 1, range.endOffset );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text6: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_L1' ).getFirst(), 2 );
			range.setEndAt( doc.getById( '_B2' ), CKEDITOR.POSITION_AFTER_END );
			// <p id="_P1">some text <i>and</i><b><a href="#">a ^link</a></b>]</p>

			range.shrink();

			// <p id="_P1">some text and <a href="#">a [link]</a></p>
			assert.areSame( doc.getById( '_L1' ).getFirst().$,
							range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).$, range.endContainer.$ );
			assert.areSame( 2, range.startOffset );
			assert.areSame( 1, range.endOffset );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text7: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_L1' ).getFirst(), 2 );
			range.setEnd( doc.getById( '_L1' ).getFirst(), 6 );
			// <p id="_P1">some text <i>and</i><b><a href="#">a [link]</a></b>]</p>

			range.shrink();

			// <p id="_P1">some text and <a href="#">a [link]</a></p>
			assert.areSame( doc.getById( '_L1' ).getFirst().$,
							range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).$, range.endContainer.$ );
			assert.areSame( 2, range.startOffset );
			assert.areSame( 1, range.endOffset );
		},

		// https://dev.ckeditor.com/ticket/4513
		test_shrink_text8: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_L1' ).getFirst(), 2 );
			range.setEnd( doc.getById( '_L1' ).getFirst(), 4 );
			// <p id="_P1">some text <i>and</i><b><a href="#">a [li]nk</a></b>]</p>

			var retval = range.shrink();

			// <p id="_P1">some text and <a href="#">a [li]nk</a></p>
			assert.isFalse( retval );
			assert.areSame( doc.getById( '_L1' ).getFirst().$,
							range.startContainer.$ );
			assert.areSame( doc.getById( '_L1' ).getFirst().$,
							range.endContainer.$ );
			assert.areSame( 2, range.startOffset );
			assert.areSame( 4, range.endOffset );
		},

		// Test shrink to an element range.
		test_shrink_element: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartBefore( doc.getById( '_ShrinkB3' ) );
			range.setEndAt( doc.getById( '_ShrinkB3' ).getNext(), CKEDITOR.POSITION_AFTER_START );
			// <p >Test shrink [<b><i><img /></i></b>]element.</p>

			range.shrink( CKEDITOR.SHRINK_ELEMENT );

			// <p >Test shrink <b><i>[<img />]</i></b>element.</p>
			assert.areSame( doc.getById( '_ShrinkI3' ).$, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( doc.getById( '_ShrinkI3' ).$, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// Test shrink to an element range failed.
		test_shrink_element2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_ShrinkB4' ).getFirst(), 2 );
			range.setEnd( doc.getById( '_ShrinkI4' ).getNext(), 2 );
			// <p> Test <b>sh[rink <i><img /></i>el]ement</b>.</p>

			range.shrink( CKEDITOR.SHRINK_ELEMENT );

			// <p> Test <b>sh[rink <i><img /></i>el]ement</b>.</p>
			assert.areSame( doc.getById( '_ShrinkB4' ).getFirst().$, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 2, range.startOffset, 'range.startOffset' );
			assert.areSame( doc.getById( '_ShrinkI4' ).getNext().$, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		'test shrink does stop on block boundary end - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>para1[</p><p>para2]</p>',
				result = '<p>para1</p><p>[para2]</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( result, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does stop on block boundary start - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>[para1</p><p>]para2</p>',
				result = '<p>[para1]</p><p>para2</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( result, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does stop on block boundary end - SHRINK_ELEMENT, no shrink on block boundary': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>para1[</p><p>para2]</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true, false );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does stop on block boundary start - SHRINK_ELEMENT, no shrink on block boundary': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>[para1</p><p>]para2</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true, false );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does not stop on inline boundary end - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p><b>text1[</b><i>te]xt2</i></p>',
				result = '<p><b>text1</b><i>[te]xt2</i></p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( result, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does not stop on inline boundary start - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p><b>te[xt1</b><i>]text2</i></p>',
				result = '<p><b>te[xt1]</b><i>text2</i></p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( result, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink does stop on text - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p><b>text1[</b>x<i>]text2</i></p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable block - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '[<p contenteditable="false">x</p>]';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable block with block contents - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '[<div contenteditable="false"><p>x</p></div>]';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable inline element - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>foo[<i contenteditable="false">x</i>]bar</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable inline element with contents - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>foo[<i contenteditable="false"><b>x</b></i>]bar</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable inline element but get inside editable element - SHRINK_ELEMENT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>foo[<b><i contenteditable="false">x</i></b>]bar</p>',
				output = '<p>foo<b>[<i contenteditable="false">x</i>]</b>bar</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
			assert.areSame( output, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable block - SHRINK_TEXT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '[<p contenteditable="false">x</p>]';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_TEXT );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable block with block contents - SHRINK_TEXT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '[<div contenteditable="false"><p>x</p></div>]';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_TEXT );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable inline element - SHRINK_TEXT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>foo[<i contenteditable="false">x</i>]bar</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_TEXT );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test shrink should stop on a non-editable inline element with contents - SHRINK_TEXT': function() {
			var ct = doc.getById( 'editable_playground' ),
				source = '<p>foo[<i contenteditable="false"><b>x</b></i>]bar</p>';

			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.shrink( CKEDITOR.SHRINK_TEXT );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		// (https://dev.ckeditor.com/ticket/17010)
		'test shrink with skipBogus param - SHRINK_TEXT': function() {
			// Test does not make sense in the environment, which does not use <br> as bogus.
			if ( !CKEDITOR.env.needsBrFiller ) {
				assert.ignore();
			}

			var ct = doc.getById( 'editable_playground' ),
				source = CKEDITOR.document.getById( 'bogus_table' ).getValue(),
				range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];

			range.shrink( CKEDITOR.SHRINK_TEXT, false, { skipBogus: true } );
			assert.areSame( 'Cell 1.1', range.cloneContents().getHtml() );
		},

		// (https://dev.ckeditor.com/ticket/17010)
		'test shrink with skipBogus param - SHRINK_ELEMENT': function() {
			// Test does not make sense in the environment, which does not use <br> as bogus.
			if ( !CKEDITOR.env.needsBrFiller ) {
				assert.ignore();
			}

			var ct = doc.getById( 'editable_playground' ),
				source = CKEDITOR.document.getById( 'bogus_table' ).getValue(),
				range = bender.tools.setHtmlWithRange( ct, source )[ 0 ],
				cell = ct.findOne( 'td' );

			range.shrink( CKEDITOR.SHRINK_ELEMENT, false, { skipBogus: true } );
			assert.areSame( cell.getOuterHtml(), range.cloneContents().getHtml() );
		}
	};

	bender.test( tests );
} )();
