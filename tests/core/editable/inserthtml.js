/* bender-tags: editor,unit,insertion */

( function() {
	'use strict';

	insertionDT.run( {
		autoParagraph : false,
		allowedContent : true // Disable filter.
	}, {
		// Rules:
		// 1. If text is being inserted into selection for which toolbar may indicate
		//		some styles applied (e.g. '[<b>]a</b>' or '<b>[a]</b>') then for inserted
		//		content also apply styles - this means inserting that content into these
		//		inline elements.
		//		If html is being inserted then keep data format, so ignore styles applied
		//		to selection.
		//		Note 1: toolbar context uses startContainer (after shrinking range) to check
		//		which styles are applied to selection.
		// 2. If insertion results with adjacent inline elements they should be merged.
		//		"<b>a</b><b>c^</b>" => "<b>ac^</b>"
		// 3. If we can suppose that copied selection ended right after text having some
		//		inline styles applied (also link), then after pasting we want to have
		//		the same styles applied, so we move caret inside the innermost inline element.
		//
		//		Examples:
		//		"aa^aa" + "cc<b>dd</b>" => "aacc<b>dd^</b>aa"
		//		"aa^aa" + "cc<b>dd</b> " => "aacc<b>dd</b> ^aa"
		//		"aa^aa" + "cc<b>dd </b>" => "aacc<b>dd </b>^aa"
		//
		//		Rule 6. has precedence over this rule - if caret was placed after line break -
		//		don't move it towards the text.
		//
		//		This rule won't work correctly in following example:
		//		"x[x<s>xx </s>]<s>xx</s>", where <s> has styles like bgcolor, strike and other
		//		that are visible for white-spaces - user sees selection ending inside styled
		//		text, but after pasting we move caret outside this style. However, this is rare
		//		case that in fact should be optimized by merging <s>s.
		//
		//		Another case for which this rule won't work brilliantly is:
		//		"x[x<s>xx </s>]xx", where <s> has styles visible for white-spaces. However there
		//		is possibility (discussed in #2015) that editor will have feature trimming inline
		//		elements, so they won't contain white-spaces at the ends and then this rule could
		//		be fixed: "aa^aa" + "cc<b>dd </b>" => "aacc<b>dd ^</b>aa", because only visible
		//		styles will can contain spaces at boundaries.
		// 4. Content should be pasted into the block element in which selection start was
		//		placed before removing content.
		//
		//		Examples:
		//		"<p>a[a</p>b]b" + "bam" => "<p>abam^</p>b"
		//		"b[b<p>a]a</p>" + "bam" => "bbam^<p>a</p>"
		//		"<p>b[b</p><div>a]a</div>" + "bam" => "<p>bbam^</p><div>a</div>"
		//
		//		This rule has lower priority than rule 1. However rule 1. doesn't negate
		//		this rule, because content is still being pasted inside block element that
		//		was selection start's parent.
		// 5. After deleting contents of selection squash identical adjacent paragraphing elements (p,div,li,ol,ul,pre,...)
		//		when one of them was an ancestor of startContainer and second one was an ancestor of endContainer.
		//		Do this recursively.
		//
		//		Examples:
		//		"<p>A[A</p><p>B]B</p>" + "bam" => "<p>Abam^B</p>"
		//		"<ul><li>A[A</li></ul><ul><li>B]B</li></ul>" + "bam" => "<ul><li>Abam^B</li></ul>"
		//		Rule does not apply in these cases:
		//		"<table><tr><td>B[B</td></tr></table><table><tr><td>C]C</td></tr></table>"
		//		"<p>AA[A</p><div><p>B]BB</p></div>"
		// 6. ... To be written.
		// 7. Always handle single line as an inline content.
		//		Some browsers wrap single line in block element like <p> or <div>.
		//		Strip it, so we'll handle one line identically in all browsers - as an inline content.
		//
		//		Condition for "one line" - no <br> at any level, only one non-inline element wrapping entire content.
		//		Perform this check after normalizing bogus <brs>.
		//		Allowed wrappers - p,div,headers.
		//		This rule doesn't apply when pasting into the empty block (bogus only or completely empty).
		//
		//		Examples:
		//		"<p>a^b</p>" + "<p>xyz</p>" => "<p>axyz^b</p>"
		//		"<p>a^b</p>" + "xyz" => "<p>axyz^b</p>"
		// 8. Inherit inline styles of selections' start for pasted block content when in 'text' type.
		//
		//		Examples:
		//		- in text mode:
		//		"<p><b>x^y</b></p>" + "<p>abc</p><p>def</p>" => "<p><b>x</b></p><p><b>abc</b></p><p><b>def^</b></p><p><b>y</b></p>"
		//		- in html mode:
		//		"<p><b>x^y</b></p>" + "<p>abc</p><p>def</p>" => "<p><b>x</b></p><p>abc</p><p>def^</p><p><b>y</b></p>"

		// TCs groups:
		// 1. text -> text
		// 2. text -> inline elements
		// 3. text -> block elements
		// 4. inline -> text
		// 5. inline -> inline
		// 6. inline -> block
		// 7. block  -> text
		// 8. block -> inline
		// 9. block -> block
		// S. special TCs
		//
		// Note: TCs called e.g. "block" can also contain text & inline elements.

		//
		// TC group 1.
		// text -> text
		//

		'G1. text into text' : function() {
			// Assertions names:
			// b[egin] e[nd] m[iddle]
			// n[ot]e[mpty] e[mpty]

			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( '^',				'bam^',															'into empty editable' );
			a( '[foo]bar',		'bam^bar',														'bne' );
			a( 'foo[bar]',		'foobam^',														'ene' );
			a( 'fo[ob]ar',		'fobam^ar',														'mne' );
			a( '^bar',			'bam^bar',														'be' );
			a( 'bar^',			'barbam^',														'ee' );
			a( 'foo^bar',		'foobam^bar',													'me' );
			a( '[foo]',			'bam^',															'replace all' );

			a.insertion = '';

			a( '[foo]',			'^',															'replace all 2' );
			a( 'f[o]o',			'f^o',															'mne 2' );
		},

		'G1. spaces into text' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a.insertion = '&nbsp;';
			a( '^foo',				'&nbsp;^foo',															'into empty editable 1' );
			a( 'a^b',			'a&nbsp;^b',													'mne 1' );
			a( '^bar',			'&nbsp;^bar',													'bne 1' );

			a.insertion = '\u00a0\u00a0';
			a( 'a^b',			'a&nbsp;&nbsp;^b',												'mne 2' );
			a( 'foo^bar',			'foo&nbsp;&nbsp;^bar',												'ene 2' );

			a.insertion = ' ';
			a( 'a^b',			'a ^b',													'mne 3' );

			a.insertion = '    ';
			a( 'a^b',			'a ^b',													'mne 4' );
			a( 'foo^bar',			'foo ^bar',													'ene 4' );

			a.insertion = ' x ';
			a( 'a^b',			'a x ^b',														'mne 5a' );
			a( 'a ^b',			'a x ^b',														'mne 5b' );
			// In real case space after caret will be ignored ('a x ^b').
			a( 'a^ b',			'a x ^ b',														'mne 5c' );
			a( 'foo^bar',			'foo x ^bar',														'ene 5' );
		},

		//
		// TCs group 2.
		// text -> inline elements
		//

		'G2. text next to inline element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( '^<br />foo',				'bam^<br />foo',									'before br' );
			// a( '^<br />',					'bam^<br />',										'before br 2' );
			a( '<br />^foo',				'<br />bam^foo',									'after br' );
			a( '<b>a</b>^',					'<b>a</b>bam^',										'after b' );
			a( '^<b>a</b>',					'bam^<b>a</b>',										'before b' );
			a( '[foo]<span>bar</span>baz',	'bam^<span>bar</span>baz',							'before span' );
			a( 'foo<span>bar</span>[baz]',	'foo<span>bar</span>bam^',							'after span' );
			a( '[foo<span><b>]bar</b></span>baz',	'bam^<span><b>bar</b></span>baz',			'before nested' );

			// Rule 1.
			a( '[<b>]a</b>',	{ html : 'bam^<b>a</b>', text : '<b>bam^a</b>' },				'before b 2' );
			a( '<b>a[</b>]',	{ html : '<b>a</b>bam^', text : '<b>abam^</b>' },				'after b 2' );
			a( '<a href="#">a[</a>]',	{ html : '<a href="#">a</a>bam^', text : '<a href="#">abam^</a>' },				'after a 1' );
			a( 'foo<span><b>bar[</b></span>baz]',
				{	html : 'foo<span><b>bar</b></span>bam^',
					text : 'foo<span><b>barbam^</b></span>' },									'after nested 1' );
			a( 'foo<span><b>bar</b>[</span>baz]',
				{	html : 'foo<span><b>bar</b></span>bam^',
					text : 'foo<span><b>bar</b>bam^</span>' },									'after nested 2' );
		},

		'G2. text into inline element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			// Rule 1.
			a( 'foo<span>^bar</span>baz',
				{	html : 'foobam^<span>bar</span>baz',
					text : 'foo<span>bam^bar</span>baz' },										'beginning 1' );
			a( 'foo<span>bar^</span>baz',
				{	html : 'foo<span>bar</span>bam^baz',
					text : 'foo<span>barbam^</span>baz' },										'end 1' );
			a( 'foo<u>x[y]z</u>baz',
				{	html : 'foo<u>x</u>bam^<u>z</u>baz',
					text : 'foo<u>xbam^z</u>baz' },												'middle' );
			// See more tests for splitting in special TC.
			a( 'foo<u>x<b>[y]</b>z</u>baz',
				{	html : 'foo<u>x</u>bam^<u>z</u>baz',
					text : 'foo<u>x<b>bam^</b>z</u>baz' },										'middle 2' );
			a( 'x[<span>a]b</span>x',
				{	html : 'xbam^<span>b</span>x',
					text : 'x<span>bam^b</span>x' },											'beginning 2' );
			a( 'x<span>a[b</span>]x',
				{	html : 'x<span>a</span>bam^x',
					text : 'x<span>abam^</span>x' },											'end 2' );
		},

		'G2. text into selection containing entire inline element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( '[<br />]',					'bam^',												'replace 1' );

			// Rule 1.
			a( 'x[<b>bar</b>]y',			{	html : 'xbam^y',
												text : 'x<b>bam^</b>y' },						'inside 1' );
			a( 'x<b>[bar</b>]y',			{	html : 'xbam^y',
												text : 'x<b>bam^</b>y' },						'inside 2' );
			a( 'x[<b>bar]</b>y',			{	html : 'xbam^y',
												text : 'x<b>bam^</b>y' },						'inside 3' );
			a( 'x<b>[bar]</b>y',			{	html : 'xbam^y',
												text : 'x<b>bam^</b>y' },						'inside 4' );
		},

		'G2. text into selection containing inline element (part of or entire) and text outside this element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( '[foo<span>bar]</span>baz',	'bam^baz', 											'remove 1' );
			a( '[foo<span>xyz</span>]baz',	'bam^baz', 											'remove 2' );
			a( '[foo<span>x]yz</span>baz',	'bam^<span>yz</span>baz',							'trim 1' );

			// Rule 1. (+ note 1.)
			a( 'foo[<span>xyz</span>baz]',
				{	html : 'foobam^',
					text : 'foo<span>bam^</span>' }, 											'inside 1' );
			a( 'foo<span>xy[z</span>baz]',
				{	html : 'foo<span>xy</span>bam^',
					text : 'foo<span>xybam^</span>' }, 											'inside 2' );
		},

		'G2. text into selection containing entire inline elements' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			// Rule 1. (+ note 1.)
			a( 'foo<b>[bar</b><b>bom]</b>baz',
				{	html : 'foobam^baz',
					text : 'foo<b>bam^</b>baz' },												'inside 1' );
			a( 'foo[<b>bar</b><b>bom</b>]baz',
				{	html : 'foobam^baz',
					text : 'foo<b>bam^</b>baz' },												'inside 2' );
			a( 'foo<b>[bar</b> <span>cke</span><br />\n\t <b>bom]</b>baz',
				{	html : 'foobam^baz',
					text : 'foo<b>bam^</b>baz' },												'inside 3' );
			a( 'foo[<b>bar</b><b>baz</b>bim]bom',
				{	html : 'foobam^bom',
					text : 'foo<b>bam^</b>bom' },												'inside 4' );

			// Different endings - only startContainer matters.
			a( 'foo[<i><u>b</u>im</i><b>bar</b><b>bom]</b>baz',
				{	html : 'foobam^baz',
					text : 'foo<i><u>bam^</u></i>baz' },										'inside 5' );

			a(	'foo[bim<b>bar</b><b>bom]</b>baz',		'foobam^baz',							'outside 1' );
		},

		'G2. text into not entirely selected inline elements' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			// Rule 1. (+ note 1.)
			a( 'foo<u>b[ar</u> <u>baz]</u>baz',
				{	html : 'foo<u>b</u>bam^baz',
					text : 'foo<u>bbam^</u>baz' },												'inside 1' );
			a( 'foo<u>b[ar</u> <i>ba]z</i>baz',
				{	html : 'foo<u>b</u>bam^<i>z</i>baz',
					text : 'foo<u>bbam^</u><i>z</i>baz' },										'inside 2' );
			// Rule 2.
			// See more tests for merging in special TC.
			a( 'foo<u>b[ar</u> <u>ba]z</u>baz',
				{	html : 'foo<u>b</u>bam^<u>z</u>baz',
					text : 'foo<u>bbam^z</u>baz' },												'inside 3' );
		},

		'G2. text between inline elements' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( 'x<b>a</b>^<b>c</b>y',			'x<b>a</b>bam^<b>c</b>y',						'between 1' );
			a( 'x<b>a</b>[ ]<b>c</b>y',			'x<b>a</b>bam^<b>c</b>y',						'between 2' );
			a( 'x<b>a</b>[def]<b>c</b>y',		'x<b>a</b>bam^<b>c</b>y',						'between 3' );
			a( 'x<b>a</b>[def<b>]c</b>y',		'x<b>a</b>bam^<b>c</b>y',						'between 4' );

			// Rule 1.
			a( 'x<b>a</b>[<u>d</u>]<b>c</b>y',
				{	html : 'x<b>a</b>bam^<b>c</b>y',
					text : 'x<b>a</b><u>bam^</u><b>c</b>y' },									'between 5' );
			// Rule 2.
			// See more tests for merging in special TC.
			a( 'x<b>a[</b>def]<b>c</b>y',
				{	html : 'x<b>a</b>bam^<b>c</b>y',
					text : 'x<b>abam^c</b>y' },													'between 6' );
		},

		//
		// TCs group 3.
		// text -> block elements
		//

		'G3. text into block element' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'bam' );

			a( '<p>^</p>',						'<p>bam^</p>',									'into 1' );
			a( '<p>foo^</p>',					'<p>foobam^</p>',								'into 2' );
			a( '<p>^foo</p>',					'<p>bam^foo</p>',								'into 3' );
			a( '<p>fo[ob]ar</p>',				'<p>fobam^ar</p>',								'into 4' );

			a( 'x<p><b>foo</b>^</p>x',			'x<p><b>foo</b>bam^</p>x',						'into 5' );
			a( 'x<p>^<b>foo</b></p>x',			'x<p>bam^<b>foo</b></p>x',						'into 6' );
			a( 'x<p>[<b>foo</b>]</p>x',
				{ html : 'x<p>bam^</p>x', text : 'x<p><b>bam^</b></p>x' },						'into 7' );
		},

		'G3. text next to block element' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'bam' );

			a( '^<p>x</p>',				'bam^<p>x</p>',											'before p' );
			a( '<p>x</p>^',				'<p>x</p>bam^',											'after p' );

			a( '[foo]<p>bar</p>baz',		'bam^<p>bar</p>baz',								'leave 1' );
			a( 'foo<p>bar</p>[baz]',		'foo<p>bar</p>bam^',								'leave 2' );
		},

		// Rule 4.
		'G3. text into block element + line break' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'bam' );

			a( '[foo<p>]bar</p>baz',		'bam^<p>bar</p>baz',								'case 1' );
			a( 'foo<p>bar[</p>baz]',		'foo<p>barbam^</p>',								'case 2' );

			a( 'x[<p>a<b>foo</b>]bar</p>x',		'xbam^<p>bar</p>x',								'case 3' );
			a( 'x<p>bar[<b>foo</b>a</p>]x',
				{ html : 'x<p>barbam^</p>x', text : 'x<p>bar<b>bam^</b></p>x' },				'case 4' );

			a( '<p>x</p>[<p>a<b>f</b>]bar</p>',		'<p>x</p>bam^<p>bar</p>',					'case 5' );
			a( '<p>bar[<b>f</b>a</p>]<p>x</p>',
				{ html : '<p>barbam^</p><p>x</p>', text : '<p>bar<b>bam^</b></p><p>x</p>' },	'case 6' );

			a( '<p>bar<b>[f</b>a</p>]<p>x</p>',
				{ html : '<p>barbam^</p><p>x</p>', text : '<p>bar<b>bam^</b></p><p>x</p>' },	'case 7' );

			a( '<p>b[b</p><div>a]a</div>',	'<p>bbam^</p><div>a</div>',							'case 8' );

			a( '<div><p>a<b>[b</b>c</p>d</div>e]f',
				{	html : '<div><p>abam^</p></div>f',
					text : '<div><p>a<b>bam^</b></p></div>f' },									'case 9' );

			a(
				'<table><tbody><tr><td>AA</td><td>B[B</td></tr></tbody></table><table><tbody><tr><td>C]C</td><td>DD</td></tr></tbody></table>',
				'<table><tbody><tr><td>AA</td><td>Bbam^</td></tr></tbody></table><table><tbody><tr><td>C</td><td>DD</td></tr></tbody></table>',
																								'case 10' );
		},

		// Rule 4. + 5.
		'G3. text into block elements' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'bam' );

			a( '<p>AA[A</p><div>B]BB</div>',			'<p>AAbam^</p><div>BB</div>',			'don\'t merge 1' );
			a( '<p>AA[A</p><div><p>B]BB</p></div>',		'<p>AAbam^</p><div><p>BB</p></div>',	'don\'t merge 2' );
			// Hard to implement merging here - but this could be interesting feature.
			a( '<ul><li>A[A<ul><li>B]B</li></ul></li></ul>',
				'<ul><li>Abam^<ul><li>B</li></ul></li></ul>',									'don\'t merge 3' );
			a( '<table><tbody><tr><td>A[A</td><td>B]B</td></tr></tbody></table>',
				'<table><tbody><tr><td>Abam^</td><td>B</td></tr></tbody></table>',				'don\'t merge 4' );
			a( '<ul class="red"><li>A[A</li></ul> <ul><li>B]B</li><li>C</li></ul>',
				'<ul class="red"><li>Abam^</li></ul><ul><li>B</li><li>C</li></ul>',				'don\'t merge 5' );

			a( '<p>AA[A</p><p>B]BB</p>',					'<p>AAbam^BB</p>',					'merge 1' );
			a( '<div>AA[A</div><div>B]BB</div>',			'<div>AAbam^BB</div>',				'merge 1b' );
			// TODO
			// Failing due to some bug in placing bookmark at the end of <p>.
			// Range passed to insertXXX methods is found outside <p>.
			// This happens for <div> editable.
			// a( '<p>AAA[</p><p>]BBB</p>',					'<p>AAAbam^BBB</p>',				'merge 2' );
			a( '<p>AA[A</p><p>BBB]</p>',					'<p>AAbam^</p>',					'merge 3' );
			a( '<p>[AAA</p><p>B]BB</p>',					'<p>bam^BB</p>',					'merge 3b' );
			a( '<p>AA[A</p><div>C</div><hr><p>B]BB</p>',	'<p>AAbam^BB</p>',					'merge 4' );

			a( '<p>A<b>A[A</b></p><p>B]BB</p>',
				{ html : '<p>A<b>A</b>bam^BB</p>', text : '<p>A<b>Abam^</b>BB</p>' },			'merge 5' );
			// Combo! Rule 2. + 4. + 5.
			a( '<p>A<b>A<u>[A</u></b></p><p><b><u>B]B</u></b>B</p>',
				{	html : '<p>A<b>A</b>bam^<b><u>B</u></b>B</p>',
					text : '<p>A<b>A<u>bam^B</u></b>B</p>' },									'merge 6' );
			a( '<ul><li>A<b>C[D</b></li></ul> <ul><li>A<b>C]D</b></li></ul>',
				{	html : '<ul><li>A<b>C</b>bam^<b>D</b></li></ul>',
					text : '<ul><li>A<b>Cbam^D</b></li></ul>' },								'merge 6b' );

			a( '<ul><li>A[A</li><li>B]B</li><li>CC</li></ul>',
				'<ul><li>Abam^B</li><li>CC</li></ul>',											'merge 7' );
			a( '<ul><li>A[A</li></ul> <ul><li>B]B</li><li>C</li></ul>',
				'<ul><li>Abam^B</li><li>C</li></ul>',											'merge 8' );

			a( '<ul><li>A[A</li></ul> <ul><li class="red">B]B</li><li>C</li></ul>',
				'<ul><li>Abam^</li><li class="red">B</li><li>C</li></ul>',						'partial merge 1' );

			a.insertion = '';

			// Should remove tail empty block that are not merged.
			a( '<h1>foo[</h1><p>bar]</p>', '<h1>foo^</h1>', 'h1+p' );
			a( '<div><p>foo[</p></div><h1>bar]</h1>', '<div><p>foo^</p></div>', 'div+p/h1' );
			a( '<p>foo[</p><ul><li>bar]</li><li>baz</li></ul>', '<p>foo^</p><ul><li>baz</li></ul>', 'p+2li' );
			a( '<p>foo[</p><ul><li>bar]</li></ul>', '<p>foo^</p>', 'p+li' );
			a( '<p>foo[</p><ul><li>bar]</li></ul>', '<p>foo^</p>', 'p+li' );

			// Should NOT remove empty block that are not within the original range.
			a( '[foo]<p></p>', '^<p>&nbsp;</p>', 'do not remove empty block that\'s not within the original range' );

			// Should NOT remove empty block if it's on the start path.
			a( '<p>baz</p><p>[foo</p><h1>bar]</h1>', '<p>baz</p><p>^&nbsp;</p>', 'do not remove empty block if it\'s on the start path' );
		},

		//
		// TCs group 4.
		// inline elements -> text
		//

		'G4. inline element into text' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<b>bam</b>', 'html', CKEDITOR.ENTER_BR );

			// Rule 3.
			a( '^',				'<b>bam^</b>',													'into empty editable' );
			a( '[foo]bar',		'<b>bam^</b>bar',												'bne' );
			a( 'foo[bar]',		'foo<b>bam^</b>',												'ene' );
			a( 'fo[ob]ar',		'fo<b>bam^</b>ar',												'mne' );
			a( '^bar',			'<b>bam^</b>bar',												'be' );
			a( 'bar^',			'bar<b>bam^</b>',												'ee' );
			a( 'foo^bar',		'foo<b>bam^</b>bar',											'me' );
			a( '[foo]',			'<b>bam^</b>',													'replace all' );

			a.mode = null;
			a.insertion = '<br />';

			// a( '^',				'<br />^',														'into empty editable 2' );
			a( '^bar',			'<br />^bar',													'be 2' );
			// a( 'bar^',			'bar<br />^',													'ae 2' );
			a( 'foo^bar',		'foo<br />^bar',												'me 2' );
		},

		'G4. inline element and text into text' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<b>bam</b>bom', 'html', CKEDITOR.ENTER_BR );

			a( '^',				'<b>bam</b>bom^',												'into empty editable' );
			a( '^bar',			'<b>bam</b>bom^bar',											'be' );
			a( 'bar^',			'bar<b>bam</b>bom^',											'ae' );
			a( 'foo^bar',		'foo<b>bam</b>bom^bar',											'me' );

			a.insertion = 'bom<b>bam</b>';

			a( '^',				'bom<b>bam^</b>',												'into empty editable 2' );
			a( '^bar',			'bom<b>bam^</b>bar',											'be 2' );
			a( 'bar^',			'barbom<b>bam^</b>',											'ae 2' );
			a( 'foo^bar',		'foobom<b>bam^</b>bar',											'me 2' );

			a.insertion = 'bom<b>bam</b>bim';

			a( '^',				'bom<b>bam</b>bim^',											'into empty editable 3' );
			a( '^bar',			'bom<b>bam</b>bim^bar',											'be 3' );
			a( 'bar^',			'barbom<b>bam</b>bim^',											'ae 3' );
			a( 'foo^bar',		'foobom<b>bam</b>bim^bar',										'me 3' );
		},

		//
		// TCs group 5.
		// inline elements -> inline elements
		//

		'G5. inline element next to inline element (different name)' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<b>a</b>', 'html', CKEDITOR.ENTER_BR );

			a( '^<br />c',				'<b>a^</b><br />c',										'before br' );
			a( '<br />^b',				'<br /><b>a^</b>b',										'after br' );

			a( '<u>c</u>^',				'<u>c</u><b>a^</b>',									'leave 1' );
			a( '^<u>c</u>',				'<b>a^</b><u>c</u>',									'leave 2' );
			a( '[<u>]c</u>',			'<b>a^</b><u>c</u>',									'leave 3' );
			a( '<u>c[</u>]',			'<u>c</u><b>a^</b>',									'leave 4' );

			a( '<u>c</u>[foo]',			'<u>c</u><b>a^</b>',									'leave 5' );
			a( '<u>c[</u>foo]',			'<u>c</u><b>a^</b>',									'leave 6' );
			a( '[foo]<u>c</u>',			'<b>a^</b><u>c</u>',									'leave 7' );
			a( '[foo<u>]c</u>',			'<b>a^</b><u>c</u>',									'leave 8' );

			a( '<u>c[<b style="color: red">a</b></u>foo]',	'<u>c</u><b>a^</b>',				'remove styled el' );
			a( '[foo<u><b style="color: red">a</b>]c</u>',	'<b>a^</b><u>c</u>',				'remove styled el' );
		},

		'G5. inline element next to inline element (same name)' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<br />', null, CKEDITOR.ENTER_BR );

			a( '^<br />a',				'<br />^<br />a',										'before br' );
			a( '<br />^a',				'<br /><br />^a',										'after br' );

			a.insertion = '<b>a</b>';
			a.mode = 'html';

			// Rule 2.
			a( '<b>c</b>^',				'<b>ca^</b>',											'merge 1' );
			a( '^<b>c</b>',				'<b>a^c</b>',											'merge 2' );
			a( '[<b>]c</b>',			'<b>a^c</b>',											'merge 3' );
			a( '<b>c[</b>]',			'<b>ca^</b>',											'merge 4' );

			// Rule 2. + Rule 3.
			a( '<b>c</b>[fo]o',			'<b>ca^</b>o',											'merge 5' );
			a( '<b>c[</b>fo]o',			'<b>ca^</b>o',											'merge 6' );

			a.insertion = '';
			a( '<a href="#">a</a>[b]<a href="#">c</a>',
			   '<a href="#">a^c</a>', 					'merge link in place' );

			a.insertion = '<a href="#">b</a>';
			a( '<a href="#">a^</a>',
			   '<a href="#">ab^</a>', 					'merge inserted link' );

			// More TCs can be found in corresponding 'GS. merging adjacent inline elements'.
		},

		'G5. inline element into inline element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<b>d</b>', 'html', CKEDITOR.ENTER_BR );

			a( '<u>c^</u>',				'<u>c</u><b>d^</b>',									'into a1' );
			a( '<u>^c</u>',				'<b>d^</b><u>c</u>',									'into a2' );
			a( '<u>a[b]c</u>',			'<u>a</u><b>d^</b><u>c</u>',							'into a3' );

			a.insertion = 'd<br />e';
			a.mode = null; // Test also 'text', because it can contain <brs />.

			a( '<u>c^</u>',
				{ html : '<u>c</u>d<br />e^', text : '<u>cd<br />e^</u>' },						'into b1' );
			a( '<u>^c</u>',
				{ html : 'd<br />e^<u>c</u>', text : '<u>d<br />e^c</u>' },						'into b2' );
			a( '<u>a[b]c</u>',
				{ html : '<u>a</u>d<br />e^<u>c</u>', text : '<u>ad<br />e^c</u>' },			'into b3' );

			a.insertion = '<u>d</u>';
			a.mode = 'html';

			a( '<u>c^</u>',				'<u>cd^</u>',											'into c1' );
			a( '<u>^c</u>',				'<u>d^c</u>',											'into c2' );
			a( '<u>a[b]c</u>',			'<u>ad^c</u>',											'into c3' );

			a.insertion = 'd<u>e</u>f';

			a( '<u>c^</u>',				'<u>c</u>d<u>e</u>f^',									'into d1' );
			a( '<u>^c</u>',				'd<u>e</u>f^<u>c</u>',									'into d2' );
			a( '<u>a[b]c</u>',			'<u>a</u>d<u>e</u>f^<u>c</u>',							'into d3' );
		},

		'G5. inline element into selected inline element' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '<b>d</b>', 'html', CKEDITOR.ENTER_BR );

			a( '<u>[c]</u>',				'<b>d^</b>',										'replace a1' );
			a( '[<u>c</u>]',				'<b>d^</b>',										'replace a2' );

			a.insertion = 'd<br />e';
			a.mode = null; // Test also 'text', because it can contain <brs />.

			a( '<u>[c]</u>',			{ html : 'd<br />e^', text : '<u>d<br />e^</u>' },		'replace b1' );
			a( '[<u>c</u>]',			{ html : 'd<br />e^', text : '<u>d<br />e^</u>' },		'replace b2' );

			a.insertion = '<u>d</u>';
			a.mode = 'html';

			a( '<u title="1">[c]</u>',				'<u>d^</u>',								'replace c1' );
			a( '[<u title="1">c</u>]',				'<u>d^</u>',								'replace c2' );
		},

		//
		// TCs group 6.
		// inline elements -> block elements
		//

		'G6. inline element into block element' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<b>d</b>', 'html' );

			a( '<p>^</p>',					'<p><b>d^</b></p>',									'into 1' );
			a( '<p>[ab]</p>',				'<p><b>d^</b></p>',									'into 1b' );
			a( '<p>aa^bb</p>',				'<p>aa<b>d^</b>bb</p>',								'into 2' );
			a( '<p><b>aa</b>^</p>',			'<p><b>aad^</b></p>',								'into 3' );
			a( '<p>^<b>aa</b></p>',			'<p><b>d^aa</b></p>',								'into 4' );
			a( '<p><u>[c]</u></p>',			'<p><b>d^</b></p>',									'replace 1' );
			a( '<p>[<u>c</u>]</p>',			'<p><b>d^</b></p>',									'replace 2' );

			a.insertion = 'd<br />e';
			a.mode = null; // Test also 'text', because it can contain <brs />.

			a( '<p>aa^bb</p>',			'<p>aad<br />e^bb</p>',									'into 5' );

			// TODO this test doesn't make sense now - it will make sense with rule 5.
			// a.insertion = '<br />';
			// TODO not possible, because of bogus removal?
			// a( '<p>^</p>',			'<p><br />^</p>',										'into 6' );
			// a( '<p>bb^</p>',			'<p>bb<br />^</p>',										'into 7' );
			// a( '<p>^cc</p>',			'<p><br />^cc</p>',										'into 8' );

			a.insertion = '';
			a( '<p>[ab]</p>',				'<p>^&nbsp;</p>',									'into 9' );
		},

		// Rule 4. + 5.
		'G6. inline element into block elements' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<b>bam</b>', 'html' );

			a( '<p>a[a</p><p>b]b</p>',					'<p>a<b>bam^</b>b</p>',					'merge 1' );
			a( '<ul><li><b>a[a</b></li><li>b]b</li></ul>',
				'<ul><li><b>abam^</b>b</li></ul>',												'merge 2' );

			a( '<p>a[a</p><div>b]b</div>',				'<p>a<b>bam^</b></p><div>b</div>',		'don\'t merge 1' );

			// Combos! Rule 2. + 4. + 5.
			a.insertion = '<b>b<u>am</u></b>';
			a( '<p>A<b>A<u>[A</u></b></p><p><b><u>B]B</u></b>B</p>',
				'<p>A<b>Ab<u>am^B</u></b>B</p>',												'merge 3' );
		},

		//
		// TCs groups 7-9.
		// block elements -> elements
		//

		'G7-9. splitting' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>bam</p><p>bar</p>' );

			a( '<p>a^b</p>',
				'<p>a</p><p>bam</p><p>bar^</p><p>b</p>',										'case 1a' );
			a( '<h1>a^b</h1>',
				'<h1>a</h1><p>bam</p><p>bar^</p><h1>b</h1>',									'case 1b' );
			a( '<p>ab^</p>',
				'<p>ab</p><p>bam</p><p>bar^</p>',												'case 1c' );
			a( '<h1>^ab</h1>',
				'<p>bam</p><p>bar^</p><h1>ab</h1>',												'case 1d' );
			a( '<div><p>a^b</p></div>',
				'<div><p>a</p><p>bam</p><p>bar^</p><p>b</p></div>',								'case 1e' );

			a( '<div>a^b</div>',			'<div>a<p>bam</p><p>bar^</p>b</div>',				'case 2a' );
			a( '<ul><li>a^b</li></ul>',		'<ul><li>a<p>bam</p><p>bar^</p>b</li></ul>',		'case 2b' );

			// Boundary permitted elements are inserted into split container.
			a.insertion = 'x<p>bam</p>y';
			a( '<p>a^b</p>',				'<p>ax</p><p>bam</p><p>y^b</p>',					'case 3a' );
			a( '<h1>a^b</h1>',				'<h1>ax</h1><p>bam</p><h1>y^b</h1>',				'case 3b' );
			a( '<div>a^b</div>',			'<div>ax<p>bam</p>y^b</div>',						'case 3c' );
			a( '<p>^ab</p>',				'<p>x</p><p>bam</p><p>y^ab</p>',					'case 3d' );
			a( '<h1>ab^</h1>',				'<h1>abx</h1><p>bam</p><h1>y^</h1>',				'case 3e' );

			a.mode = 'html';
			a.insertion = '<p>bam</p><b>c</b>d';
			a( '<p>a^b</p>',				'<p>a</p><p>bam</p><p><b>c</b>d^b</p>',				'case 4d' );
			a( '<h1>a^b</h1>',				'<h1>a</h1><p>bam</p><h1><b>c</b>d^b</h1>',			'case 4e' );
			a( '<div>a^b</div>',			'<div>a<p>bam</p><b>c</b>d^b</div>',				'case 4f' );

			// Permitted elements, but surounded by not-permitted ones are inserted directly.
			a.insertion = '<p>bam</p><b>x</b>y<p>bom</p>';
			a( '<p>a^b</p>',
				'<p>a</p><p>bam</p><b>x</b>y<p>bom^</p><p>b</p>',								'case 5a' );
			a( '<h1>a^b</h1>',
				'<h1>a</h1><p>bam</p><b>x</b>y<p>bom^</p><h1>b</h1>',							'case 5b' );
			a( '<div>a^b</div>',
				'<div>a<p>bam</p><b>x</b>y<p>bom^</p>b</div>',									'case 5c' );

			// TODO in above cases we need autoParagraphing and fixForBody for the middle part of insertion :/.

			a.insertion = '<b>bom</b>x<p>bam</p>y<b>bim</b>';
			a( '<p><b>a^b</b></p>',
				'<p><b>abom</b>x</p><p>bam</p><p>y<b>bim^b</b></p>',							'case 6a' );

			a( '<p><b>a[b</b></p><p><b>c]d</b></p>',
				'<p><b>abom</b>x</p><p>bam</p><p>y<b>bim^d</b></p>',							'case 6b' );

			// TODO it would be better to place caret inside split element, but
			// it seems to be not critical - manual tests showed that copying&pasting hr
			// works fine in browsers.
			// a.insertion = '<hr />';
			// a( '<p>a^b</p>',				'<p>a</p><hr /><p>^b</p>',							'case 7a' );

			// Splitting for single line, because block is not contained in handled by rule 7.
			a.insertion = '<form>bam</form>';
			a( '<p>a^b</p>',				'<p>a</p><form>bam^</form><p>b</p>',				'case 8a' );
			a( '<h1>a^b</h1>',				'<h1>a</h1><form>bam^</form><h1>b</h1>',			'case 8b' );
		},

		'G7-9. splitting - reuse element' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'x<p title="1">bam</p>y', 'html' );

			a( '<p title="2">a^b</p>',
				'<p title="2">ax</p><p title="1">bam</p><p title="2">y^b</p>',					'case 1a' );
		},

		'G7-9. splitting - multi selection' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', 'x<p>bam</p>y' );

			a( '<p>a[b</p><p>c]d</p>',
				'<p>ax</p><p>bam</p><p>y^d</p>',												'case 1a' );

			a( '<p title="1">a[b</p><p title="2">c]d</p>',
				'<p title="1">ax</p><p>bam</p><p title="2">y^d</p>',							'case 2a' );

			a( '<p title="1">a[b</p><div>c]d</div>',
				'<p title="1">ax</p><p>bam</p><div>y^d</div>',									'case 2b' );

			a( '<p>a[b</p><ul><li>c]d</li></ul>',
				'<p>ax</p><p>bam</p><ul><li>y^d</li></ul>',										'case 2c' );

			a.insertion = 'x<p>bam</p><p>bom</p>y';
			a( '<p>a[b</p><div>c]d</div>',
				'<p>ax</p><p>bam</p><p>bom</p><div>y^d</div>',									'case 3a' );

			a.mode = 'html';
			a.insertion = 'a<b>b</b><p>bam</p><p>bam</p>c<b>d</b>e';
			a( '<p>a^b</p>',
				'<p>aa<b>b</b></p><p>bam</p><p>bam</p><p>c<b>d</b>e^b</p>',						'case 4a' );
		},

		// See _docs/blockselections.txt
		'G7-9. splitting - text + eol' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<br data-cke-eol="1" />bam' );

			a( '<p>a^b</p>',				'<p>a</p><p>bam^b</p>',								'case 1a' );
			a( '<p>^ab</p>',				'<p>&nbsp;</p><p>bam^ab</p>',						'case 1b' );
			a( '<div>a^b</div>',			'<div>a</div><div>bam^b</div>',						'case 1c' );

			// Only p,div are affected.
			a( '<h1>a^b</h1>',				'<h1>a<br />bam^b</h1>',							'case 1d' );

			a.insertion = 'bam<br data-cke-eol="1" />';

			a( '<p>a^b</p>',				'<p>abam</p><p>^b</p>',								'case 2a' );
			a( '<p>ab^</p>',				'<p>abbam</p><p>^&nbsp;</p>',						'case 2b' );
			a( '<div>a^b</div>',			'<div>abam</div><div>^b</div>',						'case 2c' );

			a( '<h1>a^b</h1>',				'<h1>abam<br />^b</h1>',							'case 2d' );

			a.insertion = '<p>bam</p><br data-cke-eol="1" />';

			a( '<p>a^b</p>',				'<p>a</p><p>bam</p><p>^b</p>',						'case 3a' );
			// TODO
			// a( '<p>ab^</p>',				'<p>ab</p><p>bam</p><p>^&nbsp;</p>',					'case 3b' );
			a( '<p>ab^</p>',				'<p>ab</p><p>bam</p>^',								'case 3b' );
			a( '<p>^ab</p>',				'<p>bam</p><p>^ab</p>',								'case 3c' );
			a( '<div>a^b</div>',			'<div>a<p>bam</p>^b</div>',							'case 3d' );
			a( '<h1>a^b</h1>',				'<h1>a</h1><p>bam</p><h1>^b</h1>',					'case 3e' );

			a.insertion = '<br data-cke-eol="1" /><p>bam</p>';

			a( '<p>a^b</p>',				'<p>a</p><p>bam^</p><p>b</p>',						'case 4a' );
			a( '<p>ab^</p>',				'<p>ab</p><p>bam^</p>',								'case 4b' );
			// TODO
			// a( '<p>^ab</p>',				'<p>&nbsp;</p><p>bam^</p><p>ab</p>',				'case 4c' );
			a( '<p>^ab</p>',				'<p>bam^</p><p>ab</p>',								'case 4c' );
			a( '<div>a^b</div>',			'<div>a<p>bam^</p>b</div>',							'case 4d' );
			a( '<h1>a^b</h1>',				'<h1>a</h1><p>bam^</p><h1>b</h1>',					'case 4e' );
		},

		// These cases were previously handled positively. Test for regressions.
		'G7-9. splitting - text + eol - reverted cases' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<br />bam' );

			a( '<p>a^b</p>',				'<p>a<br />bam^b</p>',								'case 1' );

			a.insertion = 'bam<br />';
			a( '<p>a^b</p>',				'<p>abam<br />^b</p>',								'case 2' );

			a.insertion = '<p>bam</p><br />';
			a( '<p>a^b</p>',				'<p>a</p><p>bam</p><p><br />^b</p>',				'case 3' );

			// TODO is this a correct TC?
			// No <br> before </p> because of bogus removal.
			// a.insertion = '<br /><p>bam</p>';
			// a( '<p>a^b</p>',				'<p>a</p><p>bam^</p><p>b</p>',						'case 4' );

			a.insertion = '<br />';
			a( '<p>a^b</p>',				'<p>a<br />^b</p>',									'case 5a' );
			a( '<p>^ab</p>',				'<p><br />^ab</p>',									'case 5c' );
			a( '<div>a^b</div>',			'<div>a<br />^b</div>',								'case 5d' );

			a.insertion = '<br /><br />';
			a( '<p>a^b</p>',				'<p>a<br /><br />^b</p>',							'case 6a' );
			a( '<p>^ab</p>',				'<p><br /><br />^ab</p>',							'case 6c' );
			a( '<div>a^b</div>',			'<div>a<br /><br />^b</div>',						'case 6d' );
		},

		'G7-9. filtering content' : function() {
			// Form chosen, so it's not stripped by rule 7.
			var a = this.createAssertInsertionFunction( 'h1', '<form>bam</form>', 'html' );

			a( 'a^b',						'abam^b',											'case 1a' );
			a( '<span><b>a^b</b></span>',
				'<span><b>a</b></span>bam^<span><b>b</b></span>',								'case 1b' );

			// Do not break editable
			a.insertion = '<br data-cke-eol="1" />';
			a( 'a^b',						'a<br />^b',										'case 2a' );
			a.insertion = '<br data-cke-eol="1" />bam';
			a( 'a^b',						'a<br />bam^b',										'case 2b' );

			a.mode = 'html';

			a.insertion = 'x<div>bam</div>y<table><tr><td>u</td><td>w</td></tr></table>z';
			a( 'a^b',						'ax bam y u w z^b',									'case 3a' );
			a.insertion = '<ul><li>x</li><li>y<ul><li>X</li><li>Y</li></ul></li><li>z</li></ul>';
			a( 'a^b',						'ax y X Y z^b',										'case 3b' );

			a.insertion = '<p><b>bam</b></p>';
			a( '<b>a</b>[c]<b>d</b>',		'<b>abam^d</b>',									'case 5a' );

			a.insertion = '<p><b>b</b>a<br />m</p>';
			a( 'a^b',		'a<b>b</b>a<br />m^b',												'case 6a' );
		},

		//
		// TCs group special.
		//

		// Part of rule 2.
		'GS. inline elements splitting for HTML being pasted' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( 'foo<u>w<b>x[y]z</b></u>baz',
				{	html : 'foo<u>w<b>x</b></u>bam^<u><b>z</b></u>baz',
					text : 'foo<u>w<b>xbam^z</b></u>baz' },										'split nested' );
			a( 'foo<u>x<b>[y]</b>z</u>baz',
				{	html : 'foo<u>x</u>bam^<u>z</u>baz',
					text : 'foo<u>x<b>bam^</b>z</u>baz' },										'split nested 2' );
			a( 'foo<u title="a">x^z</u>baz',
				{	html : 'foo<u title="a">x</u>bam^<u title="a">z</u>baz',
					text : 'foo<u title="a">xbam^z</u>baz' },									'copy attributes' );

			a( '<p>a<b>c^d</b>e</p>',
				{	html : '<p>a<b>c</b>bam^<b>d</b>e</p>',
					text : '<p>a<b>cbam^d</b>e</p>' },											'preserve block' );
		},

		// Rule 2.
		'GS. merging adjacent inline elements' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, 'bam', null, CKEDITOR.ENTER_BR );

			a( 'x[<b>a</b>def]<b>c</b>y',
				{	html : 'xbam^<b>c</b>y',
					text : 'x<b>bam^c</b>y' },													'merge 1a' );
			a( 'x<u>b[ar</u><br /><u>ba]z</u>y',
				{	html : 'x<u>b</u>bam^<u>z</u>y',
					text : 'x<u>bbam^z</u>y' },													'merge 1b' );
			a( 'x<u>b[<b>a</b>r</u> <u>ba]<b>z</b></u>y',
				{	html : 'x<u>b</u>bam^<u><b>z</b></u>y',
					text : 'x<u>b<b>bam^z</b></u>y' },											'merge 1c' );
			a( 'x<u>b[</u> <u>ba<b><i>]z</i></b></u>y',
				{	html : 'x<u>b</u>bam^<u><b><i>z</i></b></u>y',
					text : 'x<u>bbam^<b><i>z</i></b></u>y' },									'merge 1d' );
			a( 'x<b>a[b</b>cde]<b>f</b>y',
				{	html : 'x<b>a</b>bam^<b>f</b>y',
					text : 'x<b>abam^f</b>y' },													'merge 1e' );
			a( 'x<b>ab[</b>cde<b>f]e</b>y',
				{	html : 'x<b>ab</b>bam^<b>e</b>y',
					text : 'x<b>abbam^e</b>y' },												'merge 1f' );
			a( 'x<b><u>a[a</u>b</b>cde]<b>f</b>y',
				{	html : 'x<b><u>a</u></b>bam^<b>f</b>y',
					text : 'x<b><u>abam^</u>f</b>y' },											'merge 1g' );

			a.insertion = '<b>bam</b>';
			a.mode = 'html';

			// These simple cases will probably be moved to TCs to G4-6.
			a( 'x<b>a</b>^y',					'x<b>abam^</b>y',								'merge 2a' );
			a( 'x^<b>a</b>y',					'x<b>bam^a</b>y',								'merge 2b' );
			a( 'x<b>a[b]c</b>y',				'x<b>abam^c</b>y',								'merge 2c' );
			a( 'x<b>a</b>[b]<b>c</b>y',			'x<b>abam^c</b>y',								'merge 2d' );

			a.insertion = '<b><u>b</u>a<i>m</i></b>';

			a( 'x<b><u>a</u></b>^y',			'x<b><u>ab</u>a<i>m^</i></b>y',					'merge 3a' );
			a( 'x^<b><u>a</u></b>y',			'x<b><u>b</u>a<i>m^</i><u>a</u></b>y',			'merge 3b' );
			a( 'x<b>a[b]<i>c</i></b>y',			'x<b>a<u>b</u>a<i>m^c</i></b>y',				'merge 3c' );
			a( 'x<b><u>a</u></b>[b]<b><i>c</i></b>y',
				'x<b><u>ab</u>a<i>m^c</i></b>y',												'merge 3d' );

/*
			a.insertion = '';
			a.mode = null;

			// TODO do not merge in both cases?
			a( 'x<b>a<u>b</u></b>[c]<b><u>d</u>e</b>y',	'x<b>a<u>b</u></b>^<b><u>d</u>e</b>y',	'merge 4a' );
*/
		},

		// Rule 2. does not apply.
		'GS. merging adjacent inline elements - exceptions' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '', null, CKEDITOR.ENTER_BR );

			a.insertion = '<br />';
			a( 'a<br />^<br />a',				'a<br /><br />^<br />a',						'don\'t merge 1' );

			a.insertion = '<b title="1">x</b>';
			a.mode = 'html';
			a( 'a<b>c</b>^d',				'a<b>c</b><b title="1">x^</b>d',					'don\'t merge 2' );

			a.insertion = '<b style="color: red">x</b>';
			a( 'a<b style="color: blue">c</b>^d',
				/^a<b style="color: blue;?">c<\/b><b style="color: red;?">x\^<\/b>d$/,			'don\'t merge 3' );

			a.insertion = '';
			a.mode = null;

			// TODO Q: where the caret should go?
			// a( '<p>aaa</p>[bb]<p>ccc</p>', '<p>aaa</p>^<p>ccc</p>', 'do not merge blocks' );
		},

		// Rule 3.
		'GS. moving caret to the element which is at the very end of insertion' : function() {
			var a = this.createAssertInsertionFunction( this.editablesNames, '', 'html', CKEDITOR.ENTER_BR );

			a.insertion = 'cc<b>dd</b>';
			a( 'aa^aa',			'aacc<b>dd^</b>aa',												'rule 3. example 1.' );

			a.insertion = 'cc<b>dd</b> ';
			a( 'aa^aa',			'aacc<b>dd</b> ^aa',											'rule 3. example 2.' );

			a.insertion = '';
			a( '<a href="#">a[</a>b]', 					'<a href="#">a^</a>', 					'move into inline link' );
			a( '<i><a href="#">a[</a></i>b]', 			'<i><a href="#">a^</a></i>', 			'move into inline link' );
			a( '<i><a href="#">a&nbsp;[</a></i>b]', 	'<i><a href="#">a&nbsp;</a></i>^', 		'dont move into inline link end with &nbsp;' );

			a.insertion = 'cc<b>dd</b>&nbsp;';
			a( 'aa^aa',			'aacc<b>dd</b>&nbsp;^aa',										'rule 3. example 2.' );

			a.insertion = '<u><b>bam</b></u>';
			a( '^',				'<u><b>bam^</b></u>',											'into empty editable 1' );
			a( 'foo^bar',		'foo<u><b>bam^</b></u>bar',										'me 1' );

			a.insertion = '<u><b>b</b>am</u>';
			a( '^',				'<u><b>b</b>am^</u>',											'into empty editable 2' );
			a( 'foo^bar',		'foo<u><b>b</b>am^</u>bar',										'me 2' );

			a.insertion = '<u>b<b>am</b></u>';
			a( '^',				'<u>b<b>am^</b></u>',											'into empty editable 3' );
			a( 'foo^bar',		'foo<u>b<b>am^</b></u>bar',										'me 3' );

			a.insertion = 'cc<b>dd </b>';
			a( 'aa^aa',			'aacc<b>dd </b>^aa',											'rule 3. example 3.' );

			a.insertion = 'cc<b>dd&nbsp;</b>';
			a( 'aa^aa',			'aacc<b>dd&nbsp;</b>^aa',										'rule 3. example 3.' );

			a.insertion = '<u>b<b>am</b> </u>';
			a( '^',				'<u>b<b>am</b> </u>^',											'into empty editable 4' );
			a( 'foo^bar',		'foo<u>b<b>am</b> </u>^bar',									'me 4' );

			a.insertion = '<a><u>b<b>am </b></u></a>';
			a( '^',				'<a><u>b<b>am </b></u></a>^',									'into empty editable 5' );
			a( 'foo^bar',		'foo<a><u>b<b>am </b></u></a>^bar',								'me 5' );

		},

		// Rule 7.
		'GS. single line handling' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>bam</p>' );

			a( 'a^b',						'a<p>bam^</p>b',									'case 0' );

			a( '<p>a^b</p>',				'<p>abam^b</p>',									'case 1a' );
			a( '<h1>a^b</h1>',				'<h1>abam^b</h1>',									'case 1b' );
			a( '<p>ab^</p>',				'<p>abbam^</p>',									'case 1c' );
			a( '<h1>^ab</h1>',				'<h1>bam^ab</h1>',									'case 1d' );
			a( '<div><p>a^b</p></div>',		'<div><p>abam^b</p></div>',							'case 1e' );

			a( '<div>a^b</div>',			'<div>abam^b</div>',								'case 2a' );
			a( '<ul><li>a^b</li></ul>',		'<ul><li>abam^b</li></ul>',							'case 2b' );

			// Keep styles for html flavor and inherit for text.
			a( '<p><b>a<i>^b</i></b>c</p>',
				{	html : '<p><b>a</b>bam^<b><i>b</i></b>c</p>',
					text : '<p><b>a<i>bam^b</i></b>c</p>' },									'case 3a' );

			a.mode = 'html';
			a.insertion = '<div><b>ba</b>r</div>';

			a( 'a^b',							'a<div><b>ba</b>r^</div>b',						'case 4a' );

			a( '<p>^ab</p>',					'<p><b>ba</b>r^ab</p>',							'case 4b' );
			a( '<div>ab^</div>',				'<div>ab<b>ba</b>r^</div>',						'case 4c' );
			a( '<div>^ab</div>',				'<div><b>ba</b>r^ab</div>',						'case 4d' );
			a( '<ul><li>ab^</li></ul>',			'<ul><li>ab<b>ba</b>r^</li></ul>',				'case 4e' );

			// Merge correctly.
			a( '<p><b>a^b</b>c</p>',			'<p><b>aba</b>r^<b>b</b>c</p>',					'case 5a' );
		},

		'GS. cleanup empty blocks' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>bam</p>' );

 			a( '<p>[foo</p><p>bar]</p>', '<p>bam^</p>', 'remove empty P at the end' );
			a( '<p>[foo</p><div><p>bar]</p></div>', '<p>bam^</p>', 'remove empty DIV>P at the end' );
			a( '<p>[foo</p><ul><li>bar]</li></div>', '<p>bam^</p>', 'remove empty UL>LI at the end' );
			a( '<p>[foo</p><ul><li>bar]</li><li>baz</li></ul></div>', '<p>bam^</p><ul><li>baz</li></ul>', 'Not remove UL>LIs at the end' );
			a( '<p>[foo</p><table><tr><td>bar]</td></tr></table></div>', '<p>bam^</p>', 'remove empty TABLE>TR>TD at the end' );
			a( '<p>[foo</p><table><caption>baz</caption><tr><td>bar]</td></tr></table></div>', '<p>bam^</p>', 'remove emtpy TABLE>TR>TD at the end (with caption)' );
			a( '<p>[foo</p><table><tr><td>bar]</td><td>baz</td></tr></table></div>', '<p>bam^</p><table><tbody><tr><td>baz</td></tr></tbody></table>', 'NOT remove TABLE>TR>TD at the end' );

			//TODO: Expand tcs to cover empty block results from splitting.
		},

		// Rule 7. doesn't apply here.
		'GS. single line handling - exceptions' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '', 'html', CKEDITOR.ENTER_BR );

			a.insertion = '<br data-cke-eol="1" /><p>bar</p>';
			a( 'a^b',							'a<p>bar^</p>b',								'case 1a' );
			a( '<p>a^b</p>',					'<p>a</p><p>bar^</p><p>b</p>',					'case 1b' );

			a.insertion = '<p>b<br />ar</p>';
			a( 'a^b',							'a<p>b<br />ar^</p>b',							'case 2a' );
			a( '<p>a^b</p>',					'<p>a</p><p>b<br />ar^</p><p>b</p>',			'case 2b' );

			a.insertion = '<div>b<p>a</p>r</div>';
			a( 'a^b',							'a<div>b<p>a</p>r^</div>b',						'case 3a' );
			a( '<p>a^b</p>',					'<p>a</p><div>b<p>a</p>r^</div><p>b</p>',		'case 3b' );

			// TODO
			// htmlDataProcessor.toHtml produces space after <hr /> in IE7,8 - to be fixed later.
			a.insertion = 'x<hr />y';
			a( 'a^b',							/^ax<hr \/> ?y\^b$/,							'case 4a' );
			a( '<p>a^b</p>',					'<p>ax</p><hr /><p>y^b</p>',					'case 4b' );

			a.insertion = '<p>x</p><p>y</p>';
			a( 'a^b',							'a<p>x</p><p>y^</p>b',							'case 5a' );
			a( '<p>a^b</p>',					'<p>a</p><p>x</p><p>y^</p><p>b</p>',			'case 5b' );

			// Rule 7. doesn't apply when pasting into the empty paragraph (empty means no text - spaces don't count).
			a.insertion = '<h1>abc</h1>';
			if ( !CKEDITOR.env.needsNbspFiller )
				a( '<p>x</p><p>^<br></p><p>x</p>',
					'<p>x</p><h1>abc^</h1><p>x</p>',											'case 6a' );
			else
				a( '<p>x</p><p>^&nbsp;</p><p>x</p>',
					'<p>x</p><h1>abc^</h1><p>x</p>',											'case 6b' );
		},

		'GS. block bogus' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '' );

			if ( CKEDITOR.env.needsBrFiller ) {
				a.insertion = 'bam';
				a( '<p>^<br /></p>',			'<p>bam^</p>',									'text inserted before bogus' );
				a( '<p><br />^</p>',			'<p>bam^</p>',									'text inserted after bogus' );

				a.insertion = 'bam<br />';
				a( '<p>^<br /></p>',			'<p>bam<br />^&nbsp;</p>',						'line break inserted before bogus' );
				a.insertion = '<br />bam';
				a( '<p><br />^</p>',			'<p><br />bam^</p>',							'line break inserted after bogus' );

				a.insertion = '<p>bam<br /></p>';
				a( '<p>^<br /></p>',			'<p>bam^</p>',									'two bogus collide' );
				a( '<p>foo^<br />bar</p>',		'<p>foobam^<br />bar</p>',						'bogu meet linebreak' );
			}
			else
			{
				a.insertion = 'bam';
				a( '<p>^&nbsp;</p>',			'<p>bam^</p>',									'text inserted before bogus' );

				a.insertion = 'bam&nbsp;';
				a( '<p>^&nbsp;</p>',			'<p>bam&nbsp;^</p>',							'NBSP inserted before bogus' );
			}
		},

		// Rule 8.
		'GS. blocks inheriting inline styles in text mode' : function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>abc</p><p>def</p>' );

			// Case from docs.
			a( '<p><b>x^y</b></p>',
				{	html : '<p><b>x</b></p><p>abc</p><p>def^</p><p><b>y</b></p>',
					text : '<p><b>x</b></p><p><b>abc</b></p><p><b>def^</b></p><p><b>y</b></p>' },
																								'case 1a' );

			a.mode = 'text';

			a( '<p><b>^xy</b></p>',
				'<p><b>abc</b></p><p><b>def^</b></p><p><b>xy</b></p>',							'case 2a' );
			a( '<p><b>xy^</b></p>',
				'<p><b>xy</b></p><p><b>abc</b></p><p><b>def^</b></p>',							'case 2b' );
			// Caret outside - no styles applied.
			a( '<p>x^<b>yz</b></p>',
				'<p>x</p><p>abc</p><p>def^</p><p><b>yz</b></p>',								'case 2c' );
			a( '<p><b>x<i>y^z<u>w</u></i></p>',
				'<p><b>x<i>y</i></b></p><p><b><i>abc</i></b></p><p><b><i>def^</i></b></p><p><b><i>z<u>w</u></i></b></p>',
																								'case 2d' );

			a( '<p><span title="text">x^y</span></p>',
				'<p><span title="text">x</span></p><p><span title="text">abc</span></p><p><span title="text">def^</span></p><p><span title="text">y</span></p>',
																								'case 3a' );
			a( '<p><a href="#">x^y</a></p>',
				'<p><a href="#">x</a></p><p><a href="#">abc</a></p><p><a href="#">def^</a></p><p><a href="#">y</a></p>',
																								'case 3b' );

			a.insertion = '<p>def</p>abc';
			a( '<p><b>x^y</b></p>',
				'<p><b>x</b></p><p><b>def</b></p><p><b>abc^y</b></p>',							'case 4a' );

			// TODO Fix data processor in IE on introducing whitespace that confuses the parser at the end of pseudo block.
			if ( !( CKEDITOR.env.ie && ( document.documentMode || CKEDITOR.env.version ) < 9 ) ) {
				a.insertion = 'abc<p>def</p>';
				a( '<p><b>x^y</b></p>',
					'<p><b>xabc</b></p><p><b>def^</b></p><p><b>y</b></p>',							'case 4b' );
			}

			// Not a text in fact, so shouldn't be insertText used for that, but nice to check.
			a.insertion = '<ul><li>a</li><li>b</li></ul>';
			a( '<p><b>x^y</b></p>',
				'<p><b>x</b></p><ul><li><b>a</b></li><li><b>b^</b></li></ul><p><b>y</b></p>',
																								'case 5a' );

			a.insertion = '<p>abc</p><p>def</p>';
			a( '<p>[<b>x]y</b></p>',
				'<p><b>abc</b></p><p><b>def^</b></p><p><b>y</b></p>',							'case 6a' );
			a( '<p><b>x[y</b>]</p>',
				'<p><b>x</b></p><p><b>abc</b></p><p><b>def^</b></p>',							'case 6b' );
			a( '<p><b>y[x</b></p><p><b>x]z</b></p>',
				'<p><b>y</b></p><p><b>abc</b></p><p><b>def^</b></p><p><b>z</b></p>',			'case 6c' );

			a( '<table><tbody><tr><td><b>x[y</b></td><td><u>y]z</u></td></tr></tbody></table>',
				'<table><tbody><tr><td><b>x</b><p><b>abc</b></p><p><b>def^</b></p></td><td><u>z</u></td></tr></tbody></table>',
																								'case 6d' );

			// Should be handled as inline content, but worth checking.
			a.insertion = '<p>abc</p>';
			a( '<p><b>x^y</b></p>',
				'<p><b>xabc^y</b></p>',															'case 7a' );

			// TODO Small bug - caret should end in <b>^y.
			a.insertion = '<p>abc</p><p>def</p><br data-cke-eol="1" />';
			a( '<p><b>x^y</b></p>',
				'<p><b>x</b></p><p><b>abc</b></p><p><b>def</b></p><p>^<b>y</b></p>',			'case 8a' );
			a.insertion = '<br data-cke-eol="1" />abc';
			a( '<p><b>x^y</b></p>',
				'<p><b>x</b></p><p><b>abc^y</b></p>',											'case 8b' );

			var a = this.createAssertInsertionFunction( 'h1', '<p>abc</p><p>def</p>' );

			// TODO correct result for text should be: '<b>xabc def^y</b>'
			a( '<b>x^y</b>',
				{	html : '<b>x</b>abc def^<b>y</b>',
					text : '<b>xabc</b> <b>def^y</b>' },										'case 9a' );
		},

		'#136 - remove &lt;br&gt; before and after inserted block': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<p>aaa</p><p>bbb</p>', 'html' );

			a( '<p>x<br />^<br />y</p>',	'<p>x</p><p>aaa</p><p>bbb^</p><p>y</p>',			'case 1a' );
			a( '<p>x<br />^</p>',			'<p>x</p><p>aaa</p><p>bbb^</p>',					'case 1b' );
			a( '<p>^<br />y</p>',			'<p>aaa</p><p>bbb^</p><p>y</p>',					'case 1c' );
		}
	} );

} )();