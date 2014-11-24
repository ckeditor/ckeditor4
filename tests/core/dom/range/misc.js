/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		html1 = document.getElementById( 'playground' ).innerHTML,
		html2 = document.getElementById( 'playground2' ).innerHTML;

	var tests = {
		setUp: function() {
			document.getElementById( 'playground' ).innerHTML = html1;
			document.getElementById( 'playground2' ).innerHTML = html2;
		},

		test__constructor: function() {
			var range = new CKEDITOR.dom.range( doc );

			assert.isNotNull( range, 'range must not be null' );

			assert.isNull( range.startContainer, 'startContainer must be null' );
			assert.isNull( range.startOffset, 'startOffset must be null' );
			assert.isNull( range.endContainer, 'endContainer must be null' );
			assert.isNull( range.endOffset, 'endOffset must be null' );

			assert.isTrue( range.collapsed, 'range must be collapsed' );
			assert.areSame( doc.getBody().$, range.root.$,
				'range boundary must default to body element' );

			var container = doc.getById( 'playground' );
			range = new CKEDITOR.dom.range( container );
			assert.areSame( container.$, range.root.$, 'range boundary element must match.' );
		},

		test_collapsed: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_P' ), CKEDITOR.POSITION_AFTER_START );

			assert.isTrue( range.collapsed );
		},

		test_collapse: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_Para' ), CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( doc.getById( '_Span' ), CKEDITOR.POSITION_BEFORE_END );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Span' ), range.endContainer.$, 'endContainer' );
			assert.isFalse( range.collapsed, 'collapsed' );

			range.collapse( true );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'startContainer' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'endContainer' );
			assert.isTrue( range.collapsed, 'collapsed' );
		},

		test_selectNodeContents_Element: function() {
			var range = new CKEDITOR.dom.range( doc );

			// Test with an Element node.
			range.selectNodeContents( doc.getById( '_Para' ) );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_selectNodeContents_Text: function() {
			var range = new CKEDITOR.dom.range( doc );

			// Test with a Text node.
			range.selectNodeContents( doc.getById( '_Para' ).getFirst() );

			assert.areSame( document.getElementById( '_Para' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ).firstChild, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 8, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_collapse_ToStart: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_P' ) );
			range.collapse( true );

			assert.areSame( document.getElementById( '_P' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_P' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		test_collapse_ToEnd: function() {
			var range = new CKEDITOR.dom.range( doc );

			range.selectNodeContents( doc.getById( '_Para' ) );
			range.collapse( false );

			assert.areSame( document.getElementById( '_Para' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 3, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_Para' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		/**
		 *  Test trim with text range.
		 */
		test_trim: function() {
			var text = doc.getById( '_trim_ct' ).getFirst();
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( text, 2 );
			range.setEnd( text, 6 );
			range.trim();

			assert.isFalse( range.collapsed );
			assert.isTrue( range.startContainer.equals( doc.getById( '_trim_ct' ) ) );
			assert.areEqual( range.startOffset, 1 );
			assert.isTrue( range.endContainer.equals( doc.getById( '_trim_ct' ) ) );
			assert.areEqual( range.endOffset, 2 );
		},

		/**
		 * Trim range which collapsed at text node boundary.
		 */
		test_trim_3790: function() {

			var ct = doc.getById( '_trim_ct' );
			ct.setHtml( '<span id="_SPAN1">text</span>' );

			// <span id="_SPAN1">text^</span>
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_SPAN1' ).getFirst(), CKEDITOR.POSITION_BEFORE_END );
			range.collapse( true );
			range.trim( true );

			// <span id="_SPAN1">text^</span>
			assert.isTrue( range.collapsed );
			assert.areEqual( doc.getById( '_SPAN1' ).$, range.startContainer.$ );
			assert.areEqual( range.startOffset, 1 );
		},

		/**
		 * Trim range which collapsed inside text node.
		 */
		test_trim_3790_2: function() {

			var ct = doc.getById( '_trim_ct' );
			ct.setHtml( '<span id="_SPAN1">text</span>' );

			// <span id="_SPAN1">te^xt</span>
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_SPAN1' ).getFirst(), 2 );
			range.collapse( true );
			range.trim( true );

			// <span id="_SPAN1">te^xt</span>
			assert.isTrue( range.collapsed );
			assert.areEqual( doc.getById( '_SPAN1' ).$, range.startContainer.$ );
			assert.areEqual( range.startOffset, 1 );
		},

		// Test enclosed node doesn't exist.
		test_enclosed_node: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_enclosed' ), 1 );
			range.setEnd( doc.getById( '_enclosed_i' ), 1 );
			// <p> Test [<i>enclosed]</i> node.</p>

			assert.isNull( range.getEnclosedNode() );
		},

		// Test enclosed node doesn't exist.
		test_enclosed_node2: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_enclosed' ).getLast(), 1 );
			range.setEnd( doc.getById( '_enclosed' ).getLast(), 5 );
			// <p> Test <i>enclosed</i> [node].</p>

			assert.isNull( range.getEnclosedNode() );
		},

		// Test enclosed node exist.
		test_enclosed_node3: function() {
			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_enclosed' ).getFirst(), 6 );
			range.setEnd( doc.getById( '_enclosed' ).getLast(), 0 );
			// <p> Test [<i>enclosed</i>] node.</p>

			assert.isTrue( doc.getById( '_enclosed_i' ).equals( range.getEnclosedNode() ) );
		},

		/* Start of #6735 */

		'test checkReadOnly when both range boundaries are inside of read-only element': function() {
			var source = 'some <strong contenteditable="false"> sample [text</strong> and a <a href="javascript:void(0)" contenteditable="false">link]</a>',
			range = bender.tools.setHtmlWithRange( doc.getById( 'editable_playground' ), source )[ 0 ];
			assert.isTrue( range.checkReadOnly() );
		},

		'test checkReadOnly when only one range boundary is inside of read-only element': function() {
			var source = '<strong contenteditable="false"> some [sample</strong> text]',
			range = bender.tools.setHtmlWithRange( doc.getById( 'editable_playground' ), source )[ 0 ];
			assert.isTrue( range.checkReadOnly() );
		},

		'test checkReadOnly when entire range is inside of read-only element': function() {
			var source = 'some <strong contenteditable="false"> [sample text ]</strong>',
			range = bender.tools.setHtmlWithRange( doc.getById( 'editable_playground' ), source )[ 0 ];
			assert.isTrue( range.checkReadOnly() );
		},

		'test checkReadOnly when read-only element is enclosed within the range': function() {
			var source = '[some <strong contenteditable="false"> sample text </strong> and ]',
			range = bender.tools.setHtmlWithRange( doc.getById( 'editable_playground' ), source )[ 0 ];
			assert.isFalse( range.checkReadOnly() );
		},

		/* End of #6735 */

		'test checkReadOnly when entire range is enclosed in an editable element which is contained by another read-only element': function() {
			var source = 'some <strong contenteditable="false"> sample text and <a href="javascript:void(0)" contenteditable="true">a [link].</a></strong>',
			range = bender.tools.setHtmlWithRange( doc.getById( 'editable_playground' ), source )[ 0 ];
			assert.isFalse( range.checkReadOnly() );
		},

		'test removeEmptyBlocksAtEnd - at the beginning': function() {
			var source = '<div><div><p>[</p></div>te]xt</div>',
				playground = doc.getById( 'editable_playground' ),
				range = bender.tools.setHtmlWithRange( playground, source )[ 0 ];
			range.removeEmptyBlocksAtEnd();

			assert.areEqual( '<div>[te]xt</div>', bender.tools.getHtmlWithRanges( playground, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test removeEmptyBlocksAtEnd - at the end': function() {
			var source = '<div>te[xt<div><p>]</p></div></div>',
				playground = doc.getById( 'editable_playground' ),
				range = bender.tools.setHtmlWithRange( playground, source )[ 0 ];
			range.removeEmptyBlocksAtEnd( true );

			assert.areEqual( '<div>te[xt]</div>', bender.tools.getHtmlWithRanges( playground, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test removeEmptyBlocksAtEnd - leave non-empty': function() {
			var source = '<div>te[xt<div><p>]</p>x</div></div>',
				playground = doc.getById( 'editable_playground' ),
				range = bender.tools.setHtmlWithRange( playground, source )[ 0 ];
			range.removeEmptyBlocksAtEnd( true );

			assert.areEqual( '<div>te[xt<div>]x</div></div>', bender.tools.getHtmlWithRanges( playground, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		'test _setStartContainer': function() {
			var range = new CKEDITOR.dom.range( doc ),
				start = new CKEDITOR.dom.element( 'a', doc );

			range._setStartContainer( start );
			assert.areSame( start, range.startContainer );
		},

		'test _setEndContainer': function() {
			var range = new CKEDITOR.dom.range( doc ),
				end = new CKEDITOR.dom.element( 'a', doc );

			range._setEndContainer( end );
			assert.areSame( end, range.endContainer );
		}
	};

	bender.test( tests );
} )();