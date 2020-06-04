/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		html1 = document.getElementById( 'playground' ).innerHTML;

	function appendBogus( element ) {
		var bogus = CKEDITOR.dom.element.createFromHtml( CKEDITOR.env.needsNbspFiller ? '&nbsp;' : '<br />' );
		element.append( bogus );
		return bogus;
	}

	var tests = {
		setUp: function() {
			document.getElementById( 'playground' ).innerHTML = html1;
		},

		test_checkStartOfBlock1: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p, CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );

			assert.isTrue( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock2: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p, CKEDITOR.POSITION_BEFORE_END );
			range.collapse( true );

			assert.isFalse( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock3: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p.getFirst(), CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );

			assert.isTrue( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock4: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p.getFirst(), CKEDITOR.POSITION_BEFORE_END );
			range.collapse( true );

			assert.isFalse( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock5: function() {
			var el = doc.getById( 'playground' );
			el.setHtml( '<p> Test </p>' );
			el = el.getFirst().getFirst();

			var range = new CKEDITOR.dom.range( doc );

			// IE trims the space in the beginning of text nodes in our case.
			// So, let's just check it and make it pass.
			range.setStart( el, ( el.substring( 0, 1 ) == 'T' ) ? 0 : 1 );
			range.collapse( true );

			assert.isTrue( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock6: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p> Test </p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( p.getFirst(), 5 );
			range.collapse( true );

			assert.isFalse( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock7: function() {
			var el = doc.getById( 'playground' );
			el.setHtml( '<p><b>Test</b></p>' );
			el = el.getFirst().getFirst();

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			assert.isTrue( range.checkStartOfBlock() );
		},

		test_checkStartOfBlock8: function() {
			var el = doc.getById( 'playground' );
			el.setHtml( '<p>A<b>Test</b>B</p>' );
			el = el.getFirst().getFirst().getNext();

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			assert.isFalse( range.checkStartOfBlock() );
		},

		test_checkEndOfBlock1: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p, CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );

			assert.isFalse( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock2: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p, CKEDITOR.POSITION_BEFORE_END );
			range.collapse( true );

			assert.isTrue( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock3: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p.getFirst(), CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );

			assert.isFalse( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock4: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p>Test</p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStartAt( p.getFirst(), CKEDITOR.POSITION_BEFORE_END );
			range.collapse( true );

			assert.isTrue( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock5: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p> Test </p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( p.getFirst(), 1 );
			range.collapse( true );

			assert.isFalse( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock6: function() {
			var p = doc.getById( 'playground' );
			p.setHtml( '<p> Test </p>' );
			p = p.getFirst();

			var range = new CKEDITOR.dom.range( doc );

			range.setStart( p.getFirst(), 5 );
			range.collapse( true );

			assert.isTrue( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock7: function() {
			var el = doc.getById( 'playground' );
			el.setHtml( '<p><b>Test</b></p>' );
			el = el.getFirst().getFirst();

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			assert.isTrue( range.checkEndOfBlock() );
		},

		test_checkEndOfBlock8: function() {
			var el = doc.getById( 'playground' );
			el.setHtml( '<p>A<b>Test</b>B</p>' );
			el = el.getFirst().getFirst().getNext();

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			assert.isFalse( range.checkEndOfBlock() );
		},

		'test_checkEndOfBlock9 (ignore block bogus)': function() {
			var el = doc.getById( 'editable_playground' );
			el.setHtml( '' );
			appendBogus( el );

			var range = new CKEDITOR.dom.range( doc );

			// <p>^<br /></p>
			// <p>^&nbsp;</p>
			range.moveToPosition( el, CKEDITOR.POSITION_AFTER_START );
			assert.isTrue( range.checkStartOfBlock() );
			assert.isTrue( range.checkEndOfBlock() );

			// Test move inside of text node, for IE.
			if ( CKEDITOR.env.needsNbspFiller ) {
				// <p>|&nbsp;</p>
				range.moveToElementEditStart( el );
				assert.isTrue( range.checkStartOfBlock() );
				assert.isTrue( range.checkEndOfBlock() );
			}

			// <p><br />^</p>
			// <p>&nbsp;^</p>

			range.moveToPosition( el, CKEDITOR.POSITION_BEFORE_END );
			assert.isTrue( range.checkStartOfBlock() );
			assert.isTrue( range.checkEndOfBlock() );

			// Test move inside of text node, for IE.
			if ( CKEDITOR.env.needsNbspFiller ) {
				// <p>&nbsp;|</p>
				range.moveToElementEditEnd( el );
				assert.isTrue( range.checkStartOfBlock() );
				assert.isTrue( range.checkEndOfBlock() );
			}

			// <p><br />^<br /></p>
			// <p>&nbsp;^&nbsp;</p>
			var bogus = appendBogus( el );
			range.moveToPosition( bogus, CKEDITOR.POSITION_AFTER_START );
			assert.isFalse( range.checkStartOfBlock() );
			assert.isTrue( range.checkEndOfBlock() );

			if ( CKEDITOR.env.needsNbspFiller ) {
				// <p>foo&nbsp;|</p>
				el.setHtml( 'foo&nbsp;' );
				range.moveToElementEditEnd( el );
				assert.isTrue( !range.checkStartOfBlock() && range.checkEndOfBlock() );

				// <p>foo|&nbsp;</p>
				range.setStart( el.getFirst(), 3 );
				range.collapse( 1 );
				assert.isTrue( !range.checkStartOfBlock() && range.checkEndOfBlock() );

				// <p>|&nbsp;foo</p>
				el.setHtml( '&nbsp;foo' );
				range.moveToElementEditStart( el );
				assert.isTrue( range.checkStartOfBlock() && !range.checkEndOfBlock() );

				// <p>&nbsp;|foo</p>
				range.setStart( el.getFirst(), 1 );
				range.collapse( 1 );
				assert.isTrue( !range.checkStartOfBlock() && !range.checkEndOfBlock() );
			}
		}
	};

	bender.test( tests );
} )();
