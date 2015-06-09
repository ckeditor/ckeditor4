/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		playground = doc.getById( 'playground' ),
		startHtml = playground.getHtml();

	var tests = {
		setUp: function() {
			playground.setHtml( startHtml );
		},

		'test range#splitElement (cloneId=false)': function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( 'SE1I1' ).getFirst(), 3 );
			range.collapse( 1 );

			var splitElement = range.splitElement( doc.getById( 'SE1' ) );

			assert.isInnerHtmlMatching(
				'<p id="SE1">Test split <b id="SE1B1"><i id="SE1I1">ele</i></b></p><p><b><i>ment</i></b>.</p>', playground.getHtml(), 'DOM after split' );
			assert.isInnerHtmlMatching(
				'<p><b><i>ment</i></b>.</p>', splitElement.getOuterHtml(), 'Split element returned' );
		},

		'test range#splitElement (cloneId=true)': function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( 'SE1I1' ).getFirst(), 3 );
			range.collapse( 1 );

			var splitElement = range.splitElement( doc.getById( 'SE1' ), true );

			assert.isInnerHtmlMatching(
				'<p id="SE1">Test split <b id="SE1B1"><i id="SE1I1">ele</i></b></p><p id="SE1"><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', playground.getHtml(), 'DOM after split' );
			assert.isInnerHtmlMatching(
				'<p id="SE1"><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', splitElement.getOuterHtml(), 'Split element returned' );
		},

		'test range#splitBlock (cloneId=false)': function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( 'SE1' ).getFirst(), 4 );
			range.setEnd( doc.getById( 'SE1I1' ).getFirst(), 3 );

			var splitInfo = range.splitBlock( doc.getById( 'SE1' ) );

			assert.isInnerHtmlMatching(
				'<p id="SE1">Test@</p><p><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', playground.getHtml(), 'DOM after split' );

			assert.isInnerHtmlMatching( '<p id="SE1">Test@</p>', splitInfo.previousBlock.getOuterHtml(), 'Previous block' );
			assert.isInnerHtmlMatching( '<p><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', splitInfo.nextBlock.getOuterHtml(), 'Next block' );
		},

		'test range#splitBlock (cloneId=true)': function() {
			var range = new CKEDITOR.dom.range( doc );

			range.setStart( doc.getById( 'SE1' ).getFirst(), 4 );
			range.setEnd( doc.getById( 'SE1I1' ).getFirst(), 3 );

			var splitInfo = range.splitBlock( doc.getById( 'SE1' ), true );

			assert.isInnerHtmlMatching(
				'<p id="SE1">Test@</p><p id="SE1"><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', playground.getHtml(), 'DOM after split' );

			assert.isInnerHtmlMatching( '<p id="SE1">Test@</p>', splitInfo.previousBlock.getOuterHtml(), 'Previous block' );
			assert.isInnerHtmlMatching( '<p id="SE1"><b id="SE1B1"><i id="SE1I1">ment</i></b>.</p>', splitInfo.nextBlock.getOuterHtml(), 'Next block' );
		}
	};

	bender.test( tests );
} )();