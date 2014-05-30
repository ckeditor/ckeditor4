/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document;

	var tests =
	{
		setUp: function() {
			 document.getElementById( 'playground' ).innerHTML = html1;
			 document.getElementById( 'playground2' ).innerHTML = html2;
		},

		test_insertNode_ElementContents : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_B' ) );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( '_B' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_B' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_insertNode_ElementCollapsed : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStartBefore( doc.getById( '_Para' ) );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_insertNode_ElementNotCollapsed : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStartBefore( doc.getById( '_Para' ) );
			range.setStartBefore( doc.getById( '_H1' ) );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_insertNode_DiffElements : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_Para' ) );

			range.setStart( doc.getById( '_H1' ), 0 );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );

			assert.isTrue( range.startContainer.getChild( range.startOffset ).equals( newNode ), 'Start must be on new node' );
		},

		test_insertNode_TextCollapsed : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( '_H1' ).getFirst(), 3 );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_H1' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_insertNode_TextNotCollapsed : function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( '_H1' ).getFirst(), 3 );
			range.setEnd( doc.getById( '_H1' ).getFirst(), 5 );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_H1' ).childNodes[ 2 ], range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_insertNode_Mixed: function() {
			var newNode = new CKEDITOR.dom.element( 'span' );
			newNode.setHtml( 'test_' );

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( '_H1' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_P' ), 1 );
			range.insertNode( newNode );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		}
	};

	bender.test( tests );
} )();

	//<![CDATA[

html1 = document.getElementById( 'playground' ).innerHTML;
html2 = document.getElementById( 'playground2' ).innerHTML;

	//]]>