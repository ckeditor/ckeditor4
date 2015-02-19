/* bender-tags: editor,unit,dom,range */

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

		test_cloneContents_W3C_1: function() {
			// W3C DOM Range Specs - Section 2.7 - Example 1

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_Para' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_Para' ), 2 );

			var bodyHtml = document.getElementById( 'playground' ).innerHTML;

			var docFrag = range.cloneContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b>some</b>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( '<b>ome</b> t', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( 'his is <b>s</b>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( '<h1>ckw3crange test</h1><p>this is <b>some</b> text.</p><p>a</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( '<h1>fckw3crange test</h1><p>this is <b>some</b> text.</p><p>another paragraph.</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( '<h1>fckw3crange test</h1><p>this is <b>some</b> text.</p>', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

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

			assert.areSame( 'this is <b>some</b> text.', getInnerHtml( tmpDiv.$ ), 'Cloned HTML' );

			// The body HTML must remain unchanged.
			assert.areSame( bodyHtml.replace( /\s+_cke_expando=["\d]+/g, '' ), document.getElementById( 'playground' ).innerHTML.replace( /\s+_cke_expando=["\d]+/g, '' ), 'The HTML must remain untouched' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// #11586
		'test cloneContents does not split text nodes': function() {
			var root = doc.createElement( 'div' ),
				range = new CKEDITOR.dom.range( doc );

			root.setHtml( 'foo<b>bar</b>' );

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

		// #11586
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
		}
	} );
} )();