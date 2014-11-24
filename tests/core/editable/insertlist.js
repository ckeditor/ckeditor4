/* bender-tags: editor,unit,insertion */
/* global insertionDT */

( function() {
	'use strict';

	insertionDT.run( {
		autoParagraph: false,
		allowedContent: true
	}, {

		'insert list into the start/end of list item': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );
			a.insertion = '<ol><li>foo</li><li>bar</li></ol>';
			a( '<ol><li>^foo</li><li>bar</li></ol>', '<ol><li>foo</li><li>bar^</li><li>foo</li><li>bar</li></ol>' );

			a.insertion = '<ol><li>baz</li><li>quz</li></ol>';
			a( '<ol><li>foo^</li><li>bar</li></ol>', '<ol><li>foo</li><li>baz</li><li>quz^</li><li>bar</li></ol>' );
		},

		'insert list into the start/end of list item with block': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );
			a.insertion = '<ol><li>baz</li></ol>';
			a( '<ol><li><p>^foo</p></li><li>bar</li></ol>', '<ol><li>baz^</li><li><p>foo</p></li><li>bar</li></ol>' );

			a.insertion = '<ol><li>baz</li></ol>';
			a( '<ol><li><p>foo^</p></li><li>bar</li></ol>', '<ol><li><p>foo</p></li><li>baz^</li><li>bar</li></ol>' );
		},

		'insert list with sublist into the start/end of list item': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );
			a.insertion = '<ol><li>baz<ol><li>quz</li></ol></li></ol>';
			a( '<ol><li>foo^</li></ol>', '<ol><li>foo</li><li>baz<ol><li>quz^</li></ol></li></ol>' );

			a.insertion = '<ol><li>baz<ol><li>quz</li></ol></li></ol>';
			a( '<ol><li>^foo</li></ol>', '<ol><li>baz<ol><li>quz^</li></ol></li><li>foo</li></ol>' );
		},

		'insert into middle of list item': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );
			a.insertion = '<ol><li>quz</li></ol>';
			a( '<ol><li>foo^bar</li></ol>', '<ol><li>foo</li><li>quz^</li><li>bar</li></ol>', 'list block' );
			a( '<ol><li><p>foo^bar</p></li></ol>', '<ol><li><p>foo</p></li><li>quz^</li><li><p>bar</p></li></ol>', 'text block' );
		},

		'insert different type of list': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );

			a.insertion = '<ol><li>bar</li></ol>';
			a( '<ul><li>foo^</li></ul>', '<ul><li>foo</li><li>bar^</li></ul>' );
		},

		'insert list items': function() {
			var a = this.createAssertInsertionFunction( 'div,body', null, 'html' );

			a.insertion = '<li>foo</li><li>bar</li>';
			a( '<ul><li>bom^</li></ul>', '<ul><li>bom</li><li>foo</li><li>bar^</li></ul>' );

			// Incomplete selection of first line result with pseudoblock.
			if ( CKEDITOR.env.ie ) {
				a.insertion = 'foo<li>bar</li>';
				a( '<ul><li>bom^</li></ul>', '<ul><li>bomfoo</li><li>bar^</li></ul>' );
			}
		}

	} );

} )();