/* bender-tags: editor,unit,dom,range */
/* bender-ckeditor-plugins: entities */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document;

	bender.editor = {
		config: {
			// Disable autoP to not conceal errors.
			autoParagraph: false
		}
	};

	bender.test( {
		assertFixBlock: function( editor, range, toStart, blockName, output ) {
			var ret = range.fixBlock( toStart, blockName );

			assert.isTrue( ret.is( blockName ), 'returned element\'s name' );
			assert.areSame( output, editor.getData(), 'output HTML' );
		},

		'test wrapping entire root contents' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo' );
			range.moveToPosition( editable, CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo</p>' );
		},

		'test wrapping entire root contents - backwards' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo' );
			range.moveToPosition( editable, CKEDITOR.POSITION_BEFORE_END );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo</p>' );
		},

		'test wrapping entire root contents - bidir' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo' );
			range.setStartAt( editable.getFirst(), 1 );
			range.collapse( true );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo</p>' );
		},

		'test wrapping entire root contents - block name' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo' );
			range.moveToPosition( editable, CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'div', '<div>foo</div>' );
		},

		'test wrapping contents - to start' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo<p>x</p>bar' );
			range.selectNodeContents( editable );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo</p><p>x</p>bar' );
		},

		'test wrapping contents - to end' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo<p>x</p>bar' );
			range.selectNodeContents( editable );

			this.assertFixBlock( this.editor, range, false, 'p', 'foo<p>x</p><p>bar</p>' );
		},

		'test wrapping contents up to first block' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo<h1>bar</h1>' );
			range.moveToPosition( editable, CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo</p><h1>bar</h1>' );
		},

		'test wrapping contents includes br' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'foo<br />bar' );
			range.moveToPosition( editable, CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'p', '<p>foo<br />bar</p>' );
		},

		'test wrapping contents stops at block boundary' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( '<div>foo</div>bar' );
			range.moveToPosition( editable.findOne( 'div' ), CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'p', '<div><p>foo</p></div>bar' );
		},

		'test wrapping contents stops at block limit' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'x<table><tbody><tr><td>foo</td></tr></tbody></table>x' );
			range.moveToPosition( editable.findOne( 'td' ), CKEDITOR.POSITION_AFTER_START );

			this.assertFixBlock( this.editor, range, true, 'p', 'x<table><tbody><tr><td><p>foo</p></td></tr></tbody></table>x' );
		},

		'test wrapping contents stops at block limit - backwards' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'x<table><tbody><tr><td>foo</td></tr></tbody></table>x' );
			range.moveToPosition( editable.findOne( 'td' ), CKEDITOR.POSITION_BEFORE_END );

			this.assertFixBlock( this.editor, range, true, 'p', 'x<table><tbody><tr><td><p>foo</p></td></tr></tbody></table>x' );
		},

		'test wrapping contents stops at block and block limit' : function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'x<table><tbody><tr><td><p>foo</p></td></tr></tbody></table>x' );
			range.moveToPosition( editable.findOne( 'p' ), CKEDITOR.POSITION_AFTER_END );

			this.assertFixBlock( this.editor, range, true, 'p', 'x<table><tbody><tr><td><p>foo</p><p>&nbsp;</p></td></tr></tbody></table>x' );
		},

		// #11798
		'test wrapping contents stops at non-editable block and block limit': function() {
			var editable = this.editor.editable(),
				range = this.editor.createRange();

			editable.setHtml( 'x<table><tbody><tr><td><p contenteditable="false">foo</p></td></tr></tbody></table>x' );
			range.moveToPosition( editable.findOne( 'p' ), CKEDITOR.POSITION_AFTER_END );

			this.assertFixBlock( this.editor, range, true, 'p', 'x<table><tbody><tr><td><p contenteditable="false">foo</p><p>&nbsp;</p></td></tr></tbody></table>x' );
		}

	} );
} )();