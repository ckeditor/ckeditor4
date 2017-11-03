/* bender-tags: editor,dom */

'use strict';

bender.test( {
	// helpers

	elPath: function( element, root ) {
		return new CKEDITOR.dom.elementPath( this.$( element ), root ? this.$( root ) : root );
	},

	$: function( id ) {
		return CKEDITOR.document.getById( id );
	},

	// tests

	'test constructor - div>div>p>span': function() {
		var path = this.elPath( 'e1_1_1_1' );

		assert.areSame( this.$( 'e1_1_1' ), path.block );
		assert.areSame( this.$( 'e1_1' ), path.blockLimit );
		assert.areEqual( 5, path.elements.length );
		assert.areSame( this.$( 'e1_1_1_1' ), path.lastElement );
	},

	'test constructor - div>div>p>b>span': function() {
		var path = this.elPath( 'e1_1_1_2', 'e1_1' );

		assert.areSame( this.$( 'e1_1_1' ), path.block );
		assert.areSame( this.$( 'e1_1' ), path.blockLimit );
		assert.areEqual( 4, path.elements.length );
		assert.areSame( this.$( 'e1_1_1_2' ), path.lastElement );
	},

	// Test for https://dev.ckeditor.com/ticket/525.
	'test constructor - body>div>div(inline contents)>span': function() {
		var path = this.elPath( 'e2_1_1', 'e0' );

		assert.areSame( this.$( 'e2_1' ), path.block, 'innermost div' );
		assert.areSame( this.$( 'e2' ), path.blockLimit, 'first div with block content' );
		assert.areEqual( 4, path.elements.length );
		assert.areSame( this.$( 'e2_1_1' ), path.lastElement );
	},

	// Test for https://dev.ckeditor.com/ticket/525.
	'test constructor - body>div>div(block contents)>span': function() {
		var path = this.elPath( 'e2_2_1', 'e0' );

		assert.isNull( path.block );
		assert.areSame( this.$( 'e2_2' ), path.blockLimit );
		assert.areEqual( 4, path.elements.length );
		assert.areSame( this.$( 'e2_2_1' ), path.lastElement );
	},

	'test constructor - div>table': function() {
		// Object (table) as the last path element cannot be block limit.
		var path = this.elPath( 'e1_2', 'e1' );

		assert.isNull( path.block );
		assert.areSame( this.$( 'e1' ), path.blockLimit );
		assert.areSame( 2, path.elements.length );
		assert.areSame( this.$( 'e1_2' ), path.lastElement );
	},

	'test constructor - div>table>tr>td': function() {
		var path = this.elPath( 'e1_2_2', 'e1' );

		assert.isNull( path.block );
		assert.areSame( this.$( 'e1_2_2' ), path.blockLimit );
		assert.areSame( 5, path.elements.length );
		assert.areSame( this.$( 'e1_2_2' ), path.lastElement );
	},

	'test constructor - div>table>tr>td>p': function() {
		var path = this.elPath( 'e1_2_3_1', 'e1' );

		assert.areSame( this.$( 'e1_2_3_1' ), path.block, 'block is p' );
		assert.areSame( this.$( 'e1_2_3' ), path.blockLimit, 'blocklimit is td' );
		assert.areSame( 6, path.elements.length );
		assert.areSame( this.$( 'e1_2_3_1' ), path.lastElement );
	},

	'test constructor - div>table>caption': function() {
		var path = this.elPath( 'e1_2_1', 'e1' );

		assert.isNull( path.block );
		assert.areSame( this.$( 'e1_2_1' ), path.blockLimit, 'caption is a block limit' );
		assert.areSame( 3, path.elements.length );
		assert.areSame( this.$( 'e1_2_1' ), path.lastElement );
	},

	'test constructor - h1>span': function() {
		// Blockless editable case.
		var path = this.elPath( 'e3_1', 'e3' );

		assert.isNull( path.block, 'no splittable block' );
		assert.areSame( this.$( 'e3' ), path.blockLimit, 'h1 is a block limit' );
		assert.areSame( 2, path.elements.length );
		assert.areSame( this.$( 'e3_1' ), path.lastElement );
	},

	'test constructor - h1': function() {
		// Blockless editable case.
		var path = this.elPath( 'e3', 'e3' );

		assert.isNull( path.block, 'no splittable block' );
		assert.areSame( this.$( 'e3' ), path.blockLimit, 'h1 is a block limit' );
		assert.areSame( 1, path.elements.length );
		assert.areSame( this.$( 'e3' ), path.lastElement );
	},

	'test constructor - div[editable]>div[noneditable]>p[editable]': function() {
		// Blockless nested editable case.
		var path = this.elPath( 'e5_1', 'e5' );

		assert.isNull( path.block, 'no splittable block' );
		assert.areSame( this.$( 'e5_1' ), path.blockLimit, 'p is a block limit' );
		assert.areSame( 3, path.elements.length );
		assert.areSame( this.$( 'e5_1' ), path.lastElement );
	},

	'test constructor - div[editable]>div[noneditable]>figure>figcaption[editable]>p': function() {
		// Nested editable case.
		var path = this.elPath( 'e5_2_1', 'e5' );

		assert.areSame( this.$( 'e5_2_1' ), path.block, 'p is a splittable block' );
		assert.areSame( this.$( 'e5_2' ), path.blockLimit, 'figcaption is a block limit' );
		assert.areSame( 5, path.elements.length );
		assert.areSame( this.$( 'e5_2_1' ), path.lastElement );
	},

	'test constructor - div[editable]>div[noneditable]>blockquote[editable]>p': function() {
		// Nested editable case.
		var path = this.elPath( 'e5_3_1', 'e5' );

		assert.areSame( this.$( 'e5_3_1' ), path.block, 'p is a splittable block' );
		assert.areSame( this.$( 'e5_3' ), path.blockLimit, 'blockquote is a block limit' );
		assert.areSame( 4, path.elements.length );
		assert.areSame( this.$( 'e5_3_1' ), path.lastElement );
	},

	'test constructor - div[editable]>div>div[noneditable]': function() {
		// Non-editable block selected.
		var path = this.elPath( 'e6_1_1', 'e6' );

		assert.isNull( path.block, 'no splittable block' );
		assert.areSame( this.$( 'e6_1' ), path.blockLimit, 'first div is a block limit' );
		assert.areSame( 3, path.elements.length );
		assert.areSame( this.$( 'e6_1_1' ), path.lastElement );
	},

	'test constructor - div[editable]>div[noneditable]': function() {
		// Non-editable block selected.
		var path = this.elPath( 'e6_2', 'e6' );

		assert.isNull( path.block, 'no splittable block' );
		assert.areSame( this.$( 'e6' ), path.blockLimit, 'root is a block limit' );
		assert.areSame( 2, path.elements.length );
		assert.areSame( this.$( 'e6_2' ), path.lastElement );
	},

	test_compare1: function() {
		var path1 = this.elPath( 'e1_1_1_1' ),
			path2 = this.elPath( 'e1_1_1_2' );

		assert.isFalse( path1.compare( path2 ) );
		assert.isFalse( path2.compare( path1 ) );
	},

	test_compare2: function() {
		var path1 = this.elPath( 'e2_1_1' ),
			path2 = this.elPath( 'e2_1_2' );

		assert.isFalse( path1.compare( path2 ) );
		assert.isFalse( path2.compare( path1 ) );
	},

	test_compare3: function() {
		var path1 = this.elPath( 'e2_1_1' ),
			path2 = this.elPath( 'e2_1_1' );

		assert.isTrue( path1.compare( path2 ) );
	},

	test_contains: function() {
		var path = this.elPath( 'e1_1_1_1' );

		assert.areSame( this.$( 'e1_1' ), path.contains( { div: 1 } ) );
		assert.areSame( this.$( 'e1_1_1' ), path.contains( { div: 1, p: 1 } ) );
		assert.areSame( this.$( 'e1_1_1' ), path.contains( [ 'div', 'p' ] ) );
		assert.isNull( path.contains( { strong: 1 } ) );

		// Test check in reverse order.
		path = this.elPath( 'e1_1_1_1', 'e1' );
		assert.areSame( this.$( 'e1' ), path.contains( { div: 1 }, false, true ) );

		// Test check with root excluded.
		path = this.elPath( 'e1_1_1_1', 'e1_1' );
		assert.isNull( path.contains( { div: 1 }, true ) );
	},

	'test isContextFor - div>table>caption>span': function() {
		// HTML5: block is allowed inside table caption.
		var path = this.elPath( 'e1_2_1_1', 'e1' );
		assert.isTrue( path.isContextFor( 'p' ) );
	},

	'test isContextFor - body>details>summary': function() {
		// HTML5: block is not allowed inside details summary.
		var path = this.elPath( 'e4_1', 'e0' );
		assert.isFalse( path.isContextFor( 'p' ) );
	},

	'test isContextFor - h1>span': function() {
		// Block is not allowed inside block-less editable.
		var path = this.elPath( 'e3_1', 'e3' );
		assert.isFalse( path.isContextFor( 'p' ) );
	},

	'test isContextFor - div>div>p>span': function() {
		// Block is allowed within block limit.
		var path = this.elPath( 'e1_1_1_1', 'e1' );
		assert.isTrue( path.isContextFor( 'p' ) );
	},

	'test isContextFor - div[editable]>div[noneditable]>p[editable]': function() {
		// Blockless nested editable case.
		var path = this.elPath( 'e5_1', 'e5' );

		assert.isFalse( path.isContextFor( 'p' ) );
	}
} );
