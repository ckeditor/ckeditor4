/* bender-tags: editor,unit */

function parseHtml( raw, parent ) {
	var fragment = CKEDITOR.htmlParser.fragment.fromHtml( raw, parent || 'body', 'p' ),
		writer = new CKEDITOR.htmlParser.basicWriter();

	fragment.writeChildrenHtml( writer );
	return writer.getHtml( true );
}

bender.test( {
	test_parser_1: function() {
		assert.areSame( '<p><b>2</b> Test</p><table><tr><td>1</td><td>3</td></tr></table>',
						parseHtml( '<table><tr><td>1</td><p><b>2</b> Test</p><td>3</td></tr></table>' ) );
	},

	test_parser_2: function() {
		assert.areSame( '<table><tr><td><b>1</b></td><td><b>2</b></td></tr></table>',
						parseHtml( '<b><table><tr><td>1</td><td>2</td></tr></table></b>' ) );
	},

	test_parser_3_1: function() {
		assert.areSame( '<p><b><i>Table:</i></b></p><table><tr><td><b><i>1</i></b></td><td><b><i>2</i></b></td></tr></table>',
						parseHtml(	'<b><i>Table:<table><tr><td>1</td><td>2</td></tr></table></i></b>' ) );
	},

	test_parser_3_2: function() {
		assert.areSame( '<table><tr><td><b><i>1</i></b></td><td><b><i>2</i></b></td></tr></table><p><b><i>Table</i></b></p>',
						parseHtml(	'<b><i><table><tr><td>1</td><td>2</td></tr></table>Table</i></b>' ) );
	},

	test_parser_4: function() {
		assert.areSame( '<p><b><i>Test</i></b></p>',
						parseHtml( '<b><i>Test' ) );
	},

	test_parser_5: function() {
		assert.areSame( '<p>Para 1</p><p>Para 2</p><p>Para 3</p>',
						parseHtml( '<p>Para 1<p>Para 2<p>Para 3' ) );
	},

	test_parser_6: function() {
		assert.areSame( '<p><b>A</b><i>B</i></p>',
						parseHtml( '<b>A</b><i>B</i>' ) );
	},

	test_parser_7: function() {
		assert.areSame( '<p>Para 1</p><hr /><p>Para 2</p><h1>Para 3</h1>',
						parseHtml( '<p>Para 1<hr>Para 2<h1>Para 3' ) );
	},

	/**
	 * Test remove empty inline element.
	 */
	test_parser_8: function() {
		assert.areSame( '<p>text</p>',
						parseHtml( '<p><b></b>text</p>' ) );
	},

	/**
	 *  Test remove multiple empty inline elements.
	 */
	test_parser_8_2: function() {
		assert.areSame( '<p>text</p>',
						parseHtml( '<p><b><i></b></i>text</p>' ) );
	},

	/**
	 *  Test remove empty links.
	 */
	test_parser_8_3: function() {
		assert.areSame( '<p>test</p>',
						parseHtml( '<p>test<a href="foo"><a href="bar"></p>' ) );
	},

	/**
	 *  Test keep empty anchors.
	 */
	test_parser_8_4: function() {
		assert.areSame( '<p>test<a name="foo"></a><a name="bar"></a></p>',
						parseHtml( '<p>test<a name="foo"><a name="bar"></p>' ) );

	},

	/**
	 * Test fixing malformed inline element closing.
	 */
	test_parser_9: function() {
		assert.areSame( '<p><b>bold<i>ita</i></b><i>lic</i></p>',
						parseHtml( '<p><b>bold<i>ita</b>lic</i></p>' ) );

	},

	test_parser_10: function() {
		assert.areSame( '<table><tbody><tr><td>A</td></tr></tbody></table>',
						parseHtml( '<table><tbody><tr><td>A<b></b></td></tr></tbody></table>' ) );
	},

	/*
	 *  Leaving table internals intact.
	 */
	test_parser_11: function() {
		assert.areSame( '<td>1</td><tr><td>2</td></tr>',
						parseHtml( '<td>1</td><tr><td>2</td></tr>' ) );
	},

	/*
	 *  Forward lifting invalid table children..
	 */
	test_parser_12: function() {
		assert.areSame( '<p>p1</p><p>p2</p><table><tr><td>c1</td></tr></table>',
						parseHtml( '<table><p>p1</p><tr><td>c1</td></tr><p>p2</p></table>' ) );
	},

	/**
	 * Test fixing malformed nested list structure. (#3828)
	 */
	test_parser_13: function() {
		assert.areSame( '<ul><li><ol></ol></li></ul>',
						parseHtml( '<ul><ol></ol></ul>' ) );
		assert.areSame( '<ul><li>level1<ul><li>level2<ul><li>level3</li></ul></li></ul></li></ul>',
						parseHtml( '<ul><li>level1</li><ul><li>level2</li><ul><li>level3</li></ul></ul></ul>' ) );
	},

	/**
	 * Test fixing orphan list items twice.
	 */
	test_parser_14: function() {
		assert.areSame( '<ul><li>1</li></ul><dl><dt>2</dt><dd>3</dd></dl>',
						parseHtml( '<li>1</li><dt>2</dt><dd>3</dd>' ) );

		assert.areSame( '<ul><li>1</li></ul><dl><dt>2</dt></dl>',
						parseHtml( '<li>1</li><dt>2</dt></ol>' ) );
	},

	/**
	 * Test fixing orphan definition list items.
	 */
	test_parser_14b: function() {
		assert.areSame( '<dl><dt><p>foo</p></dt><dd><p>bar</p></dd></dl>', parseHtml( '<dt><p>foo</p></dt><dd><p>bar</p></dd>' ) );
		assert.areSame( '<dl><dt>foo</dt></dl><td>bar</td>', parseHtml( '<dt><td>bar</td>foo</dt>' ) );
	},

	/**
	 * Test fix body + optional close.
	 */
	test_parser_15: function() {
		assert.areSame( '<p><br /></p>', parseHtml( '<br />' ) );
		assert.areSame( '<p><img /></p>', parseHtml( '<img /></p>' ) );
		assert.areSame( '<p><b>bold</b></p>', parseHtml( '<b>bold</p>' ) );
		assert.areSame( '<p>p1</p>', parseHtml( '<p>p1</div>' ) );
	},

	/**
	 * Test auto paragrahing with different contexts.
	 */
	'test auto paragraphing': function() {
		var editables = [ 'body', 'div', 'h1', 'table' ], ct, dtd, msg;
		for ( var i = 0 ; i < editables.length ; i++ ) {
			ct = editables[ i ];
			dtd = CKEDITOR.dtd[ ct ];
			msg = 'auto paragraphing for editable: ' + ct;

			if ( dtd.p )
				assert.areSame( '<p>foo</p>', parseHtml( 'foo', ct ), msg );
			else if ( ct == 'table' )
				assert.areSame( '<tbody><tr><td>foo</td></tr></tbody>', parseHtml( 'foo', ct ), msg );
			else
				assert.areSame( 'foo', parseHtml( 'foo', ct ), msg );
		}
	},

	'test whitespaces handling': function() {
		var source = '\n foo  ',
			output = '<p>foo</p>';
		assert.areSame( output,			parseHtml( source ),				'default context' );
		assert.areSame( output,			parseHtml( source, 'body' ),		'body context' );
		assert.areSame( output,			parseHtml( source, 'div' ),			'div context' );
		assert.areSame( output,			parseHtml( source, 'figcaption' ),	'figcaption context' );
		assert.areSame( 'foo',			parseHtml( source, 'p' ),			'p context' );


		source = '\n <p>foo</p>  ';
		assert.areSame( output,			parseHtml( source ),				'default context - block edges' );
		assert.areSame( output,			parseHtml( source, 'body' ),		'body context - block edges' );
		assert.areSame( output,			parseHtml( source, 'div' ),			'div context - block edges' );
		assert.areSame( output,			parseHtml( source, 'figcaption' ),	'figcaption context - block edges' );


		source = '<p>foo</p> \n <p>bar</p>';
		output = '<p>foo</p><p>bar</p>';
		assert.areSame( output,			parseHtml( source ),				'default context - between blocks' );
		assert.areSame( output,			parseHtml( source, 'body' ),		'body context - between blocks' );
		assert.areSame( output,			parseHtml( source, 'div' ),			'div context - between blocks' );
		assert.areSame( output,			parseHtml( source, 'figcaption' ),	'figcaption context - between blocks' );
	},

	// Test whitespaces handling in different context. (#3715)
	'parse pre-formatted contents': function() {
		var pre = '<pre>\t\tfoo\nbar quz  \n</pre>',
			textarea = '<p><textarea>\t\tfoo\nbar quz  \n</textarea></p>';

		assert.areSame( pre, parseHtml( pre ) );
		assert.areSame( textarea, parseHtml( textarea ) );
		assert.areSame( '<p><b>foo bar</b></p>', parseHtml( '<p><b>foo   bar</b></p>' ) );
	},


	'parse list and table contents (with context)': function() {
		// Given the list/table as the parent element, parser should not attempt
		// to fix partial content.
		var source = '<li>foo</li><li>bar</li>';
		assert.areSame( source, parseHtml( source, 'ul' ) );

		source = '<li>foo</li><li>bar</li>';
		assert.areSame( source, parseHtml( '<li>foo</li><li>bar</li>', 'ol' ) );

		source = '<dt>foo</dt><dd>bar</dd>';
		assert.areSame( source, parseHtml( '<dt>foo</dt><dd>bar</dd>', 'dl' ) );

		source = '<tr><td>foo</td><td>bar</td></tr>';
		assert.areSame( source, parseHtml( '<tr><td>foo</td><td>bar</td></tr>', 'table' ) );

		source = '<tbody><tr><td>foo</td><td>bar</td></tr></tbody>';
		assert.areSame( source, parseHtml( '<tbody><tr><td>foo</td><td>bar</td></tr></tbody>', 'table' ) );

		source = '<caption>foo</caption>';
		assert.areSame( source, parseHtml( '<caption>foo</caption>', 'table' ) );
	},

	'parse pre and textarea contents (with context)': function() {
		// Given the pre/textarea as context, parser should preserve all white spaces.
		var source = '\t\tfoo\nbar quz  \n';

		assert.areSame( source, parseHtml( source, 'pre' ) );
		assert.areSame( source, parseHtml( source, 'textarea' ) );
	},

	'parser orphan text in list/table.': function() {
		assert.areSame( '<ul><li><strong>foo</strong>bar</li></ul>',
						parseHtml( '<ul><strong>foo</strong>bar</ul>' ) );
		assert.areSame( '<ul><li>foo</li><li>bar</li></ul>',
						parseHtml( '<ul>foo<li>bar</li></ul>' ) );
		assert.areSame( '<table><tbody><tr><td><strong>foo</strong>bar</td></tr></tbody></table>',
						parseHtml( '<table><strong>foo</strong>bar</table>' ) );
		assert.areSame( '<table><tbody><tr><td><strong>foo</strong></td><td>bar</td></tr></tbody></table>',
						parseHtml( '<table><strong>foo</strong><td>bar</td></table>' ) );
		assert.areSame( '<table><tbody><tr><td><strong>foo</strong></td></tr><tr><td>bar</td></tr></tbody></table>',
						parseHtml( '<table><strong>foo</strong><tr>bar</tr></table>' ) );
		assert.areSame( '<tr><td>foo</td></tr>', parseHtml( '<tr>foo</tr>' ) );

		// #11660
		assert.areSame( '<table><tbody><tr><td>1</td></tr><tr><td>Issue2</td></tr><tr><td>3</td></tr></tbody></table>',
			parseHtml( '<table><tbody><tr><td>1</td></tr>Issue2<tr><td>3</td></tr></tbody></table>' ) );
	},

	'test parser fix inline outside of block element': function() {
		assert.areSame( '<p>Line 1</p><p><b>Line 2</b></p><p><b>Line 3</b></p><p><b>Line 4</b></p><p>Line 5</p>',
						parseHtml( '<p>Line 1</p><b><p>Line 2</p><p>Line 3</p><p>Line 4</p></b><p>Line 5</p>' ) );
	},

	/**
	 *  Test fixing paragraph inside table row.
	 */
	test_ticket_3195: function() {
		assert.areSame( '<p>2</p><table><tr><td>1</td><td>3</td></tr></table>',
						parseHtml( '<table><tr><td>1</td><p>2</p><td>3</td></tr></table>' ) );
	},

	/**
	 *  Test fixing paragraph inside list.
	 */
	test_ticket_3195_2: function() {
		assert.areSame( '<p>2</p><ul><li>1</li><li>3</li></ul>',
						parseHtml( '<ul><li>1</li><p>2</p><li>3</li></ul>' ) );
	},

	/**
	 *  Test fixing 'div' inside paragraph.
	 */
	test_ticket_3195_3: function() {
		assert.areSame( '<p>1</p><div>2</div><p><span>3</span></p>',
						parseHtml( '<p>1<div>2</div><span>3</span></p>' ) );
	},

	test_ticket_3441: function() {
		assert.areSame( '<p><b>Test</b></p><script type="test">var a = "<A Href=xxx>Testing</ A>";\nGo();<\/script>',
						parseHtml( '<p><b>Test</b></p><script type="test">var a = "<A Href=xxx>Testing</ A>";\nGo();<\/script>' ) );
	},

	test_ticket_3585: function() {
		assert.areSame( '<p><br /></p>', parseHtml( '<p><br />\t\r\n</p>' ) );
	},

	test_ticket_3585_1: function() {
		assert.areSame( '<p><br />text</p>', parseHtml( '<p><br />text\t\r\n</p>' ) );
	},

	test_ticket_3585_2: function() {
		assert.areSame( '<p><b>inline </b></p><p>paragraph</p>', parseHtml( '<b>inline </b>\n<p>paragraph\t\r\n</p>\t\r\n' ) );
	},

	test_ticket_3744: function() {
		assert.areSame( '<div><b><font><span>A</span></font></b></div><div>X</div>',
						parseHtml( '<div><b><font><span>A</font></span></b></div><div>X</div>' ) );
	},

	// #3862
	'test not breaking on malformed close tag': function() {
		assert.areSame(
			'<p><span><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a>' +
			'<a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a>' +
			'<a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a><a><b>test</b></a>' +
			'<a><b>test</b></a></span></p>',
			parseHtml(
				'<p><span><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b>' +
				'<a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b>' +
				'<a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b><a><b>test</a></b>' +
				'<a><b>test</a></b></span></p>'
			)
		);
	},


	test_ticket_5788: function() {
		assert.areSame( '<p>test<br />whitespace</p>', parseHtml( '<p>test<br /> whitespace</p>' ) );
		assert.areSame( '<div><p>paragraph</p>pseudo</div>', parseHtml( '<div><p>paragraph</p> pseudo</div>' ) );
		assert.areSame( '<div>pseudo<p>paragraph</p></div>', parseHtml( '<div>pseudo <p>paragraph</p></div>' ) );
	},

	// #5626
	'test parser fix partial list items': function() {
		assert.areSame( '<table><tr><td><ul><li>item1</li><li>item2</li></ul></td></tr></table>',
						parseHtml( '<table><tr><td><li>item1</li><li>item2</li></td></tr></table>' ) );
		assert.areSame( '<body><p>text</p><ul><li>cell</li></ul></body>',
						parseHtml( '<body>text<li>cell</li></body>', 'html' ) );
		assert.areSame( '<ul><li>item1</li><li>item2</li></ul>',
						parseHtml( '<li>item1</li><li>item2</li>' ) );
		assert.areSame( '<dl><dd>test</dd><dd>test</dd></dl>',
						parseHtml( '<dd>test</dd><dd>test</dd>' ) );
	},

	// #5626
	'test parser *NOT* fixing orphan table cells': function() {
		assert.areSame( '<td>td1</td><p>text</p>',
						parseHtml( '<td>td1</td>text' ) );
		assert.areSame( '<tr><td>td1</td></tr><ul><li>li1</li></ul>',
						parseHtml( '<ul><tr><td>td1</td></tr><li>li1</li></ul>' ) );
	},

	// #5626
	'test parser fix malformed table cell/list item': function() {
		assert.areSame( '<table><tr><td>cell1</td><td>cell2</td></tr></table>',
						parseHtml( '<table><tr><td>cell1<td>cell2</td></td></tr></table>' ) );
		assert.areSame( '<ul><li>item1</li><li>item2</li></ul>',
						parseHtml( '<ul><li>item1<li>item2</li></li></ul>' ) );
	},

	// #7894
	'test parser fix malformed link': function() {
		assert.areSame( '<p>foo<a href="#2">bar</a></p><p>foo bar</p>',
						parseHtml( '<p>foo<a href="#1"><a href="#2">bar</a></p> <p>foo</a> bar</p>' ) );
	},

	'test whitespace between comments': function() {
		var source = '<i>foo<!--1--> <!--2-->bar</i>';
		assert.areSame( source, parseHtml( source, 'p' ) );
	},

	'test *NOT* removing empty inline when comment enclosed': function() {
		assert.areSame( '<p><span><!--comment--></span></p>', parseHtml( '<p><span><!--comment--></span></p>' ) );

	},

	'test fragment#writeChildrenHtml': function() {
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<p>A<b>B<i>C</i></b></p>' ),
			writer = new CKEDITOR.htmlParser.basicWriter(),
			filter = new CKEDITOR.htmlParser.filter();

		filter.addRules( {
			root: function( element ) {
				var div = CKEDITOR.htmlParser.fragment.fromHtml( 'X', 'div' );
				div.insertAfter( element.children[ 0 ] ); // Insert after p.
			},

			elements: {
				$: function( element ) {
					element.attributes.x = '1';
				}
			}
		} );

		fragment.writeChildrenHtml( writer );
		assert.areSame( '<p>A<b>B<i>C</i></b></p>', writer.getHtml( true ) );

		fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<p>A<b>B<i>C</i></b></p>' );
		fragment.writeChildrenHtml( writer, filter );
		assert.areSame( '<p x="1">A<b x="1">B<i x="1">C</i></b></p>', writer.getHtml( true ) );

		fragment = CKEDITOR.htmlParser.fragment.fromHtml( '<p>A<b>B<i>C</i></b></p>' );
		fragment.writeChildrenHtml( writer, filter, true );
		assert.areSame( '<p x="1">A<b x="1">B<i x="1">C</i></b></p><div x="1">X</div>', writer.getHtml( true ) );
	}
} );
