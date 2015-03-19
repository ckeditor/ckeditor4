/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		html2 = document.getElementById( 'playground2' ).innerHTML;

	function getRange( startId, endId ) {
		var range = new CKEDITOR.dom.range( CKEDITOR.document );
		range.moveToBookmark( { startNode: startId, endNode: endId, serializable: true } );
		return range;
	}

	var tests = {
		setUp: function() {
			document.getElementById( 'playground2' ).innerHTML = html2;
		},

		// @param CKEDITOR.dom.range range Range object which will be tested.
		// @param Number startOffset
		// @param Number endOffset
		// @param Node startContainer
		// @param Node [endContainer] If not given will be set to startContainer.
		assertRangeContainers: function( range, startOffset, endOffset, startContainer, endContainer ) {

			assert.isInstanceOf( CKEDITOR.dom.range, range, 'assertRangeContainers: range parameter has invalid type, should be instance of CKEDITOR.dom.range' );

			if ( typeof endContainer == 'undefined' )
				endContainer = startContainer;

			// do asserts...
			assert.areSame( startContainer, range.startContainer.$, 'range.startContainer' );
			assert.areSame( startOffset, range.startOffset, 'range.startOffset' );
			assert.areSame( endContainer, range.endContainer.$, 'range.endContainer' );
			assert.areSame( endOffset, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// #8732
		'test enlarge element (HTML comments)': function() {
			// IE9+Compat throws exception with the below content.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				assert.ignore();

			var ct = CKEDITOR.document.getById( '_EnlargeP19' ),
				ranges = bender.tools.setHtmlWithRange( ct, '<!-- foo --><p><strong>foo</strong></p><p>[bar]</p><!--bar-->' );

			ranges[ 0 ].enlarge( CKEDITOR.ENLARGE_ELEMENT );
			var output = bender.tools.getHtmlWithRanges( ct, ranges );
			assert.areSame( '<!-- foo --><p><strong>foo</strong></p>[<p>bar</p>]<!--bar-->', output );
		},

		// #4950
		'test enlarge element 16': function() {
			var ct = doc.getById( 'editable_playground' );
			var source = '<p><b>A</b> <b>B</b> [C]D</p>';
			var range = bender.tools.setHtmlWithRange( ct, source )[ 0 ];
			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );
			assert.areSame( source, bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
		},

		test_enlarge_block1: function() {
			var range = getRange( 'S5', null );
			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP11' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP11' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 5, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element9: function() {
			// <p>Test<i> [Enlarge</i>]</p>
			// <p>Test<i> [Enlarge</i>]</p>

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI3' ).getFirst(), 1 );
			range.setEnd( doc.getById( '_EnlargeP3' ), 2 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			assert.areSame( document.getElementById( '_EnlargeI3' ).firstChild, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP3' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element10: CKEDITOR.env.ie ?
			function() {
				// <p>Test <i>[Enlarge</i>]</p>
				// <p>Test [<i>Enlarge</i>]</p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI4' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeP4' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP4' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP4' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			}
			:
			function() {
				// <p>Test <i> [Enlarge</i>]</p>
				// <p>Test [<i> Enlarge</i>]</p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI4' ).getFirst(), 1 );
				range.setEnd( doc.getById( '_EnlargeP4' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP4' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP4' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element11: function() {
			// <p>Test <i>[Enlarge]</i></p>
			// <p>Test [<i>Enlarge</i>]</p>

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI5' ), 0 );
			range.setEnd( doc.getById( '_EnlargeI5' ), 1 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			assert.areSame( document.getElementById( '_EnlargeP5' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP5' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element12: function() {
			// <p>Test <i><b></b>[Enlarge]</i></p>
			// <p>Test [<i><b></b>Enlarge</i>]</p>

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI6' ), 1 );
			range.setEnd( doc.getById( '_EnlargeI6' ), 2 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			assert.areSame( document.getElementById( '_EnlargeP6' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP6' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element13: function() {
			// <p>Test <i><b></b>[Enlarge]</i></p>
			// <p>Test [<i><b></b>Enlarge</i>]</p>

			doc.getById( '_EnlargeP' ).setHtml( 'this <i>is some </i>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeP' ), 0 );
			range.setEnd( doc.getById( '_EnlargeP' ).getChild( 1 ), 0 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			assert.areSame( document.getElementById( '_EnlargeP' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP' ).childNodes[ 1 ], range.endContainer.$, 'range.endContainer' );
			assert.areSame( 0, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		// Enlarge without including line-breaks; (#7087)
		test_enlarge_element15: function() {
			// <p><i>[Enlarge]</i><br /></p>
			// <p>[<i>Enlarge</i>]<br /></p>

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI8' ), 0 );
			range.setEnd( doc.getById( '_EnlargeI8' ), 1 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT, true );

			assert.areSame( document.getElementById( '_EnlargeP18' ), range.startContainer.$ );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP18' ), range.endContainer.$ );
			assert.areSame( 1, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element20: function() {
			// <p><span contenteditable="false">[foobar]</span></p>
			// <p><span contenteditable="false">[foobar]</span></p>

			var range = new CKEDITOR.dom.range( doc ),
				expectedTextNode = document.getElementById( '_EnlargeS20' ).firstChild;
			range.setStart( doc.getById( '_EnlargeS20' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeS20' ).getFirst(), 5 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 0, 5, expectedTextNode );
		},

		test_enlarge_element21: function() {
			// <p><span contenteditable="false"><i>[foobar]</i></span></p>
			// <p><span contenteditable="false">[<i>foobar</i>]</span></p>

			var range = new CKEDITOR.dom.range( doc ),
				expectedSelectContainer = document.getElementById( '_EnlargeS21' );
			range.setStart( doc.getById( '_EnlargeI21' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeI21' ).getFirst(), 6 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 0, 1, expectedSelectContainer );
		},

		'test enlarge with _empty_ contenteditable as preceding item': function() {
			// <p><span contenteditable="false"></span><i>[foobar]</i></p>
			// [<p><span contenteditable="false"></span><i>foobar</i></p>]

			var range = new CKEDITOR.dom.range( doc ),
				expectedSelectContainer = doc.getById( '_EnlargeP22Container' ).$;
			range.setStart( doc.getById( '_EnlargeI22' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeI22' ).getFirst(), 6 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			// IE8 has its ways to select
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 )
				this.assertRangeContainers( range, 1, 2, doc.getById( '_EnlargeP22' ).$, expectedSelectContainer );
			else
				this.assertRangeContainers( range, 1, 2, expectedSelectContainer, expectedSelectContainer );
		},

		'test enlarge with whitespaced contenteditable as preceding item': function() {
			// <p><span contenteditable="false">  </span><i>[foobar]</i></p>
			// [<p><span contenteditable="false">  </span><i>foobar</i></p>]

			var range = new CKEDITOR.dom.range( doc ),
				expectedSelectContainer = doc.getById( '_EnlargeP24Container' ).$;
			range.setStart( doc.getById( '_EnlargeI24' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeI24' ).getFirst(), 6 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 )
				this.assertRangeContainers( range, 1, 2, doc.getById( '_EnlargeP24' ).$, expectedSelectContainer );
			else
				this.assertRangeContainers( range, 1, 2, expectedSelectContainer, expectedSelectContainer );
		},

		'test enlarge with contenteditable as preceding item': function() {
			// <p><span contenteditable="false">bombom</span><i>[foobar]</i><span>foo</span></p>
			// <p><span contenteditable="false">bombom</span>[<i>[foobar]</i>]<span>foo</span></p>

			var range = new CKEDITOR.dom.range( doc ),
				expectedSelectContainer = doc.getById( '_EnlargeP23' ).$;
			range.setStart( doc.getById( '_EnlargeI23' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeI23' ).getFirst(), 6 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, expectedSelectContainer );
		},

		test_enlarge_list1: function() {
			var range = getRange( 'S1', null );
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP7' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP7' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_list2: function() {
			var range = getRange( 'S2', 'E2' );
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP8' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP8' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 4, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_list3: function() {
			var range = getRange( 'S3', null );
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP9' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 2, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP9' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 3, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_list4: function() {
			var range = getRange( 'S4', null );
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP10' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 3, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP10' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 5, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_list5: function() {
			var range = getRange( 'S9', null );
			var bookmark = range.createBookmark();
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP15' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP15' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 4, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
			range.moveToBookmark( bookmark );
		},

		test_enlarge_block2: function() {
			var range = getRange( 'S10', null );
			var bookmark = range.createBookmark();
			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP16' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP16' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 5, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
			range.moveToBookmark( bookmark );
		},

		test_enlarge_block3: function() {
			var range = getRange( 'S6', null );
			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP12' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP12' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_block4: function() {
			var range = getRange( 'S7', null );
			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP13' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeP13' ), range.endContainer.$, 'range.endContainer' );
			assert.areSame( 2, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_block5: function() {
			var range = getRange( 'S8', null );
			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP14' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.isTrue( range.collapsed, 'range.collapsed' );
		},

		/**
		 * Test enlarge list when there's no nodes between
		 * range start and the block boundary.
		 */
		test_enlarge_block6: function() {
			var range = getRange( 'S11', null );
			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( document.getElementById( '_EnlargeP17' ),
				range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
		},

		/**
		 * We should stop enlarging the range when it ends right after BR,
		 * this's the case when a line selection is made in IE/Opera. (#7490)
		 */
		test_enlarge_brs: function() {
			var target = CKEDITOR.document.getById( '_EnlargeP19' ),
				range = bender.tools.setHtmlWithRange( target, '[line1<br />line2<br />]line3' )[ 0 ];

			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( target.$, range.startContainer.$, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( target.$, range.endContainer.$, 'range.endContainer' );
			assert.areSame( 4, range.endOffset, 'range.startOffset' );
		},

		'test enlarge does not stop on positioned or floated inline elements': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP25a' ),
				range = getRange( 'S25a', null );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target, range.endContainer, 'range.endContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
			assert.areSame( target.getChildCount(), range.endOffset, 'range.endOffset' );
		},

		'test enlarge stops on block boundaries': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP25b' ),
				range = getRange( 'S25b', null );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target, range.endContainer, 'range.endContainer' );
			assert.isTrue( range.startOffset > 0, 'range.startOffset - range has not been moved to the start' );
			assert.isTrue( range.endOffset < target.getChildCount(), 'range.endOffset - range has not been moved to the end' );
		},

		'test enlarge does not check contents of non-editable elements - ENLARGE_BLOCK_CONTENTS': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP26' ),
				range = getRange( 'S26', null );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target, range.endContainer, 'range.endContainer' );
			// Starts right after </p#P26S>.
			assert.areSame( CKEDITOR.document.getById( 'P26S' ).getIndex() + 1, range.startOffset, 'range.startOffset' );
			// Ends right before <p#P26E>.
			assert.areSame( CKEDITOR.document.getById( 'P26E' ).getIndex(), range.endOffset, 'range.endOffset' );
		},

		'test enlarge does not check contents of non-editable elements - ENLARGE_LIST_ITEM_CONTENTS': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP26' ),
				range = getRange( 'S26', null );

			range.enlarge( CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS );

			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target, range.endContainer, 'range.endContainer' );
			// Starts right after </p#P26S>.
			assert.areSame( CKEDITOR.document.getById( 'P26S' ).getIndex() + 1, range.startOffset, 'range.startOffset' );
			// Ends right before <p#P26E>.
			assert.areSame( CKEDITOR.document.getById( 'P26E' ).getIndex(), range.endOffset, 'range.endOffset' );
		},

		'test enlarge stops on non-editable blocks': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP27' ),
				range = getRange( 'S27', null );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target, range.endContainer, 'range.endContainer' );
			// Starts right after </p#P27S>.
			assert.areSame( CKEDITOR.document.getById( 'P27S' ).getIndex() + 1, range.startOffset, 'range.startOffset' );
			// Ends right before <p#P27E>.
			assert.areSame( CKEDITOR.document.getById( 'P27E' ).getIndex(), range.endOffset, 'range.endOffset' );
		},

		'test enlarge stops on non-editable blocks 2': function() {
			var target = CKEDITOR.document.getById( '_EnlargeP28' ),
				range = new CKEDITOR.dom.range( doc );

			range.setStart( target, 0 );
			range.collapse( true );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.isTrue( range.collapsed, 'range.collapsed' );
			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( 0, range.startOffset, 'range.startOffset' );
		},

		// #11798
		'test enlarge between non-editable block and block limit boundary': function() {
			var target = CKEDITOR.document.getById( 'S29' ),
				range = new CKEDITOR.dom.range( doc );

			// <td#S29><p non-editable>foo</p>^</td>
			range.moveToPosition( target, CKEDITOR.POSITION_BEFORE_END );

			range.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			assert.isTrue( range.collapsed, 'range.collapsed' );
			assert.areSame( target, range.startContainer, 'range.startContainer' );
			assert.areSame( target.getChildCount(), range.startOffset, 'range.startOffset' );
		},

		'test space 1': function() {
			// <div>x<p><b>[foo] </b>bar</p>x</div> ->
			// <div>x[<p><b>foo] </b>bar</p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( '<b id="b">foo </b>bar' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, b.getFirst().$ );
		},

		'test space 2': function() {
			// <div>x<p><b>[foo]</b> bar</p>x</div> ->
			// <div>x[<p><b>foo</b>] bar</p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( '<b id="b">foo</b> bar' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 1, pContainer.$, p.$ );
		},

		'test space 3': function() {
			// <div>x<p><b>[foo] </b></p>x</div> ->
			// <div>x[<p><b>foo </b></p>]x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( '<b id="b">foo </b>' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, pContainer.$, pContainer.$ );
		},

		'test space 4': function() {
			// <div>x<p>[foo] <b>bar</b> </p>x</div> ->
			// <div>x[<p>foo] <b>bar</b> </p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo <b>bar</b> ' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, p.getFirst().$ );
		},

		'test space 5': function() {
			// <div>x<p>[foo] </p>x</div> ->
			// <div>x[<p>foo </p>]x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo ' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, pContainer.$, pContainer.$ );
		},

		'test space 6': function() {
			// <div>x<p>[foo] bar</p>x</div> ->
			// <div>x[<p>foo] bar</p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo bar' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, p.getFirst().$ );
		},

		'test space 7': function() {
			// <div>x<p><i><b>[foo] </b></i>bar </p>x</div> ->
			// <div>x[<p><i><b>foo] </b></i>bar </p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( '<i><b id="b">foo </b></i>bar ' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, b.getFirst().$ );
		},

		'test space 8': function() {
			// <div>x<p>foo <i><b>[bar] </b></i></p>x</div> ->
			// <div>x<p>foo [<i><b>bar </b></i></p>]x</div> ->

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo <i><b id="b">bar </b></i>' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, p.$, pContainer.$ );
		},

		'test space 9': function() {
			// <div>x<p><i><b>[foo]</b></i> bar</p>x</div> ->
			// <div>x[<p><i><b>foo</b></i>] bar</p>x</div> ->

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( '<i><b id="b">foo</b></i> bar' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 1, pContainer.$, p.$ );
		},

		'test space 10': function() {
			// <div>x<p>foo <i><b>[bar]</b></i> </p>x</div> ->
			// <div>x<p>foo [<i><b>bar</b></i> </p>]x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo <i><b id="b">bar</b></i> ' );

			var b = doc.getById( 'b' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( b.getFirst(), 0 );
			range.setEnd( b.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, p.$, pContainer.$ );
		},

		'test space 11': function() {
			// <div>x<p>[foo] |bar</p>x</div> ->
			// <div>x[<p>foo] |bar</p>x</div>
			// (pipe means there are 2 separate text nodes)

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo ' );
			p.append( new CKEDITOR.dom.text( 'bar' ) );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, p.getFirst().$ );
		},

		'test space 12': function() {
			// <div>x<p>[foo]| </p>x</div> ->
			// <div>x[<p>foo| </p>]x</div>
			// (pipe means there are 2 separate text nodes)

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo' );
			p.append( new CKEDITOR.dom.text( ' ' ) );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 2, pContainer.$, pContainer.$ );
		},

		'test space 13': function() {
			// <div>x<p>[foo] <b></b></p>x</div> ->
			// <div>x[<p>foo] <b></b></p>x</div>

			var p = doc.getById( 'p' ),
				pContainer = doc.getById( 'pContainer' );

			p.setHtml( 'foo <b></b>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( p.getFirst(), 0 );
			range.setEnd( p.getFirst(), 3 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			this.assertRangeContainers( range, 1, 3, pContainer.$, p.getFirst().$ );
		}
	};

	// IE only tests.
	CKEDITOR.env.ie && YUITest.Util.mix( tests, {
		test_enlarge_element1: CKEDITOR.env.version > 8 ?
			function() {
				// <p> Test <b> <i>  [Enlarge]</i> this</b>   </p>
				// <p> Test <b> [<i>  Enlarge</i>] this</b>   </p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 2 );
				range.setEnd( doc.getById( '_EnlargeI' ), 1 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeB' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p>Test <b><i>[Enlarge]</i> this</b></p>
				// <p>Test <b>[<i>Enlarge</i>] this</b></p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeI' ), 1 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeB' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 0, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element2: CKEDITOR.env.version > 8 ?
			function() {
				// <p> Test <b> <i>  [Enlarge</i> this]</b>   </p>
				// <p> Test [<b> <i>  Enlarge</i> this</b>]   </p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 2 );
				range.setEnd( doc.getById( '_EnlargeB' ), 3 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p>Test <b><i>[Enlarge</i> this]</b></p>
				// <p>Test [<b><i>Enlarge</i> this</b>]</p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeB' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element3: CKEDITOR.env.version > 8 ?
			function() {
				// <p> [Test <b> <i>  Enlarge]</i> this</b>   </p>
				// <p> [Test <b> <i>  Enlarge</i>] this</b>   </p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeP' ).getFirst(), 1 );
				range.setEnd( doc.getById( '_EnlargeI' ), 1 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ).firstChild, range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p>[Test <b><i>Enlarge]</i> this</b></p>
				// <p>[Test <b><i>Enlarge</i>] this</b></p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeP' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeI' ), 1 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ).firstChild, range.startContainer.$, 'range.startContainer' );
				assert.areSame( 0, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element4: CKEDITOR.env.version > 8 ?
			function() {
				// <p> [Test <b> <i>  Enlarge</i> this]</b>   </p>
				// [<p> Test <b> <i>  Enlarge</i> this</b>   </p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeP' ).getFirst(), 1 );
				range.setEnd( doc.getById( '_EnlargeB' ).getChild( 2 ), 5 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ).parentNode, range.startContainer.$, 'range.startContainer' );
				assert.areSame( doc.getById( '_EnlargeP' ).getIndex(), range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p>[Test <b><i>Enlarge</i> this]</b></p>
				// [<p>Test <b><i>Enlarge</i> this</b></p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeP' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeB' ).getChild( 1 ), 5 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ).parentNode, range.startContainer.$, 'range.startContainer' );
				assert.areSame( doc.getById( '_EnlargeP' ).getIndex(), range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element5: function() {
			// <p>Test<b> <i>[Enlarge</i> this]</b></p>
			// <p>Test<b> [<i>Enlarge</i> this]</b></p>

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( doc.getById( '_EnlargeI1' ).getFirst(), 0 );
			range.setEnd( doc.getById( '_EnlargeB1' ).getChild( 2 ), 5 );

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			assert.areSame( document.getElementById( '_EnlargeB1' ), range.startContainer.$, 'range.startContainer' );
			assert.areSame( 1, range.startOffset, 'range.startOffset' );
			assert.areSame( document.getElementById( '_EnlargeB1' ).childNodes[ 2 ], range.endContainer.$, 'range.endContainer' );
			assert.areSame( 5, range.endOffset, 'range.endOffset' );
			assert.isFalse( range.collapsed, 'range.collapsed' );
		},

		test_enlarge_element6: CKEDITOR.env.version > 8 ?
			function() {
				// <p> <b> <i>  [Enlarge</i>] this</b>   </p>
				// <p> <b> [<i>  Enlarge</i>] this</b>   </p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI2' ).getFirst(), 2 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeB2' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB2' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 2, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p><b><i>[Enlarge</i>] this</b></p>
				// <p><b>[<i>Enlarge</i>] this</b></p>

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI2' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 1 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeB2' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 0, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeB2' ), range.endContainer.$, 'range.endContainer' );
				assert.areSame( 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element7: CKEDITOR.env.version > 8 ?
			function() {
				// <p> <b> <i>  [Enlarge</i> this]</b>   </p>
				// [<p> <b> <i>  Enlarge</i> this</b>   </p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI2' ).getFirst(), 2 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 3 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.startContainer.$, 'range.startContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex(), range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p><b><i>[Enlarge</i> this]</b></p>
				// [<p><b><i>Enlarge</i> this</b></p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI2' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.startContainer.$, 'range.startContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex(), range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			},

		test_enlarge_element8: CKEDITOR.env.version > 8 ?
			function() {
				// <p> Test <b> <i>  [Enlarge</i> this</b>   </p><p> <b> <i>  Enlarge</i> this]</b>   </p>
				// <p> Test [<b> <i>  Enlarge</i> this</b>   </p><p> <b> <i>  Enlarge</i> this</b>   </p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 2 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 3 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			} : function() {
				// <p>Test <b><i>[Enlarge</i> this</b></p><p><b><i>Enlarge</i> this]</b></p>
				// <p>Test [<b><i>Enlarge</i> this</b></p><p><b><i>Enlarge</i> this</b></p>]

				var range = new CKEDITOR.dom.range( doc );
				range.setStart( doc.getById( '_EnlargeI' ).getFirst(), 0 );
				range.setEnd( doc.getById( '_EnlargeB2' ), 2 );

				range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				assert.areSame( document.getElementById( '_EnlargeP' ), range.startContainer.$, 'range.startContainer' );
				assert.areSame( 1, range.startOffset, 'range.startOffset' );
				assert.areSame( document.getElementById( '_EnlargeP2' ).parentNode, range.endContainer.$, 'range.endContainer' );
				assert.areSame( doc.getById( '_EnlargeP2' ).getIndex() + 1, range.endOffset, 'range.endOffset' );
				assert.isFalse( range.collapsed, 'range.collapsed' );
			}

	} );


	bender.test( tests );
} )();