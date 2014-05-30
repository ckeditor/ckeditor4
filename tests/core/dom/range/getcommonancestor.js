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

		test_getCommonAncestor1 : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ).getFirst(), 3 );

			assert.areSame( document.getElementById( '_H1' ).firstChild, range.getCommonAncestor().$ );
		},

		test_getCommonAncestor2 : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ), 0 );

			assert.areSame( document.getElementById( '_H1' ), range.getCommonAncestor().$ );
		},

		test_getCommonAncestor3 : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_H1' ), 0 );
			range.setEnd( doc.getById( '_Para' ), 0 );

			assert.areSame( document.getElementById( 'playground' ), range.getCommonAncestor().$ );
		},

		test_getCommonAncestor4 : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_Para' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_B' ), 0 );

			assert.areSame( document.getElementById( '_Para' ), range.getCommonAncestor().$ );
		},

		test_getCommonAncestor5 : function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getBody(), 0 );
			range.setEnd( doc.getById( '_B' ).getFirst(), 1 );

			assert.areSame( document.body, range.getCommonAncestor().$ );
		},

		test_getCommonAncestor6: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 2 );
			range.setEnd( doc.getById( '_EnlargeB' ), 3 );

			assert.areSame( document.getElementById( '_EnlargeB' ), range.getCommonAncestor().$ );
		}
	};

	bender.test( tests );
} )();

	//<![CDATA[

html1 = document.getElementById( 'playground' ).innerHTML;
html2 = document.getElementById( 'playground2' ).innerHTML;

	//]]>