/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document;

	var tests =
	{
		rangeMoveToElementEditablePosition: function( html, isMoveToEnd, retValue ) {
			if ( retValue == undefined )
				retValue = true;

			var ct = doc.getById( 'editable_playground' );
			ct.setHtml( html );
			var range = new CKEDITOR.dom.range( doc );
			assert.areSame( retValue, !!range.moveToElementEditablePosition( ct, isMoveToEnd ), 'Method returned value' );

			if ( retValue )
				return bender.tools.fixHtml( bender.tools.getHtmlWithRanges( ct, new CKEDITOR.dom.rangeList( [ range ] ) ) );
			else {
				assert.isFalse( !!range.startContainer, 'Start container is not set if method returned false' );
				return bender.tools.fixHtml( ct.getHtml() );
			}
		},

		test_moveToElementEditStart : function() {
			assert.areSame( '<table><thead><tr><th>^editable</th></tr></thead><tbody></tbody></table>',
				this.rangeMoveToElementEditablePosition( '<table><thead><tr><th>editable</th></tr></thead><tbody></tbody></table>' ) );
		},

		test_moveToElementEditStart2 : function() {
			assert.areSame( '<ul><li>^<br />editable</li></ul>',
				this.rangeMoveToElementEditablePosition( '<ul><li><br />editable</li></ul>' ) );
		},

		test_moveToElementEditStart3 : function() {
			assert.areSame( '<table><tbody><tr><td><ul><li><a href="javascript:void(0)"><strong>^editable</strong></a></li></ul></td></tr></tbody></table>',
				this.rangeMoveToElementEditablePosition( '<table><tbody><tr><td><ul><li><a href="javascript:void(0)"><strong>editable</strong></a></li></ul></td></tr></tbody></table>' ) );
		},

		test_moveToElementEditStart4 : function() {
			assert.areSame( '^<hr />editable4',
				this.rangeMoveToElementEditablePosition( '<hr />editable4' ) );
		},

		test_moveToElementEditStart5 : function() {
			assert.areSame( '^<textarea>non editable</textarea>editable',
				this.rangeMoveToElementEditablePosition( '<textarea>non editable</textarea>editable' ) );
		},

		test_moveToElementEditStart6 : function() {
			assert.areSame( '<span data-cke-bookmark="1" style="display:none;">&nbsp;</span>^foo',
				this.rangeMoveToElementEditablePosition( '<span data-cke-bookmark="1" style="display:none;">&nbsp;</span>foo' ) );
		},

		test_moveToElementEditStart8a : function() {
			assert.areSame( '<span data-cke-temp="1">bar</span><span data-cke-temp="1">bar</span>^foo',
				this.rangeMoveToElementEditablePosition( '<span data-cke-temp="1">bar</span><span data-cke-temp="1">bar</span>foo' ) );
		},

		test_moveToElementEditStart8 : function() {
			assert.areSame( '<span data-cke-temp="1">bar</span>^foo<span data-cke-temp="1">bar</span>',
				this.rangeMoveToElementEditablePosition( '<span data-cke-temp="1">bar</span>foo<span data-cke-temp="1">bar</span>' ) );
		},

		test_moveToElementEditStart9 : function() {
			assert.areSame( '<span data-cke-temp="1">bar</span>^foo<span data-cke-temp="1">bar</span>',
				this.rangeMoveToElementEditablePosition( '<span data-cke-temp="1">bar</span>foo<span data-cke-temp="1">bar</span>' ) );
		},

		test_moveToElementEditStart10 : function() {
			assert.areSame( '<span data-cke-temp="1">bar</span>foo^<span data-cke-temp="1">bar</span>',
				this.rangeMoveToElementEditablePosition( '<span data-cke-temp="1">bar</span>foo<span data-cke-temp="1">bar</span>', true ) );
		},

		test_moveToElementEditStart12a : function() {
			assert.areSame( '<div><p>^foo</p></div>',
				this.rangeMoveToElementEditablePosition( '<div><p>foo</p></div>' ) );
		},

		test_moveToElementEditStart12b : function() {
			assert.areSame( '<div><p>foo^</p></div>',
				this.rangeMoveToElementEditablePosition( '<div><p>foo</p></div>', true ) );
		},

		test_moveToElementEditStart13a : function() {
			assert.areSame( '[<div contenteditable="false">x</div>]<div contenteditable="false">y</div><p>foo</p>',
				this.rangeMoveToElementEditablePosition( '<div contenteditable="false">x</div><div contenteditable="false">y</div><p>foo</p>' ) );
		},

		test_moveToElementEditStart13b : function() {
			assert.areSame( '<div contenteditable="false">x</div><p>foo</p>[<div contenteditable="false">y</div>]',
				this.rangeMoveToElementEditablePosition( '<div contenteditable="false">x</div><p>foo</p><div contenteditable="false">y</div>', true ) );
		},

		test_moveToElementEditStart13c : function() {
			assert.areSame( '<div>[<div contenteditable="false">x</div>]<p>foo</p></div>',
				this.rangeMoveToElementEditablePosition( '<div><div contenteditable="false">x</div><p>foo</p></div>' ) );
		},

		test_moveToElementEditStart14a : function() {
			assert.areSame( '<p>^<span contenteditable="false">foo</span></p>',
				this.rangeMoveToElementEditablePosition( '<p><span contenteditable="false">foo</span></p>' ) );
		},

		test_moveToElementEditStart14b : function() {
			assert.areSame( '<p><span contenteditable="false">foo</span>^</p>',
				this.rangeMoveToElementEditablePosition( '<p><span contenteditable="false">foo</span></p>', true ) );
		},

		test_moveToElementEditStart14c : function() {
			assert.areSame( '<div>^<span contenteditable="false">foo</span>bar</div>',
				this.rangeMoveToElementEditablePosition( '<div><span contenteditable="false">foo</span>bar</div>' ) );
		},

		test_moveToElementEditStart14d : function() {
			assert.areSame( '<div>bar<span contenteditable="false">foo</span>^</div>',
				this.rangeMoveToElementEditablePosition( '<div>bar<span contenteditable="false">foo</span></div>', true ) );
		},

		test_moveToElementEditStart16a : function() {
			assert.areSame( '[<div contenteditable="false">x</div>]',
				this.rangeMoveToElementEditablePosition( '<div contenteditable="false">x</div>' ) );
		},

		test_moveToElementEditStart16b : function() {
			assert.areSame( '[<div contenteditable="false">x</div>]',
				this.rangeMoveToElementEditablePosition( '<div contenteditable="false">x</div>', true ) );
		},

		test_moveToElementEditStart16c : function() {
			assert.areSame( '<div>[<div contenteditable="false">x</div>]</div>',
				this.rangeMoveToElementEditablePosition( '<div><div contenteditable="false">x</div></div>' ) );
		},

		test_moveToElementEditStart16d : function() {
			assert.areSame( '<div>[<div contenteditable="false">x</div>]</div>',
				this.rangeMoveToElementEditablePosition( '<div><div contenteditable="false">x</div></div>', true ) );
		},

		test_moveToElementEditStart16e : function() {
			assert.areSame( '[<ul contenteditable="false"><li>x</li></ul>]',
				this.rangeMoveToElementEditablePosition( '<ul contenteditable="false"><li>x</li></ul>' ) );
		},

		test_moveToElementEditStart16f : function() {
			assert.areSame( '[<table contenteditable="false"><tbody><tr><td>x</td></tr></tbody></table>]',
				this.rangeMoveToElementEditablePosition( '<table contenteditable="false"><tbody><tr><td>x</td></tr></tbody></table>' ) );
		},

		test_moveToElementEditStart17a : function() {
			assert.areSame( '<ul><li>^editable</li></ul>',
				this.rangeMoveToElementEditablePosition( '<ul> \n<li>editable</li></ul>' ) );
		},

		test_moveToElementEditStart17b : function() {
			assert.areSame( '<div>[<div contenteditable="false">x</div>]</div>',
				this.rangeMoveToElementEditablePosition( '<div>  \t <div contenteditable="false">x</div>\n\n</div>' ) );
		},

		test_moveToElementEditStart17c : function() {
			assert.areSame( '<ul><li>editable^</li></ul>',
				this.rangeMoveToElementEditablePosition( '<ul><li>editable</li>  \n \n</ul>', true ) );
		},

		test_moveToElementEditStart17d: function() {
			assert.areSame( '<div>[<div contenteditable="false">x</div>]</div>',
				this.rangeMoveToElementEditablePosition( '<div>  \t <div contenteditable="false">x</div>\n\n</div>', true ) );
		}
	};

	bender.test( tests );
} )();