/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document;

	var tests = {
		rangeMoveToClosestEditable: function( html, isMoveToEnd, retValue ) {
			if ( retValue === undefined )
				retValue = true;

			var ct = doc.getById( 'editable_playground' );
			ct.setHtml( html );

			var startNode = doc.getById( 'start' ),
				range = new CKEDITOR.dom.range( ct );

			assert.areSame( retValue, !!range.moveToClosestEditablePosition( startNode, isMoveToEnd ), 'Method returned value' );

			if ( retValue )
				return bender.tools.fixHtml( bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
			else {
				assert.isFalse( !!range.startContainer, 'Start container is not set if method returned false' );
				return bender.tools.fixHtml( ct.getHtml() );
			}
		},

		test_moveToClosestEditable1: function() {
			assert.areSame( 'editable^<span id="start">e</span>',
				this.rangeMoveToClosestEditable( 'editable<span id="start">e</span>' ) );
		},

		test_moveToClosestEditable2: function() {
			assert.areSame( 'editable<span id="start">e</span>^editable',
				this.rangeMoveToClosestEditable( 'editable<span id="start">e</span>editable', true ) );
		},

		test_moveToClosestEditable3: function() {
			assert.areSame( '<b><i>editable</i></b>^<span id="start">e</span>',
				this.rangeMoveToClosestEditable( '<b><i>editable</i></b><span id="start">e</span>' ) );
		},

		test_moveToClosestEditable4: function() {
			assert.areSame( 'editable<br />^<span id="start">e</span>',
				this.rangeMoveToClosestEditable( 'editable<br /><span id="start">e</span>' ) );
		},

		test_moveToClosestEditable5: function() {
			assert.areSame( '<hr />^<span id="start">e</span>',
				this.rangeMoveToClosestEditable( '<hr /><span id="start">e</span>' ) );
		},

		test_moveToClosestEditable6a: function() {
			assert.areSame( '<span id="start">e</span>^<div>f</div>',
				this.rangeMoveToClosestEditable( '<span id="start">e</span><div>f</div>', true ) );
		},

		test_moveToClosestEditable6b: function() {
			assert.areSame( '<div id="start">e</div><div>^<b>f</b></div>',
				this.rangeMoveToClosestEditable( '<div id="start">e</div><div><b>f</b></div>', true ) );
		},

		test_moveToClosestEditable6c: function() {
			assert.areSame( '<div>f</div>^<span id="start">e</span>',
				this.rangeMoveToClosestEditable( '<div>f</div><span id="start">e</span>' ) );
		},

		test_moveToClosestEditable6d: function() {
			assert.areSame( '<div><b>f</b>^</div><div id="start">e</div>',
				this.rangeMoveToClosestEditable( '<div><b>f</b></div><div id="start">e</div>' ) );
		},

		test_moveToClosestEditable7: function() {
			assert.areSame( '<div>editable^<div><div id="start">e</div></div></div>',
				this.rangeMoveToClosestEditable( '<div>editable<div><div id="start">e</div></div></div>' ) );
		},

		test_moveToClosestEditable8a: function() {
			assert.areSame( '<p>foo</p>[<div contenteditable="false">x</div>]<div contenteditable="false" id="start">y</div>',
				this.rangeMoveToClosestEditable( '<p>foo</p><div contenteditable="false">x</div><div contenteditable="false" id="start">y</div>' ) );
		},

		test_moveToClosestEditable8b: function() {
			assert.areSame( '<div contenteditable="false" id="start">x</div>[<div contenteditable="false">y</div>]<p>foo</p>',
				this.rangeMoveToClosestEditable( '<div contenteditable="false" id="start">x</div><div contenteditable="false">y</div><p>foo</p>', true ) );
		},

		test_moveToClosestEditable8c: function() {
			assert.areSame( '<p>foo<span contenteditable="false">x</span>^</p><div contenteditable="false" id="start">y</div>',
				this.rangeMoveToClosestEditable( '<p>foo<span contenteditable="false">x</span></p><div contenteditable="false" id="start">y</div>' ) );
		},

		test_moveToClosestEditable8d: function() {
			assert.areSame( '<div contenteditable="false" id="start">x</div><p>^<span contenteditable="false">y</span></p>',
				this.rangeMoveToClosestEditable( '<div contenteditable="false" id="start">x</div><p><span contenteditable="false">y</span></p>', true ) );
		},

		test_moveToClosestEditable8e: function() {
			assert.areSame( '<p>foo</p>[<ul contenteditable="false"><li>x</li></ul>]<div contenteditable="false" id="start">y</div>',
				this.rangeMoveToClosestEditable( '<p>foo</p><ul contenteditable="false"><li>x</li></ul><div contenteditable="false" id="start">y</div>' ) );
		},

		test_moveToClosestEditable9a: function() {
			assert.areSame( '<p>bom<span contenteditable="false">foo</span>^<span id="start">bar</span></p>',
				this.rangeMoveToClosestEditable( '<p>bom<span contenteditable="false">foo</span><span id="start">bar</span></p>' ) );
		},

		test_moveToClosestEditable9b: function() {
			assert.areSame( '<p><span contenteditable="false">foo</span>^<span contenteditable="false" id="start">bar</span></p>',
				this.rangeMoveToClosestEditable( '<p><span contenteditable="false">foo</span><span contenteditable="false" id="start">bar</span></p>' ) );
		},

		test_moveToClosestEditable9c: function() {
			assert.areSame( '<p><span id="start">foo</span>^<span contenteditable="false">bar</span>bom</p>',
				this.rangeMoveToClosestEditable( '<p><span id="start">foo</span><span contenteditable="false">bar</span>bom</p>', true ) );
		},

		test_moveToClosestEditable9d: function() {
			assert.areSame( '<p><span contenteditable="false" id="start">foo</span>^<span contenteditable="false">bar</span></p>',
				this.rangeMoveToClosestEditable( '<p><span contenteditable="false" id="start">foo</span><span contenteditable="false">bar</span></p>', true ) );
		},

		test_moveToClosestEditable10a: function() {
			assert.areSame( '<p>^<span contenteditable="false" id="start">bar</span></p>',
				this.rangeMoveToClosestEditable( '<p><span contenteditable="false" id="start">bar</span></p>' ) );
		},

		test_moveToClosestEditable10b: function() {
			assert.areSame( '<p><span contenteditable="false" id="start">bar</span>^</p>',
				this.rangeMoveToClosestEditable( '<p><span contenteditable="false" id="start">bar</span></p>', true ) );
		},

		test_moveToClosestEditable11a: function() {
			assert.areSame( '<div><div contenteditable="false" id="start">bar</div></div>',
				this.rangeMoveToClosestEditable( '<div><div contenteditable="false" id="start">bar</div></div>', false, false ) );
		},

		test_moveToClosestEditable11b: function() {
			assert.areSame( '<div><div contenteditable="false" id="start">bar</div></div>',
				this.rangeMoveToClosestEditable( '<div><div contenteditable="false" id="start">bar</div></div>', true, false ) );
		},

		test_moveToClosestEditable11c: function() {
			assert.areSame( '<div contenteditable="false" id="start">bar</div>',
				this.rangeMoveToClosestEditable( '<div contenteditable="false" id="start">bar</div>', false, false ) );
		},

		test_moveToClosestEditable11d: function() {
			assert.areSame( '<div contenteditable="false" id="start">bar</div>',
				this.rangeMoveToClosestEditable( '<div contenteditable="false" id="start">bar</div>', true, false ) );
		},

		test_moveToClosestEditable12a: function() {
			assert.areSame( '<div data-cke-temp="1">foo</div><div id="start">e</div>',
				this.rangeMoveToClosestEditable( '<div data-cke-temp="1">foo</div><div id="start">e</div>', false, false ) );
		},

		test_moveToClosestEditable12b: function() {
			assert.areSame( '<div id="start">e</div><div data-cke-temp="1">foo</div>',
				this.rangeMoveToClosestEditable( '<div id="start">e</div><div data-cke-temp="1">foo</div>', true, false ) );
		},

		test_moveToClosestEditable13a: function() {
			assert.areSame( '<div>^<span id="start">e</span>foo</div>',
				this.rangeMoveToClosestEditable( '<div><span id="start">e</span>foo</div>' ) );
		},

		test_moveToClosestEditable13b: function() {
			assert.areSame( '<div>foo<span id="start">e</span>^</div>',
				this.rangeMoveToClosestEditable( '<div>foo<span id="start">e</span></div>', true ) );
		},

		test_moveToClosestEditable14a: function() {
			assert.areSame( '<p>foo^</p><span data-cke-bookmark="1" style="display:none;">&nbsp;</span><div id="start">e</div>',
				this.rangeMoveToClosestEditable( '<p>foo</p><span data-cke-bookmark="1" style="display:none;">&nbsp;</span><div id="start">e</div>' ) );
		},

		test_moveToClosestEditable14b: function() {
			assert.areSame( '<div id="start">e</div><span data-cke-bookmark="1" style="display:none;">&nbsp;</span><p>^foo</p>',
				this.rangeMoveToClosestEditable( '<div id="start">e</div><span data-cke-bookmark="1" style="display:none;">&nbsp;</span><p>foo</p>', true ) );
		},

		test_moveToClosestEditable15a: function() {
			assert.areSame( '<ul><li>foo^</li></ul><div id="start">e</div>',
				this.rangeMoveToClosestEditable( '<ul><li>foo</li></ul><div id="start">e</div>' ) );
		},

		test_moveToClosestEditable15b: function() {
			assert.areSame( '<div id="start">e</div><ul><li>^foo</li></ul>',
				this.rangeMoveToClosestEditable( '<div id="start">e</div><ul><li>foo</li></ul>', true ) );
		},

		test_moveToClosestEditable16a: function() {
			assert.areSame( '<table><tbody><tr><td>foo^</td></tr></tbody></table><div id="start">e</div>',
				this.rangeMoveToClosestEditable( '<table><tbody><tr><td>foo</td></tr></tbody></table><div id="start">e</div>' ) );
		},

		test_moveToClosestEditable16b: function() {
			assert.areSame( '<div id="start">e</div><table><tbody><tr><td>^foo</td></tr></tbody></table>',
				this.rangeMoveToClosestEditable( '<div id="start">e</div><table><tbody><tr><td>foo</td></tr></tbody></table>', true ) );
		},

		test_moveToClosestEditable17a: function() {
			assert.areSame( '<div>foo^</div><div id="start">bar</div>',
				this.rangeMoveToClosestEditable( '<div>foo</div>\n \n<div id="start">bar</div>' ) );
		},

		test_moveToClosestEditable17b: function() {
			assert.areSame( '<div id="start">bar</div><div>^foo</div>',
				this.rangeMoveToClosestEditable( '<div id="start">bar</div>\n \n<div>foo</div>', true ) );
		},

		test_moveToClosestEditable19a: function() {
			if ( CKEDITOR.env.ie )
				assert.ignore();

			assert.areSame( '<div id="start">bar</div><p>^<br /></p>',
				this.rangeMoveToClosestEditable( '<div id="start">bar</div><p><br /></p>', true ) );
		},

		test_moveToClosestEditable19b: function() {
			if ( !CKEDITOR.env.ie )
				assert.ignore();

			assert.areSame( '<div id="start">bar</div><p>^&nbsp;</p>',
				this.rangeMoveToClosestEditable( '<div id="start">bar</div><p>&nbsp;</p>', true ) );
		},

		test_moveToClosestEditable20a: function() {
			assert.areSame( '<p>foo</p><hr />^<p id="start">bar</p>',
				this.rangeMoveToClosestEditable( '<p>foo</p><hr /><p id="start">bar</p>' ) );
		},

		test_moveToClosestEditable20b: function() {
			assert.areSame( '<p contenteditable="false">foo</p><hr />^<p id="start">bar</p>',
				this.rangeMoveToClosestEditable( '<p contenteditable="false">foo</p><hr /><p id="start">bar</p>' ) );
		},

		test_moveToClosestEditable20c: function() {
			assert.areSame( '<hr />^<p id="start">bar</p>',
				this.rangeMoveToClosestEditable( '<hr /><p id="start">bar</p>' ) );
		},

		test_moveToClosestEditable21a: function() {
			assert.areSame( '<p id="start">foo</p>^<hr /><p>bar</p>',
				this.rangeMoveToClosestEditable( '<p id="start">foo</p><hr /><p>bar</p>', true ) );
		},

		test_moveToClosestEditable21b: function() {
			assert.areSame( '<p id="start">foo</p>^<hr /><p contenteditable="false">bar</p>',
				this.rangeMoveToClosestEditable( '<p id="start">foo</p><hr /><p contenteditable="false">bar</p>', true ) );
		},

		test_moveToClosestEditable21c: function() {
			assert.areSame( '<p id="start">foo</p>^<hr />',
				this.rangeMoveToClosestEditable( '<p id="start">foo</p><hr />', true ) );
		},

		// Special case which we need to be certain because #11861 bases on this.
		'test moveToClosestEditablePosition returns range anchored next to hr': function() {
			var ct = doc.getById( 'editable_playground' );
			ct.setHtml( '<p>foo</p><hr /><p id="start">bar</p>' );

			var startNode = doc.getById( 'start' ),
				range = new CKEDITOR.dom.range( ct );

			range.moveToClosestEditablePosition( startNode );

			assert.areSame( ct, range.startContainer, 'startContainer' );
			assert.isTrue( range.startContainer.getChild( range.startOffset - 1 ).is( 'hr' ), 'range is anchored next to hr' );
		}
	};

	bender.test( tests );
} )();