/* bender-tags: editor,unit,dom */

'use strict';

var doc = CKEDITOR.document, tools = bender.tools;

/**
 * Assertions group to verify DOM range iteration results.
 *
 * @param source {String} Html source with range marker.
 * @param opt {Object} Properties get copied to the {@link CKEDITOR.dom.iterator} object.
 * @param results {Array} List of tag names that matches the element name of the iteration result.
 * @param output {String} The compact html result after the iteration.
 * @param msg {String} The assertion failure message.
 */
function checkRangeIteration( source, opt, results, output, msg ) {
	var sandbox = doc.getById( 'sandbox' );
	var range = tools.setHtmlWithRange( sandbox, source, sandbox )[ 0 ];

	// Check iteration sequence.
	var iter = range.createIterator();
	CKEDITOR.tools.extend( iter, opt, true );
	var blockList = [], block;
	while ( ( block = iter.getNextParagraph() ) )
		blockList.push( block.getName() );

	assert.areSame( results.join( ',' ), blockList.join( ',' ), msg );

	// Check DOM modification after iteration.
	if ( output )
		assert.areSame( tools.compatHtml( output, 1, 1 ), tools.compatHtml( sandbox.getHtml(), 1, 1 ), msg );
}

// Return iteration result from a range which scopes within the root element of specified html.
function iterateScopedRange( html, opt ) {
	var sandbox = CKEDITOR.dom.element.createFromHtml( html, CKEDITOR.document );
	CKEDITOR.document.getBody().append( sandbox );
	var range = tools.setHtmlWithRange( sandbox, sandbox.getHtml(), sandbox )[ 0 ];
	var iter = range.createIterator();
	CKEDITOR.tools.extend( iter, opt, true );
	var results = [], block;
	while ( ( block = iter.getNextParagraph() ) )
		results.push( block.getName() );

	sandbox.remove();
	return { html: tools.compatHtml( sandbox.getOuterHtml() ), list: results };
}

function iterateWithRangeIterator( ranges, mergeConsequent, rangeIteratorOpts ) {
	var rangesIterator = ranges.createIterator(),
		range,
		blockList = [];

	while ( range = rangesIterator.getNextRange( mergeConsequent ) ) {
		var iter = range.createIterator(), block;
		CKEDITOR.tools.extend( iter, rangeIteratorOpts, true );
		while ( ( block = iter.getNextParagraph() ) )
			blockList.push( block.getName() );
	}

	return blockList;
}

function checkActiveFilter( source, opt, results, msg ) {
	var sandbox = doc.getById( 'sandbox' );
	var range = tools.setHtmlWithRange( sandbox, source )[ 0 ];

	// Check iteration sequence.
	var iter = range.createIterator();
	CKEDITOR.tools.extend( iter, opt, true );
	var blockList = [], block;
	while ( ( block = iter.getNextParagraph() ) )
		blockList.push( block.getName() + ( iter.activeFilter ? '-' + iter.activeFilter.id : '' ) );

	assert.areSame( results.join( ',' ), blockList.join( ',' ), msg );
}

var tools = bender.tools;

bender.test( {
	// Ticket: 12484.
	'test iterator does not go beyond the sandbox': function() {
		var source = '[<p><i>hello</i><i>moto</i></p>]',
			sandbox = doc.getById( 'sandbox' ),
			range = tools.setHtmlWithRange( sandbox, source, sandbox )[ 0 ],
			p = range.root.findOne( 'p' ),
			iter = range.createIterator(),
			empty = iter._getNextSourceNode( p, 1, p.getLast() );

		assert.isNull( empty );
	},

	'test iterator works well with collapsed range position': function() {
		var msg = 'Iteration should return the paragraph in which the range anchored';

		// range embrace entire paragraph content.
		checkRangeIteration( '[<p>paragraph</p>]', null,  [ 'p' ], null, msg );

		// range collapsed at the end of block.
		checkRangeIteration( '<p>paragraph^</p>', null,  [ 'p' ], null, msg );
		// range collapsed at the middle of block.
		checkRangeIteration( '<p>para^graph</p>', null,  [ 'p' ], null, msg );
		// range collapsed at the start of block.
		checkRangeIteration( '<p>^paragraph</p>', null,  [ 'p' ], null, msg );
	},

	// #3352
	'test iterating over multiple paragraphs': function() {
		var source = '<p>[para1</p><p>para2]</p>';
		checkRangeIteration( source, null,  [ 'p', 'p' ], null, 'Iteration will yield  two paragraphs.' );
	},

	// #8247
	'test a single range collapsed inside of an empty paragraph': function() {
		var source = '<div><p>^</p></div>';
		var output = '<div><p></p></div>';

		checkRangeIteration( source, null,  [ 'p' ], output, 'Iteration will yield one single paragraph' );
	},

	// #12178
	'test iterating over end of line': function() {
		if ( !CKEDITOR.env.needsBrFiller )
			assert.ignore();

		var source = '<h1>para1[<br /></h1><p>par]a2</p>';
		checkRangeIteration( source, null,  [ 'h1', 'p' ], null, 'Iteration will yield heading and paragraph.' );
	},

	// #12178
	'test iterating over end of line - no bogus br': function() {
		var source = '<h1>para1[</h1><p>par]a2</p>';
		checkRangeIteration( source, null,  [ 'h1', 'p' ], null, 'Iteration will yield heading and paragraph.' );
	},

	// #12178
	'test iterating over start of line': function() {
		if ( !CKEDITOR.env.needsBrFiller )
			assert.ignore();

		var source = '<h1>pa[ra1<br /></h1><p>]para2</p>';
		checkRangeIteration( source, null,  [ 'h1', 'p' ], null, 'Iteration will yield heading and paragraph.' );
	},

	// #12178
	'test iterating over start of line - no bogus br': function() {
		var source = '<h1>pa[ra1</h1><p>]para2</p>';
		checkRangeIteration( source, null,  [ 'h1', 'p' ], null, 'Iteration will yield heading and paragraph.' );
	},

	// #12178
	'test iterating over start of line 2 - no bogus br': function() {
		var source = '<h1>pa[ra1</h1><p><b>]para2</b></p>';
		checkRangeIteration( source, null,  [ 'h1', 'p' ], null, 'Iteration will yield heading and paragraph.' );
	},

	// #12178
	'test iterating over start of line 2 - no bogus br - rangeIterator': function() {
		var source = '<h1>pa[ra1</h1><p><b>]para2</b></p>';

		var sandbox = doc.getById( 'sandbox' ),
			ranges = tools.setHtmlWithRange( sandbox, source );

		assert.areSame( 'h1,p', iterateWithRangeIterator( ranges ).join( ',' ) );
	},

	// #12308 (Note: this test wasn't able to verify #12308's patch, but it makes sense anyway).
	'test iterating at block boundary - before bogus br': function() {
		if ( !CKEDITOR.env.needsBrFiller )
			assert.ignore();

		var source = '<h1>para1^<br /></h1><p>para2</p>';
		checkRangeIteration( source, null,  [ 'h1' ], null, 'Iteration will yield heading.' );
	},

	'test iterating over pseudo block': function() {
		var source = '<div><p>[paragraph</p>text]</div>';
		var output = '<div><p>paragraph</p><p>text</p></div>';

		checkRangeIteration( source, null,  [ 'p', 'p' ], output, 'Iteration should create real paragraph for pseudo block.' );
	},

	'test iterating over table cells': function() {
		var source =
			'<table>' +
				'<caption>caption</caption>' +
				'<tbody>' +
				'	<tr>' +
				'		<th>' +
				'			[head1</th>' +
				'	</tr>' +
				'	<tr>' +
				'		<td><p>cell1</p></td>' +
				'	</tr>' +
				'	<tr>' +
				'		<td>cell2]</td>' +
				'	</tr>' +
				'</tbody>' +
			'</table>';

		var output1 = source.replace( /\[|\]/g, '' );
		var output2 =
			'<table>' +
				'<caption>caption</caption>' +
				'<tbody>' +
				'	<tr>' +
				'		<th>' +
				'			<p>head1</p></th>' +
				'	</tr>' +
				'	<tr>' +
				'		<td><p>cell1</p></td>' +
				'	</tr>' +
				'	<tr>' +
				'		<td><p>cell2</p></td>' +
				'	</tr>' +
				'</tbody>' +
			'</table>';

		checkRangeIteration( source, null,  [ 'th', 'p', 'td' ], output1, 'Iteration should report paragraph or table cells' );
		checkRangeIteration( source, { enforceRealBlocks: 1 },  [ 'p', 'p', 'p' ], output2, 'Iteration should establish paragraph if it\'s not available inside table cell' );
	},

	// #6728, #4450
	// While this test may seem to be totally broken (why would someone create bookmakrs between <tr> and <td>?)
	// it has a deeper sense. It tests what rangeIterator#getNextRange does.
	'test iterating over table cells (with bookmarks among cells)': function() {
		var source = '<table><tbody><tr>[<td id="cell1">cell1</td>][<td id="cell2">cell2</td>]</tr></tbody></table>',
		output = source.replace( /\[|\]|\^/g, '' );

		var sandbox = doc.getById( 'sandbox' ),
			ranges = tools.setHtmlWithRange( sandbox, source );

		// Create bookmarks intentionally.
		var bms = ranges.createBookmarks();

		assert.areSame( 'td,td', iterateWithRangeIterator( ranges ).join( ',' ), true );

		// Just to remove bookmarks.
		ranges.moveToBookmarks( bms );

		assert.areSame( tools.compatHtml( output ), tools.compatHtml( sandbox.getHtml() ) );
	},

	// See above an explanation of this test.
	'test iterating over table cells (with bookmarks among cells) - do not merge subsequent ranges': function() {
		var source = '<table><tbody><tr>[<td id="cell1">cell1</td>][<td id="cell2">cell2</td>]</tr></tbody></table>',
		output = source.replace( /\[|\]|\^/g, '' );

		var sandbox = doc.getById( 'sandbox' ),
			ranges = tools.setHtmlWithRange( sandbox, source );

		// Create bookmarks intentionally.
		var bms = ranges.createBookmarks();

		assert.areSame( 'td,td', iterateWithRangeIterator( ranges ).join( ',' ) );

		// Just to remove bookmarks.
		ranges.moveToBookmarks( bms );

		assert.areSame( output, tools.compatHtml( sandbox.getHtml() ) );
	},

	// #6728, #4450
	'test iterating over entire table': function() {
		var source = '[<table><tbody><tr><th>cell1</th><td>cell2</td></tr></tbody></table>]',
			output1 = source.replace( /\[|\]|\^/g, '' ),
			output2 = '<table><tbody><tr><th><p>cell1</p></th><td><p>cell2</p></td></tr></tbody></table>';

		checkRangeIteration( source, null, [ 'th', 'td' ], output1, 'Iteration should report table cells' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'p', 'p' ], output2, 'Iteration should establish paragraphs inside table cells' );
	},

	// #6728, #4450
	'test iterating over entire table - use rangeIterator': function() {
		var source = '[<table><tbody><tr><th>cell1</th><td>cell2</td></tr></tbody></table>]',
			output = source.replace( /\[|\]|\^/g, '' );

		var sandbox = doc.getById( 'sandbox' ),
			ranges = tools.setHtmlWithRange( sandbox, source );

		assert.areSame( 'th,td', iterateWithRangeIterator( ranges, true ).join( ',' ) );

		assert.areSame( output, tools.compatHtml( sandbox.getHtml() ) );
	},

	// #6728, #4450
	'test iterating over entire table - use rangeIterator and enforceRealBlocks': function() {
		var source = '[<table><tbody><tr><th>cell1</th><td>cell2</td></tr></tbody></table>]',
			output = '<table><tbody><tr><th><p>cell1</p></th><td><p>cell2</p></td></tr></tbody></table>';

		var sandbox = doc.getById( 'sandbox' ),
			ranges = tools.setHtmlWithRange( sandbox, source );

		assert.areSame( 'p,p', iterateWithRangeIterator( ranges, true, { enforceRealBlocks: true } ).join( ',' ) );

		assert.areSame( output, tools.compatHtml( sandbox.getHtml() ) );
	},

	'test iterating over list items': function() {
		var source =
			'<ul>' +
				'<li>[item1</li>' +
				'<li><p>item2</p></li>' +
				'<li>' +
					'<ul>' +
						'<li>item3</li>' +
					'</ul>' +
					'<ul>' +
						'<li><p>item5</p></li>' +
					'</ul>' +
				'</li>' +
				'<li>item5]</li>' +
			'</ul>';

		var output1 = source.replace( /\[|\]/g, '' );
		var output2 =
			'<ul>' +
				'<li><p>item1</p></li>' +
				'<li><p>item2</p></li>' +
				'<li>' +
					'<ul>' +
						'<li><p>item3</p></li>' +
					'</ul>' +
					'<ul>' +
						'<li><p>item5</p></li>' +
					'</ul>' +
				'</li>' +
				'<li><p>item5</p></li>' +
			'</ul>';

		checkRangeIteration( source, null,  [ 'li', 'p', 'li' , 'p', 'li' ], output1, 'Iteration should report paragraph or list item' );
		checkRangeIteration( source, { enforceRealBlocks: 1 },  [ 'p', 'p', 'p' , 'p', 'p' ], output2, 'Iteration should establish paragraph if not exists inside list item' );
	},

	// #12273
	'test iterating over description list': function() {
		var source = '<dl><dt>[foo</dt><dd>bar]</dd><dt>bom</dt></dl>',
			output1 = '<dl><dt>foo</dt><dd>bar</dd><dt>bom</dt></dl>',
			output2 = '<dl><dt><p>foo</p></dt><dd><p>bar</p></dd><dt>bom</dt></dl>';

		checkRangeIteration( source, null, [ 'dt', 'dd' ], output1, 'Two list items.' );
		checkRangeIteration( source, { enforceRealBlocks: true }, [ 'p', 'p' ], output2, 'Two real blocks.' );
	},

	'test when iteration range is scoped in a single block': function() {
		var result = iterateScopedRange( '<div>^foo</div>' );
		arrayAssert.itemsAreEqual( [ 'p' ], result.list );
		assert.areSame( '<div><p>foo</p></div>', result.html );

		result = iterateScopedRange( '<p>^foo</p>' );
		arrayAssert.isEmpty( result.list );
		assert.areSame( '<p>foo</p>', result.html );
	},

	'test iterator in br mode': function() {
		var source = '<div>a<br>b^c<br>d</div>',
			output = '<div>a<p>bc</p>d</div>',
			result;

		result = iterateScopedRange( source, { enlargeBr: 0 } );
		assert.areSame( 'p', result.list.join( ',' ) );
		assert.areSame( output, result.html );

		result = iterateScopedRange( source, { enforceRealBlocks: 1, enlargeBr: 0 } );
		assert.areSame( 'p', result.list.join( ',' ) );
		assert.areSame( output, result.html );
	},

	'test iterator in br mode - 3 paragraphs': function() {
		var source = '<div>[a<br>bc<br>d]</div>',
			output = '<div><p>a<br />bc<br />d</p></div>',
			result;

		result = iterateScopedRange( source, { enlargeBr: 0 } );
		assert.areSame( 'p', result.list.join( ',' ) );
		assert.areSame( output, result.html );

		result = iterateScopedRange( source, { enforceRealBlocks: 1, enlargeBr: 0 } );
		assert.areSame( 'p', result.list.join( ',' ) );
		assert.areSame( output, result.html );
	},

	'test iterator with not autoparagraphed content': function() {
		var source = '<p>[a</p>b]',
			output = '<p>a</p><p>b</p>';

		checkRangeIteration( source, null, [ 'p', 'p' ], output, 'both lines are returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'p', 'p' ], output, 'both lines are returned' );
	},

	'test iterator returns blocks with only non-editable content': function() {
		var source = '<p>[a</p><h1><i contenteditable="false">x</i></h1><h2><i contenteditable="false">x</i><b contenteditable="false">x</b></h2><p>b]</p>',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'p', 'h1', 'h2', 'p' ], output, 'all blocks are returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'p', 'h1', 'h2', 'p' ], output, 'all blocks are returned in enforceRealBlocks' );
	},

	'test iterator returns block with only non-editable content (collapsed selection)': function() {
		var source = '<p>a</p><h1><i contenteditable="false">x</i>^</h1><p>b</p>',
			output = source.replace( /\^/g, '' );

		checkRangeIteration( source, null, [ 'h1' ], output, 'block is returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'h1' ], output, 'block is returned in enforceRealBlocks' );
	},

	'test iterator returns non-editable blocks': function() {
		var source = '<p>[a</p><div contenteditable="false">b</div><p>c]</p>',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'p', 'div', 'p' ], output, 'non-editable block is returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'p', 'div', 'p' ], output,
			'non-editable block is returned in enforceRealBlocks (and source is not modified)' );
	},

	'test iterator returns non-editable blocks - single block selected': function() {
		var source = '[<div contenteditable="false">b</div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div' ], output, 'non-editable block is returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div' ], output,
			'non-editable block is returned in enforceRealBlocks (and source is not modified)' );
	},

	'test iterator returns content between non-editable blocks': function() {
		var source = '[<div contenteditable="false">b</div><p>x</p><h1 contenteditable="false">c</h1>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div', 'p', 'h1' ], output, 'all blocks were returned' );
	},

	'test iterator does not return blocks inside non-editable block': function() {
		var source = '[<div contenteditable="false"><p>a</p><ul><li>b</li></ul>doNotTouchMe</div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div' ], output, 'only non-editable block is returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div' ], output,
			'only non-editable block is returned in enforceRealBlocks (and source is not modified)' );
	},

	'test iterator returns blocks inside nested editables': function() {
		var source =
				'[<div contenteditable="false">' +
					'<blockquote contenteditable="true"><h1>a</h1>b</blockquote>' +
				'</div>]',
			output =
				'<div contenteditable="false">' +
					'<blockquote contenteditable="true"><h1>a</h1><p>b</p></blockquote>' +
				'</div>';

		checkRangeIteration( source, null, [ 'div', 'h1', 'p' ], output, 'non-editable element and block in nested editable are returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'h1', 'p' ], output,
			'non-editable element and blocks in nested editable are returned in enforceRealBlocks' );
	},

	'test iterator does not return contents of blockless nested editables': function() {
		var source = '[<div contenteditable="false"><h1 contenteditable="true">a</h1></div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div' ], output, 'only non-editable block is returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div' ], output,
			'only non-editable block is returned in enforceRealBlocks' );
	},

	'test iterator does not stop on inline non-editable elements': function() {
		var source = '[<h1>foo</h1><p>x<i contenteditable="false">x</i>x</p><h2>bar</h2>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'h1', 'p', 'h2' ], output, 'all blocks returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'h1', 'p', 'h2' ], output, 'all blocks returned in enforceRealBlocks' );
	},

	'test iterator does not stop on inline non-editable elements - only non-editable inline element in paragraph': function() {
		var source = '[<h1>foo</h1><p><i contenteditable="false">x</i></p><h2>bar</h2>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'h1', 'p', 'h2' ], output, 'all blocks returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'h1', 'p', 'h2' ], output, 'all blocks returned in enforceRealBlocks' );
	},

	'test iterator does not leak from nested editable': function() {
		var source = '[<div contenteditable="false"><div contenteditable="true"><h1>a</h1></div><p>b</b></div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div', 'h1' ], output, 'non-editable p was not returned' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'h1' ], output, 'non-editable p was not returned' );
	},

	'test iterator returns contents of multiple nested editables': function() {
		var source =
				'[<div contenteditable="false">' +
					'<blockquote contenteditable="true"><h1>a</h1></blockquote>' +
					'<div>xxx<blockquote contenteditable="true"><h2>a</h2></blockquote></div>' +
				'</div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div', 'h1', 'h2' ], output, 'all nested editables were found' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'h1', 'h2' ], output, 'all nested editables were found' );
	},

	'test nested iterators inherit settings from parent - enforceRealBlocks': function() {
		var source =
				'[<div contenteditable="false">' +
					'<div contenteditable="true"><ul><li>a</li></ul></div>' +
				'</div>]',
			output1 = source.replace( /\[|\]/g, '' ),
			output2 =
				'<div contenteditable="false">' +
					'<div contenteditable="true"><ul><li><p>a</p></li></ul></div>' +
				'</div>';

		checkRangeIteration( source, null, [ 'div', 'li' ], output1, 'real blocks were not enforced' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'p' ], output2, 'real blocks were enforced' );
	},

	'test iterating over 2nd level of nested editables': function() {
		var source =
				'[<div contenteditable="false">' +
					'<div contenteditable="true">' +
						'<h1>foo</h1>' +
						'<div contenteditable="false">' +
							'<div contenteditable="true">' +
								'<h2>bar</h2>' +
							'</div>' +
						'</div>' +
						'<h3>foo</h3>' +
					'</div>' +
				'</div>]',
			output = source.replace( /\[|\]/g, '' );

		checkRangeIteration( source, null, [ 'div', 'h1', 'div', 'h2', 'h3' ], output, '2nd nested editable found once' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'h1', 'div', 'h2', 'h3' ], output, '2nd nested editable found once' );
	},

	'test activeFilter property when iterating over nested editables': function() {
		var f1 = new CKEDITOR.filter( 'p b' ).id,
			f2 = new CKEDITOR.filter( 'p i' ).id;

		var source =
			'[<div contenteditable="false">' +
				'<div contenteditable="true" data-cke-filter="' + f1 + '"><h1>x</h1></div>' +
				'<div contenteditable="true"><h2>x</h2></div>' +
				'<div contenteditable="true" data-cke-filter="' + f2 + '"><h3>x</h3><h4>x</h4></div>' +
			'</div>' +
			'<p>x</p>]';

		checkActiveFilter( source, null, [ 'div', 'h1-' + f1, 'h2', 'h3-' + f2, 'h4-' + f2, 'p' ], 'active filter is correctly set and unset' );
	},

	'test activeFilter property when iterating over 2nd level of nested editables': function() {
		var f1 = new CKEDITOR.filter( 'p b' ).id,
			f2 = new CKEDITOR.filter( 'p i' ).id,
			f3 = new CKEDITOR.filter( 'p u' ).id;

		var source =
			'[<div contenteditable="false">' +
				'<div contenteditable="true" data-cke-filter="' + f1 + '">' +
					'<p>x</p>' +
					'<div contenteditable="false">' +
						'<div contenteditable="true" data-cke-filter="' + f2 + '"><h1>x</h1></div>' +
						'<div contenteditable="true" data-cke-filter="' + f3 + '"><h2>x</h2></div>' +
					'</div>' +
					'<p>x</p>' +
				'</div>' +
			'</div>]';

		checkActiveFilter( source, null, [ 'div', 'p-' + f1, 'div-' + f1, 'h1-' + f2, 'h2-' + f3, 'p-' + f1 ], 'active filter is correctly set and unset' );
	},

	'test iterator does not enter nested editables which ACF does not allow for its block tag': function() {
		var f1 = new CKEDITOR.filter( 'div' ).id,
			f2 = new CKEDITOR.filter( 'div p' ).id;

		var source =
				'[<div contenteditable="false">' +
					'<div contenteditable="true" data-cke-filter="' + f1 + '">x</div>' +
					'<div contenteditable="true" data-cke-filter="' + f2 + '">x</div>' +
				'</div>]',
			output =
				'<div contenteditable="false">' +
					'<div contenteditable="true" data-cke-filter="' + f1 + '">x</div>' +
					'<div contenteditable="true" data-cke-filter="' + f2 + '"><p>x</p></div>' +
				'</div>';

		checkRangeIteration( source, null, [ 'div', 'p' ], output, 'block created only in one of editables' );
		checkRangeIteration( source, { enforceRealBlocks: 1 }, [ 'div', 'p' ], output, 'block created only in one of editables' );
	},

	'test iterator does not leak from range.root': function() {
		var sandbox = new CKEDITOR.dom.element( 'div' );
		sandbox.setHtml( '\n \t<div class="root"></div>\n \t' );
		var root = sandbox.findOne( '.root' );

		var source =
				'[<div contenteditable="false">' +
					'<div contenteditable="true"><h1>a</h1></div>' +
				'</div>]',
			output = source.replace( /\[|\]/g, '' ),
			range = bender.tools.setHtmlWithRange( root, source, root )[ 0 ],
			iterator = range.createIterator(),
			block,
			blocks = [];

		while ( ( block = iterator.getNextParagraph() ) )
			blocks.push( block.getName() );

		assert.areSame( 'div,h1', blocks.join( ',' ), 'nothing else except div+h1 was found' );
		assert.areSame( '<div class="root">' + output + '</div>', bender.tools.compatHtml( sandbox.getHtml(), 1 ),
			'surrounding of a range.root has not been modified' );
	}
} );