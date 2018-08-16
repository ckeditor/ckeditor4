/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document,
		html1 = document.getElementById( 'playground' ).innerHTML;

	var tests = {
		setUp: function() {
			document.getElementById( 'playground' ).innerHTML = html1;
		},

		test_deleteContents_W3C_1: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 1

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_Para' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_Para' ), 2 );

			range.deleteContents();

			assert.areSame( 't text.', getInnerHtml( '_Para' ), 'HTML after deletion' );

			assert.areSame( document.getElementById( '_Para' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_W3C_2: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 2

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_B' ).getNext(), 1 );

			range.deleteContents();

			assert.areSame( 'this is <b id="_b">s</b>text.', getInnerHtml( '_Para' ) );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 2, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_W3C_3: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 3

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getPrevious(), 1 );
			range.setEnd( doc.getById( '_B' ).getFirst(), 1 );

			range.deleteContents();

			assert.areSame( 't<b id="_b">ome</b> text.', getInnerHtml( '_Para' ) );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_W3C_4: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 4

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ).getFirst(), 1 );
			range.setEnd( doc.getById( 'playground' ).getLast().getFirst(), 1 );

			range.deleteContents();

			assert.areSame( '<h1 id="_h1">f</h1><p>nother paragraph.</p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_Other: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ), 0 );
			range.setEnd( doc.getById( 'playground' ).getLast(), 1 );

			range.deleteContents();

			assert.areSame( '<h1 id="_h1"></h1><p></p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_Other_2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( 'playground' ), 0 );
			range.setEnd( doc.getById( 'playground' ), 2 );

			range.deleteContents();

			assert.areSame( '<p>another paragraph.</p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_Other_3: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( doc.getById( '_B' ) );

			range.deleteContents();

			assert.areSame( '', getInnerHtml( '_B' ) );

			assert.areSame( document.getElementById( '_B' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_deleteContents_Other_4: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( doc.getById( '_Para' ) );

			range.deleteContents();

			assert.areSame( '', getInnerHtml( '_Para' ) );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		'test deleteContents - mergeThen': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>foo</b>xxx<b>bar</b></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getFirst().getLast().getFirst(), 2 ); // ba}r

			range.deleteContents( true );

			assert.isInnerHtmlMatching( '<p><b>f[]r</b></p>', bender.tools.range.getWithHtml( root, range ) );
		},

		'test deleteContents - mergeThen (nothing to merge)': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>foo</b>xxx<u>bar</u></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getFirst().getLast().getFirst(), 2 ); // ba}r

			range.deleteContents( true );

			assert.isInnerHtmlMatching( '<p><b>f</b>[]<u>r</u></p>', bender.tools.range.getWithHtml( root, range ) );
		},

		'test deleteContents - empty containers': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'x<h1></h1><p>foo</p><h2></h2>y' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]</h2>

			range.deleteContents();

			assert.isInnerHtmlMatching( 'x<h1></h1>[]<h2></h2>y', bender.tools.range.getWithHtml( root, range ) );
		},

		'test deleteContents - empty container, non-empty container': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<h1></h1><h2><br /></h2>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]<br /></h2>

			range.deleteContents();

			assert.isInnerHtmlMatching( '<h1></h1>[]<h2><br /></h2>', bender.tools.range.getWithHtml( root, range ) );
		}
	};

	bender.test( tests );
} )();
