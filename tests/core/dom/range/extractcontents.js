/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document,
		html1 = document.getElementById( 'playground' ).innerHTML,
		numbers = document.getElementById( 'numbers' ).innerHTML;

	var tests = {
		setUp: function() {
			document.getElementById( 'playground' ).innerHTML = html1;
			document.getElementById( 'numbers' ).innerHTML = numbers;
		},

		test_extractContents_W3C_1: function() {
			// W3C DOM Range Specs - Section 2.7 - Example 1

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_Para' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_Para' ), 2 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b id="_b">some</b>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( 't text.', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_W3C_2: function() {
			// W3C DOM Range Specs - Section 2.7 - Example 2

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_B' ).getNext(), 2 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<b id="_b">ome</b> t', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( 'this is <b id="_b">s</b>ext.', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 2, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_W3C_3: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 3

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getPrevious(), 1 );
			range.setEnd( doc.getById( '_B' ).getFirst(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b id="_b">s</b>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( 't<b id="_b">ome</b> text.', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_W3C_4: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 4

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ).getFirst(), 1 );
			range.setEnd( doc.getById( 'playground' ).getLast().getFirst(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">ckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>a</p>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<h1 id="_h1">f</h1><p>nother paragraph.</p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ), 0 );
			range.setEnd( doc.getById( 'playground' ).getLast(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">fckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>another paragraph.</p>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<h1 id="_h1"></h1><p></p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( 'playground' ), 0 );
			range.setEnd( doc.getById( 'playground' ), 2 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">fckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<p>another paragraph.</p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_3: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_B' ) );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'some', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '', getInnerHtml( '_B' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_B' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_4: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_Para' ) );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'this is <b id="_b">some</b> text.', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_5: function() {
			document.getElementById( 'playground' ).innerHTML = '<p><b><i>test</i></b></p>';

			var range = new CKEDITOR.dom.range( doc );
			range.setStartAfter( new CKEDITOR.dom.element( document.getElementById( 'playground' ).getElementsByTagName( 'i' )[ 0 ] ) );
			range.setEndAfter( new CKEDITOR.dom.element( document.getElementById( 'playground' ).getElementsByTagName( 'b' )[ 0 ] ) );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<b></b>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<p><b><i>test</i></b></p>', getInnerHtml( 'playground' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( 'playground' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_6: function() {
			document.getElementById( 'playground' ).innerHTML = '<p><b><i>test</i></b></p>';

			var range = new CKEDITOR.dom.range( doc );

			range.setStartBefore( new CKEDITOR.dom.element( document.getElementById( 'playground' ).getElementsByTagName( 'b' )[ 0 ] ) );
			range.setEndBefore( new CKEDITOR.dom.element( document.getElementById( 'playground' ).getElementsByTagName( 'i' )[ 0 ] ) );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<b></b>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<p><b><i>test</i></b></p>', getInnerHtml( 'playground' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( 'playground' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		'test extractContents - mergeThen': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>foo</b>xxx<b>bar</b></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getFirst().getLast().getFirst(), 2 ); // ba}r

			var clone = range.extractContents( true );

			assert.isInnerHtmlMatching( '<p><b>f[]r</b></p>', bender.tools.range.getWithHtml( root, range ) );
			assert.isInnerHtmlMatching( '<b>oo</b>xxx<b>ba</b>', clone.getHtml() );
		},

		'test extractContents - mergeThen (nothing to merge)': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>foo</b>xxx<u>bar</u></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getFirst().getLast().getFirst(), 2 ); // ba}r

			var clone = range.extractContents( true );

			assert.isInnerHtmlMatching( '<p><b>f</b>[]<u>r</u></p>', bender.tools.range.getWithHtml( root, range ) );
			assert.isInnerHtmlMatching( '<b>oo</b>xxx<u>ba</u>', clone.getHtml() );
		},

		'test extractContents - collapsed range': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p>foo</p>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'p' ).getFirst(), 1 ); // f^oo
			range.collapse( true );

			var clone = range.extractContents();

			// Nothing should happens when range is collapsed.
			assert.areSame( '', clone.getHtml() );
			assert.isInnerHtmlMatching( '<p>foo</p>', root.getHtml() );
			assert.areSame( root.findOne( 'p' ).getFirst(), range.startContainer, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		'test extractContents - empty containers': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'x<h1></h1><p>foo</p><h2></h2>y' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]</h2>

			var clone = range.extractContents();

			assert.isInnerHtmlMatching( '<h1></h1><p>foo</p><h2></h2>', clone.getHtml() );
			assert.isInnerHtmlMatching( 'x<h1></h1>[]<h2></h2>y', bender.tools.range.getWithHtml( root, range ) );
		},

		'test extractContents - empty containers at different level': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'x<div><h1></h1></div><p>foo</p><div>x</div>y' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.getChild( 3 ), 0 ); // <div>]x</div>

			var clone = range.extractContents();

			assert.isInnerHtmlMatching( '<div><h1></h1></div><p>foo</p><div></div>', clone.getHtml() );
			assert.isInnerHtmlMatching( 'x<div><h1></h1></div>[]<div>x</div>y', bender.tools.range.getWithHtml( root, range ) );
		},

		'test extractContents - empty containers with mergeThen': function() {
			// IE8 has problems with empty inline nodes as usual.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}

			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'x<b></b><p>foo</p><b>a</b>y' );
			doc.getBody().append( root );

			range.setStart( root.getChild( 1 ), 0 ); // <b>[</b>
			range.setEnd( root.getChild( 3 ), 0 ); // <b>]x</b>

			var clone = range.extractContents( true );

			// We would lost empty inline elements so we add "*".
			assert.isInnerHtmlMatching( '<b>*</b><p>foo</p><b>*</b>', clone.getHtml().replace( /<b><\/b>/g, '<b>*</b>' ) );
			assert.isInnerHtmlMatching( 'x<b>[]a</b>y', bender.tools.range.getWithHtml( root, range ).replace( /<b><\/b>/g, '<b>*</b>' ) );
		},

		'test extractContents - empty container, non-empty container': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<h1></h1><h2><br /></h2>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]<br /></h2>

			var clone = range.extractContents();

			assert.isInnerHtmlMatching( '<h1></h1><h2></h2>', clone.getHtml() );
			assert.isInnerHtmlMatching( '<h1></h1>[]<h2><br /></h2>', bender.tools.range.getWithHtml( root, range ) );
		},

		'test extractContents - ID attribute cloning of partially and fully selected elements': function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ).getFirst(), 11 );
			range.setEnd( doc.getById( '_Para' ).getLast(), 2 );

			var docFrag = range.extractContents( false, false );

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			var playground = doc.getById( 'playground' );

			// See: execContentsAction in range.js.
			assert.isInnerHtmlMatching( '<h1>Test</h1><p>This is <b id="_B">some</b> t</p>', tmpDiv.getHtml(), 'Extracted HTML' );
			assert.isInnerHtmlMatching( '<h1 id="_H1">FCKW3CRange</h1><p id="_Para">ext.</p><p>Another paragraph.</p>',
				playground.getHtml(), 'HTML after extraction' );

			assert.areSame( playground, range.startContainer, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		// https://dev.ckeditor.com/ticket/13568.
		'test extractContents - bogus br': function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( 'bogus' ), 0 ); // <p>
			range.setEnd( doc.getById( 'bogus' ).getFirst(), 1 ); // <br /> in <p>

			var docFrag = range.extractContents();

			// See: execContentsAction in range.js.
			assert.isInnerHtmlMatching( '<p>Foo bar</p>', docFrag.getHtml(), 'Extracted HTML' );
		},

		// #644
		'test extract nested tags': function() {
			var range = new CKEDITOR.dom.range( doc ),
				docFrag;

			// You want to select text nodes.
			range.setStart( doc.getById( '_pe' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_sub' ).getFirst(), 3 );

			docFrag = range.extractContents();

			assert.isInnerHtmlMatching( '111<strong>222<span>333<em>444</em></span>555<sup>666</sup>777<sub id="_sub">888</sub></strong>', docFrag.getHtml() );
		},

		// #644
		'test extractContents and cloneContents provides equal results': function() {
			var range = new CKEDITOR.dom.range( doc ),
				extractFrag,
				cloneFrag;

			range.setStart( doc.getById( '_pe' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_sub' ).getFirst(), 3 );

			cloneFrag = range.cloneContents(),
			extractFrag = range.extractContents();

			assert.beautified.html( cloneFrag.getHtml(), extractFrag.getHtml() );
		}
	};

	bender.test( tests );
} )();
