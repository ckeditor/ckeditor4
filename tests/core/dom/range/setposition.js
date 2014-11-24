/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document;

	var tests = {
		test_setStart: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( 'playground' ), 1 );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$ );
			assert.areSame( 1, range.startOffset );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$ );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed );
		},

		test_setEnd: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEnd( doc.getById( 'playground' ), 1 );

			assert.areSame( document.getElementById( 'playground' ), range.startContainer.$ );
			assert.areSame( 1, range.startOffset );
			assert.areSame( document.getElementById( 'playground' ), range.endContainer.$ );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed );
		},

		test_setStartAfter: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAfter( doc.getById( '_B' ) );
			range.setStartAfter( doc.getById( '_H1' ).getFirst() );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_setStartBefore: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartBefore( doc.getById( '_B' ) );
			range.setStartBefore( doc.getById( '_H1' ).getFirst() );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_setEndAfter: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndAfter( doc.getById( '_H1' ).getFirst() );
			range.setEndAfter( doc.getById( '_B' ) );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_setEndBefore: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndBefore( doc.getById( '_H1' ).getFirst() );
			range.setEndBefore( doc.getById( '_B' ) );

			assert.areSame( document.getElementById( '_H1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_setStartAt_1: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_Span' ), CKEDITOR.POSITION_AFTER_START );

			assert.areSame( document.getElementById( '_Span' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Span' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setStartAt_2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_Span' ), CKEDITOR.POSITION_BEFORE_END );

			assert.areSame( document.getElementById( '_Span' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Span' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setStartAt_3: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_Span' ), CKEDITOR.POSITION_BEFORE_START );

			assert.areSame( document.getElementById( '_P' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setStartAt_4: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_Span' ), CKEDITOR.POSITION_AFTER_END );

			assert.areSame( document.getElementById( '_P' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setEndAt_1: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndAt( doc.getById( '_Span' ), CKEDITOR.POSITION_AFTER_START );

			assert.areSame( document.getElementById( '_Span' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Span' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setEndAt_2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndAt( doc.getById( '_Span' ), CKEDITOR.POSITION_BEFORE_END );

			assert.areSame( document.getElementById( '_Span' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Span' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setEndAt_3: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndAt( doc.getById( '_Span' ), CKEDITOR.POSITION_BEFORE_START );

			assert.areSame( document.getElementById( '_P' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_setEndAt_4: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setEndAt( doc.getById( '_Span' ), CKEDITOR.POSITION_AFTER_END );

			assert.areSame( document.getElementById( '_P' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		}
	};

	bender.test( tests );
} )();