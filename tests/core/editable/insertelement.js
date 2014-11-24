/* bender-tags: editor,unit,insertion */
/* global insertionDT */

( function() {
	'use strict';

	insertionDT.run( {
		allowedContent: true
	}, {
		// Rules:
		// TODO

		//
		// TC group 1.
		// text -> text
		//

		'G1. inline': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '', 'insertElement' );

			a.insertion = '<b>baz<i>quz</i></b>';
			a( '<p>foo^bar</p>',				'<p>foo<b>baz<i>quz</i></b>^bar</p>' );
		},

		'G1. inline into blockless': function() {
			var a = this.createAssertInsertionFunction( 'h1', '<b>baz<i>quz</i></b>', 'insertElement' );

			a( 'foo^bar',						'foo<b>baz<i>quz</i></b>^bar' );
		},

		'G2. block': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '', 'insertElement' );

			a.insertion = '<p>baz</p>';
			a( '<p>text^</p>',					'<p>text</p><p>baz</p><p>^&nbsp;</p>',		'paragraph into end of paragraph' );
			a( '<p>foo^bar</p>',				'<p>foo</p><p>baz</p><p>^bar</p>',			'paragraph into middle of paragraph' );

			a.insertion = '<hr />';
			a( '<p>text^</p>',					'<p>text</p><hr /><p>^&nbsp;</p>',			'hr into end of paragraph' );
			a( '<p>foo^bar</p>',				'<p>foo</p><hr /><p>^bar</p>',				'hr into middle of paragraph' );

		},

		'G2. block - inserted at the end of block limit': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '', 'insertElement' );

			a.insertion = '<p>baz</p>';
			a( '<div>foo^</div><p>bar</p>', '<div>foo<p>baz</p><p>^&nbsp;</p></div><p>bar</p>', 'open new block (1)' );
			a( '<p>foo</p><ul><li>^</li></ul>', '<p>foo</p><ul><li><p>baz</p><p>^&nbsp;</p></li></ul>', 'open new block (2)' );
			a( '<div>^<p>foo</p></div><p>bar</p>', '<div><p>baz</p><p>^foo</p></div><p>bar</p>', 'move to next (1)' );
			a( '<ul><li>foo^<ol><li>bar</li></ol></li></ul>', '<ul><li>foo<p>baz^</p><ol><li>bar</li></ol></li></ul>', 'move to next (2)' );
		},

		'G3. table/list': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '', 'insertElement' );

			a.insertion = '<table><tr><td>1.1</td><td>1.2</td></tr></table>';
			a( '<p>foo^bar</p>', '<p>foo</p><table><tbody><tr><td>1.1</td><td>1.2</td></tr></tbody></table><p>^bar</p>' );
			a( '<p>text</p><p>^</p>', '<p>text</p><table><tbody><tr><td>1.1</td><td>1.2</td></tr></tbody></table><p>^&nbsp;</p>' );

			a.insertion = '<ul><li>1.1</li><li>1.2</li></ul>';
			a( '<p>foo^bar</p>', '<p>foo</p><ul><li>1.1</li><li>1.2</li></ul><p>^bar</p>' );
			a( '<p>text</p><p>^</p>', '<p>text</p><ul><li>1.1</li><li>1.2</li></ul><p>^&nbsp;</p>' );
		},

		'GS. insertions into table - inline': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<b>foo</b>', 'insertElement' ),
				ts = '<table><tbody>',
				te = '</tbody></table>',
				r = '<tr><td>r1</td><td>r2</td></tr>';

			a(	ts + '<tr><td>x^y</td></tr>' + te,
				ts + '<tr><td>x<b>foo</b>^y</td></tr>' + te,												'collapsed' );
			a(	ts + r + '<tr><td>x[y</td><td>y]z</td></tr>' + r + te,
				ts + r + '<tr><td>x<b>foo</b>^z</td></tr>' + r + te,										'one row' );
			// Result of this test is incorrect, however it doesn't test correctness, but stableness (#11183).
			a(	ts + r + '<tr><td>[a1</td><td>a2</td></tr><tr><td>b1</td><td>b2]</td></tr>' + r + te,
				ts + '<tr><td>r1</td><td>r2</td><td><b>foo</b>^</td><td>&nbsp;</td></tr>' + r + te, 'two rows' );
		},

		'GS. insertions into table - block': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<hr />', 'insertElement' ),
				ts = '<table><tbody>',
				te = '</tbody></table>',
				r = '<tr><td>r1</td><td>r2</td></tr>',
				hr = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? '<hr /> ' : '<hr />';

			a(	ts + '<tr><td>x^y</td></tr>' + te,
				ts + '<tr><td>x' + hr + '^y</td></tr>' + te,													'collapsed' );
			a(	ts + r + '<tr><td>x[y</td><td>y]z</td></tr>' + r + te,
				ts + r + '<tr><td>x' + hr + '^z</td></tr>' + r + te,											'one row' );
			a(	ts + r + '<tr><td>[a1</td><td>a2</td></tr><tr><td>b1</td><td>b2]</td></tr>' + r + te,
				ts + '<tr><td>r1</td><td>r2</td><td><hr /><p>^&nbsp;</p></td><td>&nbsp;</td></tr>' + r + te, 'two rows' );
		},

		'GS. insertions into table - non-editable inline': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<b contenteditable="false">foo</b>', 'insertElement' ),
				ts = '<table><tbody>',
				te = '</tbody></table>',
				r = '<tr><td>r1</td><td>r2</td></tr>';

			a(	ts + '<tr><td>x^y</td></tr>' + te,
				ts + '<tr><td>x<b contenteditable="false">foo</b>^y</td></tr>' + te,						'collapsed - middle' );

			a(	ts + '<tr><td>x^</td></tr>' + te,
				ts + '<tr><td>x<b contenteditable="false">foo</b>^</td></tr>' + te,							'collapsed - boundary' );

			a(	ts + r + '<tr><td>x[y</td><td>y]z</td></tr>' + r + te,
				ts + r + '<tr><td>x<b contenteditable="false">foo</b>^z</td></tr>' + r + te,				'one row' );
		},

		'GS. insertions into table - non-editable block': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p contenteditable="false">foo</p>', 'insertElement' ),
				ts = '<table><tbody>',
				te = '</tbody></table>',
				r = '<tr><td>r1</td><td>r2</td></tr>';

			a(	ts + '<tr><td>x^y</td></tr>' + te,
				ts + '<tr><td>x<p contenteditable="false">foo</p>^y</td></tr>' + te,						'collapsed - middle' );

			// #11798
			a(	ts + '<tr><td>x^</td></tr>' + te,
				ts + '<tr><td>x<p contenteditable="false">foo</p><p>^&nbsp;</p></td></tr>' + te,			'collapsed - boundary' );

			a(	ts + r + '<tr><td>x[y</td><td>y]z</td></tr>' + r + te,
				ts + r + '<tr><td>x<p contenteditable="false">foo</p>^z</td></tr>' + r + te,				'one row' );
		}
	} );

} )();