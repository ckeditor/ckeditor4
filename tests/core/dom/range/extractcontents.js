/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document;

	var tests =
	{
		setUp: function() {
			 document.getElementById( 'playground' ).innerHTML = html1;
		},

		test_extractContents_W3C_1 : function() {
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

		test_extractContents_W3C_2 : function() {
			// W3C DOM Range Specs - Section 2.7 - Example 2

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_B' ).getNext(), 2 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<b>ome</b> t', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( 'this is <b id="_b">s</b>ext.', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 2, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_W3C_3 : function() {
			// W3C DOM Range Specs - Section 2.6 - Example 3

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_B' ).getPrevious(), 1 );
			range.setEnd( doc.getById( '_B' ).getFirst(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( 'his is <b>s</b>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( 't<b id="_b">ome</b> text.', getInnerHtml( '_Para' ), 'HTML after extraction' );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_W3C_4 : function() {
			// W3C DOM Range Specs - Section 2.6 - Example 4

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ).getFirst(), 1 );
			range.setEnd( doc.getById( 'playground' ).getLast().getFirst(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1>ckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>a</p>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<h1 id="_h1">f</h1><p>nother paragraph.</p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ), 0 );
			range.setEnd( doc.getById( 'playground' ).getLast(), 1 );

			var docFrag = range.extractContents();

			var tmpDiv = doc.createElement( 'div' );
			docFrag.appendTo( tmpDiv );

			assert.areSame( '<h1>fckw3crange test</h1><p id="_para">this is <b id="_b">some</b> text.</p><p>another paragraph.</p>', getInnerHtml( tmpDiv.$ ), 'Extracted HTML' );
			assert.areSame( '<h1 id="_h1"></h1><p></p>', getInnerHtml( 'playground' ) );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_extractContents_Other_2 : function() {
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

		test_extractContents_Other_3 : function() {
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

		test_extractContents_Other_4 : function() {
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

		test_extractContents_Other_5 : function() {
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
		}
	};

	bender.test( tests );
} )();

	//<![CDATA[

html1 = document.getElementById( 'playground' ).innerHTML;

	//]]>