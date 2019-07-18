/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document,
		html1 = document.getElementById( 'playground' ).innerHTML;

	bender.editors = {
		classic: {
			name: 'classic'
		}
	};

	bender.test( {
		setUp: function() {
			document.getElementById( 'playground' ).innerHTML = html1;
		},

		assertHtmlFragment: function( editor, innerHtmlWithSelection, expectedHtml ) {
			var range,
				clone;

			// Prevent selection optimizations from breaking tests (#3175).
			editor.on( 'selectionCheck', function( evt ) {
				evt.cancel();
			}, null, null, -1000 );

			bender.tools.selection.setWithHtml( editor, innerHtmlWithSelection );

			range = editor.getSelection().getRanges()[ 0 ];
			clone = range.cloneContents();
			assert.isInnerHtmlMatching( expectedHtml, clone.getHtml() );
		},

		test_cloneContents_W3C_1: function() {
			// W3C DOM Range Specs - Section 2.7 - Example 1

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_Para' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_Para' ), 2 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b id="_b">some</b>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( '_Para' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_W3C_2: function() {
			// W3C DOM Range Specs - Section 2.7 - Example 2

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_B' ).getNext(), 2 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<b id="_b">ome</b> t', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( '_B' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ).nextSibling, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_W3C_3: function() {
			// W3C DOM Range Specs - Section 2.6 - Example 3

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getPrevious(), 1 );
			range.setEnd( doc.getById( '_B' ).getFirst(), 1 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b id="_b">s</b>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( '_B' ).previousSibling, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// W3C DOM Range Specs - Section 2.6 - Example 4
		test_cloneContents_W3C_4: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( '_H1' ).getFirst(), 1 );
			range.setEnd( doc.getById( 'playground' ).getLast().getFirst(), 1 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">ckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>a</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( '_H1' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ).lastChild.firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_Other: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( '_H1' ), 0 );
			range.setEnd( doc.getById( 'playground' ).getLast(), 1 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">fckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>another paragraph.</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ).lastChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_Other_2: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( 'playground' ), 0 );
			range.setEnd( doc.getById( 'playground' ), 2 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1 id="_h1">fckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			// The range must also remain unchanged.
			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_Other_3: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_B' ) );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'some', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			assert.areSame( document.getElementById( '_B' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_cloneContents_Other_4: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_Para' ) );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'this is <b id="_b">some</b> text.', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// https://dev.ckeditor.com/ticket/11586
		'test cloneContents does not split text nodes': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'foo<b>bar</b>' );
			doc.getBody().append( root );
			var startContainer = root.getFirst(),
				endContainer = root.getLast().getFirst();

			range.setStart( startContainer, 2 ); // fo[o
			range.setEnd( endContainer, 1 ); // b]ar

			var clone = range.cloneContents();

			assert.areSame( 'foo', root.getFirst().getText(), 'startContainer was not split' );
			assert.areSame( 'bar', root.getLast().getFirst().getText(), 'endContainer was not split' );
			assert.areSame( startContainer.$, range.startContainer.$, 'startContainer reference' );
			assert.areSame( endContainer.$, range.endContainer.$, 'endContainer reference' );
			assert.isInnerHtmlMatching( 'o<b>b</b>', clone.getHtml() );
		},

		// https://dev.ckeditor.com/ticket/11586
		'test cloneContents does not affect selection': function() {
			var editor = bender.editors.classic,
				range = editor.createRange(),
				editable = editor.editable();

			editable.setHtml( '<p>foo<b>bar</b></p>' );

			range.setStart( editable.getFirst().getFirst(), 2 ); // fo[o
			range.setEnd( editable.getFirst().getLast().getFirst(), 1 ); // b]ar

			var sel = editor.getSelection();
			sel.selectRanges( [ range ] );

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<p>fo{o<b>b}ar</b>@</p>', bender.tools.selection.getWithHtml( editor ) );
			assert.isInnerHtmlMatching( 'o<b>b</b>', clone.getHtml() );
		},

		'test cloneContents - empty text node is returned if range is at a text boundary': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'foo<b>bar</b>bom' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 3 ); // foo[
			range.setEnd( root.getLast(), 0 ); // ]bom

			var clone = range.cloneContents(),
				firstChild = clone.getFirst(),
				lastChild = clone.getLast();

			assert.areSame( CKEDITOR.NODE_TEXT, firstChild.type, 'start is a text node' );
			assert.areSame( '', firstChild.getText(), 'start text node is empty' );

			assert.areSame( CKEDITOR.NODE_TEXT, lastChild.type, 'end is a text node' );
			assert.areSame( '', lastChild.getText(), 'end text node is empty' );
		},

		'test cloneContents - range inside a single text node': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'bar' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 1 ); // b[ar
			range.setEnd( root.getFirst(), 2 ); // ba]r

			var clone = range.cloneContents();

			assert.areSame( 'bar', root.getFirst().getText(), 'startContainer was not split' );
			assert.areSame( 1, root.getChildCount(), '1 child left' );
			assert.areSame( 'a', clone.getHtml() );
		},

		'test cloneContents - element selection preceded by a text node': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'foo<b>bar</b>bom' );
			doc.getBody().append( root );

			range.setStart( root, 1 ); // [<b>
			range.setEnd( root, 2 ); // </b>]

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<b>bar</b>', clone.getHtml() );
		},

		'test cloneContents - startOffset == 0, startContainer is element': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>bar</b>bom</p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 0 ); // [<b>
			range.setEnd( root.getFirst().getLast(), 2 ); // bo}m

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<b>bar</b>bo', clone.getHtml() );
		},

		'test cloneContents - startOffset == childCount, startContainer is element': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>bar</b></p><p>foo</p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 1 ); // </b>[
			range.setEnd( root.getLast().getFirst(), 2 ); // fo}o

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<p></p><p>fo</p>', clone.getHtml() );
		},

		'test cloneContents - endOffset == 0, endContainer is element': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p>foo</p><p><b>bar</b></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getLast(), 0 ); // ]<b>

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<p>oo</p><p></p>', clone.getHtml() );
		},

		'test cloneContents - endOffset == childCount, endContainer is element': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p>foo<b>bar</b></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst().getFirst(), 1 ); // f[oo
			range.setEnd( root.getFirst(), 2 ); // </b>]

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( 'oo<b>bar</b>', clone.getHtml() );
		},

		'test cloneContents - offsets = ( 0, childCount ), containers are elements': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>bar</b></p>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 0 ); // [<b>
			range.setEnd( root.getFirst(), 1 ); // </b>]

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<b>bar</b>', clone.getHtml() );
		},

		'test cloneContents - right branch much longer': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'foo<u>x<b>bar<i>bom</i>y</b>z</u>' );
			doc.getBody().append( root );

			range.setStart( root.getFirst(), 1 ); // f{oo
			range.setEnd( root.findOne( 'i' ).getFirst(), 2 ); // bo}m

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( 'oo<u>x<b>bar<i>bo</i></b></u>', clone.getHtml() );
		},

		'test cloneContents - left branch much longer': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<u>x<b>y<i>bom</i>bar</b>z</u>foo' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'i' ).getFirst(), 1 ); // b{om
			range.setEnd( root.getLast(), 2 ); // fo}o

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<u><b><i>om</i>bar</b>z</u>fo', clone.getHtml() );
		},

		'test cloneContents - finding levelClone in the right branch': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p><b>foo<br>bar</b><i><u>x</u><s>bom</s></i></p>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'b' ).getFirst(), 1 ); // f{oo
			range.setEnd( root.findOne( 's' ).getFirst(), 2 ); // bo}m

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<b>oo<br />bar</b><i><u>x</u><s>bo</s></i>', clone.getHtml() );
		},

		'test cloneContents - collapsed range': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<p>foo</p>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'p' ).getFirst(), 1 ); // f^oo
			range.collapse( true );

			var clone = range.cloneContents();

			// Nothing should happens when range is collapsed.
			assert.areSame( '', clone.getHtml() );
			assert.isInnerHtmlMatching( '<p>foo</p>', root.getHtml() );
			assert.areSame( root.findOne( 'p' ).getFirst(), range.startContainer, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		'test cloneContents - empty containers': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'x<h1></h1><p>foo</p><h2></h2>y' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]</h2>

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<h1></h1><p>foo</p><h2></h2>', clone.getHtml() );
		},

		'test cloneContents - empty container, non-empty container': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<h1></h1><h2><br /></h2>' );
			doc.getBody().append( root );

			range.setStart( root.findOne( 'h1' ), 0 ); // <h1>[</h1>
			range.setEnd( root.findOne( 'h2' ), 0 ); // <h2>]<br /></h2>

			var clone = range.cloneContents();

			assert.isInnerHtmlMatching( '<h1></h1><h2></h2>', clone.getHtml() );
		},

		'test cloneContents - element ID handling': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( '<div><p id="x">f<b id="y">o</b>o</p></div>' );
			doc.getBody().append( root );

			// <div>[<p id="x">f<b id="y">o</b>o</p>]</div>
			range.setStartBefore( root.findOne( 'p' ) );
			range.setEndAfter( root.findOne( 'p' ) );

			var cloneWithId = range.cloneContents(),
				cloneWithoutId = range.cloneContents( false );

			assert.isInnerHtmlMatching( '<p id="x">f<b id="y">o</b>o</p>', cloneWithId.getHtml(), 'Clone with IDs.' );
			assert.isInnerHtmlMatching( '<p>f<b>o</b>o</p>', cloneWithoutId.getHtml(), 'Clone without IDs.' );

			assert.isInnerHtmlMatching( '<div><p id="x">f<b id="y">o</b>o</p></div>', root.getHtml() );
			assert.areSame( root.findOne( 'div' ), range.startContainer, 'range.startContainer' );
			assert.areSame( root.findOne( 'div' ), range.endContainer, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( 1, range.endOffset, 'range.startOffset' );
		},

		// https://dev.ckeditor.com/ticket/13568.
		'test cloneContents - bogus br': function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( 'bogus' ), 0 ); // <p>
			range.setEnd( doc.getById( 'bogus' ).getFirst(), 1 ); // <br /> in <p>

			var docFrag = range.cloneContents();

			// See: execContentsAction in range.js.
			assert.isInnerHtmlMatching( '<p>Foo bar</p>', docFrag.getHtml(), 'Cloned HTML' );
		},

		// Variety of edge test cases with selection range in text and elements nodes inside one element and multiple ones (#426).
		'test cloneContents - inner selection1': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>[bar} baz</strong> foo</p>', 'bar' );
		},
		'test cloneContents - inner selection2': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>{bar} baz</strong> foo</p>', 'bar' );
		},
		'test cloneContents - inner selection3': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>{bar] baz</strong> foo</p>', 'bar' );
		},
		'test cloneContents - inner selection4': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar [baz}</strong> foo</p>', 'baz' );
		},
		'test cloneContents - inner selection5': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar {baz}</strong> foo</p>', 'baz' );
		},
		'test cloneContents - inner selection6': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar {baz]</strong> foo</p>', 'baz' );
		},
		'test cloneContents - outer selection1': function() {
			// Safari always keeps selection insdie node.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo {<strong>bar] baz</strong> foo</p>', '<strong>bar</strong>' );
		},
		'test cloneContents - outer selection2': function() {
			// Safari always keeps selection insdie node.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo {<strong>bar} baz</strong> foo</p>', '<strong>bar</strong>' );
		},
		'test cloneContents - outer selection3': function() {
			// Safari always keeps selection insdie node.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo [<strong>bar] baz</strong> foo</p>', '<strong>bar</strong>' );
		},
		'test cloneContents - outer selection4': function() {
			// Safari always keeps selection insdie node.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo [<strong>bar} baz</strong> foo</p>', '<strong>bar</strong>' );
		},
		'test cloneContents - outer selection5': function() {
			// IE8 keeps selection of endpoint inside node, and Safari always keeps selection inside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar {baz</strong>] foo</p>', '<strong>baz</strong>' );
		},
		'test cloneContents - outer selection6': function() {
			// IE8 keeps selection of endpoint inside node, and Safari always keeps selection inside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar {baz</strong>} foo</p>', '<strong>baz</strong>' );
		},
		'test cloneContents - outer selection7': function() {
			// IE8 keeps selection of endpoint inside node, and Safari always keeps selection inside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar [baz</strong>] foo</p>', '<strong>baz</strong>' );
		},
		'test cloneContents - outer selection8': function() {
			// IE8 keeps selection of endpoint inside node, and Safari always keeps selection inside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>bar [baz</strong>} foo</p>', '<strong>baz</strong>' );
		},
		'test cloneContents - no gap between': function() {
			// IE8 keeps selection of endpoint inside node, and Safari always keeps selection inside.
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari ) {
				assert.ignore();
			}
			this.assertHtmlFragment( this.editors.classic, '<p>[<strong>bar baz</strong>]</p>', '<strong>bar baz</strong>' );
		},
		'test cloneContents - nested elements1': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>foo <strong>[bar <em>baz</em>]</strong> foo</p>', 'bar <em>baz</em>' );
		},
		'test cloneContents - nested elements2': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>fo[o <strong>bar <em>b]az</em></strong> foo</p>', 'o <strong>bar <em>b</em></strong>' );
		},
		'test cloneContents - multiple nested elements': function() {
			this.assertHtmlFragment( this.editors.classic, '<p>fo[o <strong>bar <em>baz</em></strong></p><table><tbody><tr><td>hello</td></tr><tr><td>world</td></tr></tbody></table><p>fo]o</p>',
			'<p>o <strong>bar <em>baz</em></strong>@</p><table><tbody><tr><td>hello</td></tr><tr><td>world</td></tr></tbody></table><p>fo</p>' );
		}
	} );
} )();
