/* bender-tags: editor,unit */

( function() {

	'use strict';

	bender.editor = true;

	var getInnerHtml = bender.tools.getInnerHtml,
		fixHtml = bender.tools.fixHtml,
		doc = CKEDITOR.document,
		playground;

	function getStyle( definitionOrStyle, enterMode ) {
		if ( definitionOrStyle instanceof CKEDITOR.style )
			return definitionOrStyle;

		var style = new CKEDITOR.style( definitionOrStyle );

		// We need to do what stylescombo/format plugins do internally.
		style._.enterMode = enterMode || CKEDITOR.ENTER_P;

		return style;
	}

	function assertAppliedStyle( container, range, definitionOrStyle, expectedOutput ) {
		getStyle( definitionOrStyle ).applyToRange( range );

		assert.areSame( expectedOutput, makeShortcuts( getInnerHtml( container ) ) );
	}

	function assertAppliedStyle2( container, definitionOrStyle, htmlWithRange, expectedOutput, msg ) {
		var range = bender.tools.setHtmlWithRange( container, expandShortcuts( htmlWithRange ), container )[ 0 ];

		getStyle( definitionOrStyle ).applyToRange( range );

		assert.areSame( expectedOutput, makeShortcuts( getInnerHtml( container ) ), msg );
	}

	function assertRemovedStyle2( container, definitionOrStyle, htmlWithRange, expectedOutput, msg ) {
		var range = bender.tools.setHtmlWithRange( container, expandShortcuts( htmlWithRange ), container )[ 0 ];

		getStyle( definitionOrStyle ).removeFromRange( range );

		assert.areSame( expectedOutput, makeShortcuts( getInnerHtml( container ) ), msg );
	}

	function createAssertionFunction2( tcs, tcsGroupName, definitionOrStyle, enterMode ) {
		var style = getStyle( definitionOrStyle, enterMode );

		return {
			a: function( htmlWithRange, expectedOutput, msg ) {
				if ( tcs[ tcsGroupName + ' - ' + msg ] )
					throw new Error( 'Test named "' + tcsGroupName + ' - ' + msg + '" already exists' );

				tcs[ tcsGroupName + ' - ' + msg ] = function() {
					assertAppliedStyle2( playground, style, htmlWithRange, expectedOutput );
				};
			},
			r: function( htmlWithRange, expectedOutput, msg ) {
				if ( tcs[ tcsGroupName + ' - ' + msg ] )
					throw new Error( 'Test named "' + tcsGroupName + ' - ' + msg + '" already exists' );

				tcs[ tcsGroupName + ' - ' + msg ] = function() {
					assertRemovedStyle2( playground, style, htmlWithRange, expectedOutput );
				};
			}
		};
	}

	function expandShortcuts( html ) {
		return html
			.replace( /@c=t/g, 'contenteditable="true"' )
			.replace( /@c=f/g, 'contenteditable="false"' )
			.replace( /@f=(\d+)/g, 'data-cke-filter="$1"' );
	}

	function makeShortcuts( html ) {
		return html
			.replace( /contenteditable="true"/g, '@c=t' )
			.replace( /contenteditable="false"/g, '@c=f' )
			.replace( /data-cke-filter="(\d+)"/g, '@f=$1' );
	}

	var tcs = {
		setUp: function() {
			playground = doc.getById( 'playground' );
		},

		// Backward comaptibility.
		'test apply to (remove from) document': function() {
			var ct = playground;
			bender.tools.setHtmlWithSelection( ct, '<p>[foo]</p>' );
			var style = new CKEDITOR.style( { element: 'i' } );

			style.apply( doc );
			var output = bender.tools.getHtmlWithSelection( ct );
			assert.areSame( '<p><i>[foo]</i></p>', output, 'test style apply to document' );

			style.remove( doc );
			output = bender.tools.getHtmlWithSelection( ct );
			assert.areSame( '<p>[foo]</p>', output, 'test style remove from document' );
		},

		'test apply to (remove from) editor': function() {
			this.editorBot.setHtmlWithSelection( '<p>[foo]</p>' );
			var style = new CKEDITOR.style( { element: 'em' } );

			style.apply( this.editor );
			var output = this.editorBot.htmlWithSelection();
			assert.areSame( '<p><em>[foo]</em></p>', output, 'test style apply to document' );

			style.remove( this.editor );
			output = this.editorBot.htmlWithSelection();
			assert.areSame( '<p>[foo]</p>', output, 'test style remove from document' );
		},

		test_inline1: function() {
			playground.setHtml( 'this is some sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground.getFirst(), 5 );
			range.setEnd( playground.getFirst(), 7 );

			assertAppliedStyle( playground, range, { element: 'b' }, 'this <b>is</b> some sample text' );
		},

		test_inline2: function() {
			playground.setHtml( 'this <b>is some </b>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground.getChild( 1 ), 0 );
			range.setEnd( playground, 2 );

			assertAppliedStyle( playground, range, { element : 'i' }, 'this <i><b>is some </b></i>sample text' );
		},

		test_inline3: function() {
			playground.setHtml( 'this <b>is some </b>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground.getChild( 1 ), 0 );
			range.setEnd( playground.getChild( 1 ).getFirst(), 2 );

			assertAppliedStyle( playground, range, { element: 'i' }, 'this <b><i>is</i> some </b>sample text' );
		},

		// Inline - Remove inner duplicates.
		test_inline4: function() {
			playground.setHtml( 'this <b>is some </b>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 3 );

			assertAppliedStyle( playground, range, { element: 'b' }, '<b>this is some sample text</b>' );
		},

		// Inline - Merge with next.
		test_inline5: function() {
			playground.setHtml( 'this <b>is some </b>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 1 );

			assertAppliedStyle( playground, range, { element: 'b' }, '<b>this is some </b>sample text' );
		},

		// Inline - Merge with previous.
		test_inline6: function() {
			playground.setHtml( 'this <b>is some </b>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 2 );
			range.setEnd( playground.getChild( 2 ), 6 );

			assertAppliedStyle( playground, range, { element: 'b' }, 'this <b>is some sample</b> text' );
		},

		// Inline - Merge several with next.
		test_inline7: function() {
			playground.setHtml( '<i><u>this </u></i><b><i><u>is</u> some</i> sample</b> text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 1 );

			assertAppliedStyle( playground, range, { element: 'b' }, '<b><i><u>this is</u> some</i> sample</b> text' );
		},

		// Inline - Merge several with previous.
		test_inline8: function() {
			playground.setHtml( 'this <b>is <i>some <u>sample</u></i></b><i><u> text</u></i>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 2 );
			range.setEnd( playground, 3 );

			assertAppliedStyle( playground, range, { element: 'b' }, 'this <b>is <i>some <u>sample text</u></i></b>' );
		},

		test_inline9: function() {
			playground.setHtml( 'this <i>is some </i>sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground.getChild( 1 ), 0 );

			assertAppliedStyle( playground, range, { element: 'b' }, '<b>this </b><i>is some </i>sample text' );
		},

		test_inline10: function() {
			playground.setHtml( 'this is some sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 1 );

			var style = {
				element: 'b',
				attributes: {
					lang: 'it',
					title: 'test'
				},
				styles: {
					'font-size': '10pt',
					'text-decoration': 'line-through'
				}
			};

			assertAppliedStyle( playground, range, style,
				'<b lang="it" style="font-size:10pt;text-decoration:line-through;" title="test">this is some sample text</b>' );
		},

		test_inline11: function() {
			playground.setHtml( 'this <b lang="it" class="sample">is</b> <b lang="it" style="font-size: 10pt; text-decoration: line-through;" title="test">some sample</b> <b>t</b>ext' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 7 );

			var style = {
				element: 'b',
				attributes: {
					lang: 'it',
					title: 'test'
				},
				styles: {
					'font-size': '10pt',
					'text-decoration': 'line-through'
				}
			};

			assertAppliedStyle( playground, range, style,
				'<b lang="it" style="font-size:10pt;text-decoration:line-through;" title="test">this <b class="sample">is</b> some sample text</b>' );
		},

		test_inline11b: function() {
			playground.setHtml( 'this <span class="a">is</span> some <span class="b">sample</span> text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 5 );

			assertAppliedStyle( playground, range,
				{ element : 'span', attributes : { 'class' : 'b' } },
				'<span class="b">this <span class="a">is</span> some sample text</span>' );
		},

		test_inline12: function() {
			playground.setHtml( 'this <span style="font-size:12pt; font-weight:600">is</span> some <span style="font-size:10px;">sample</span> text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground, 5 );

			assertAppliedStyle( playground, range,
				{ element : 'span', styles : { 'font-size' : '1.5em' } },
				'<span style="font-size:1.5em;">this <span style="font-weight:600;">is</span> some sample text</span>' );
		},

		test_inline13: function() {
			playground.setHtml( 'this <b>is some sample</b> text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground.getChild( 1 ).getFirst(), 3 );
			range.setEnd( playground, 3 );

			assertAppliedStyle( playground, range, { element : 'i' }, 'this <b>is <i>some sample</i></b><i> text</i>' );
		},

		test_inline15: function() {
			var para = playground;

			para.setHtml( 'this is some sample text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( para.getFirst(), 0 );
			range.setEnd( para.getFirst(), 7 );

			var style = new CKEDITOR.style( { element : 'span', styles : { 'font-family' : '#(family)' } }, { family : 'Arial,Helvetica,sans-serif' } );
			style.applyToRange( range );

			assert.areSame( fixHtml( '<span style="font-family:arial,helvetica,sans-serif;">this is</span> some sample text' ),
					fixHtml( getInnerHtml( playground ) ), 'First range' );

			para.setHtml( para.getHtml() );

			range = new CKEDITOR.dom.range( doc );
			range.setStart( para.getFirst().getFirst(), 5 );
			range.setEnd( para.getChild( 1 ), 5 );

			style = new CKEDITOR.style( { element : 'span', styles : { 'font-family' : '#(family)' } }, { family : 'Georgia,serif' } );
			style.applyToRange( range );

			assert.areSame( fixHtml( '<span style="font-family:arial,helvetica,sans-serif;">this <span style="font-family:georgia,serif;">is</span></span><span style="font-family:georgia,serif;"> some</span> sample text' ),
					fixHtml( getInnerHtml( playground ) ), 'Second range' );
		},

		test_inline16: function() {
			var para = playground;

			para.setHtml( '<b lang="pt" style="font-size:11pt;color:red;">this is some sample text</b>' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( para.getFirst().getFirst(), 4 );
			range.setEnd( para.getFirst(), 10 );

			assertAppliedStyle( playground, range,
				{ element : 'b', styles : { color : 'red', 'font-weight' : '700' } },
				'<b lang="pt" style="color:red;font-size:11pt;">this<b style="font-weight:700;"> is some sample text</b></b>' );
		},

		test_inline_nobreak1: function() {
			playground.setHtml( 'this is <a href="http://example.com/">some sample</a> text' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 0 );
			range.setEnd( playground.getChild( 1 ).getFirst(), 4 );

			assertAppliedStyle( playground, range, { element : 'b' }, '<b>this is </b><a href="http://example.com/"><b>some</b> sample</a> text' );
		},

		test_def_styles_attr: function() {
			var el = playground;
			el.setHtml( 'foo' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			var style1 = new CKEDITOR.style( { element : 'span', attributes : { style : 'font-weight:bold' } } ),
			style2 = new CKEDITOR.style( { element : 'span', attributes : { style : 'font-style:italic' } } );

			style1.applyToRange( range );
			style2.applyToRange( range );

			assert.areSame( '<span style="font-style:italic;"><span style="font-weight:bold;">foo</span></span>', getInnerHtml( playground ) );
		},

		test_def_styles: function() {
			var el = playground;
			el.setHtml( 'foo' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( el );

			var style1 = new CKEDITOR.style( { element : 'span', styles : { 'font-weight' : 'bold' } } ),
			style2 = new CKEDITOR.style( { element : 'span', styles : { 'font-style' : 'italic' } } );

			style1.applyToRange( range );
			style2.applyToRange( range );

			assert.areSame( '<span style="font-style:italic;"><span style="font-weight:bold;">foo</span></span>', getInnerHtml( playground ) );
		},

		'test "ins" style applied to the block contents': function() {
			assertAppliedStyle2( playground, { element : 'ins' }, '[<p>inserted text</p>]', '<p><ins>inserted text</ins></p>' );
		},

		'test "del" style applied to the outer of "ins" on block contents': function() {
			assertAppliedStyle2( playground, { element : 'del' }, '[<p><ins>deleted text</ins></p>]', '<p><del><ins>deleted text</ins></del></p>' );
		},

		'test apply anchor style': function() {
			playground.setHtml( 'foo' );
			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( playground );

			var style = {
				element: 'a',
				type: CKEDITOR.STYLE_INLINE,
				attributes: { href: '#' },
				styles: { 'line-height': '18px' }
			};

			assertAppliedStyle( playground, range, style, '<a href="#" style="line-height:18px;">foo</a>' );
		},

		test_ticket_2040: function() {
			playground.setHtml( 'This is some <strong>sample text<\/strong>. You are using <a href="http://www.fckeditor.net/">ckeditor<\/a>.' );

			var range = new CKEDITOR.dom.range( doc );
			range.setStart( playground, 1 );
			range.setEnd( playground.getChild( 1 ).getFirst(), 6 );

			assertAppliedStyle( playground, range, { element : 'i' },
				'this is some <strong><i>sample</i> text<\/strong>. you are using <a href="http://www.fckeditor.net/">ckeditor<\/a>.' );
		},

		test_ticket_3091: function() {
			var element = playground;
			element.setHtml( 'outter<table><tr><td>text</td></tr></table>outter' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( element );

			var styleDef =
			{
				element		: 'span',
				styles		: { 'font-family' : '#(family)' },
				overrides	: [ { element : 'font', attributes : { 'face' : null } } ]
			};

			var style = new CKEDITOR.style( styleDef, { 'family' : 'Arial,Helvetica,sans-serif' } );
			style.applyToRange( range );

			style = new CKEDITOR.style( styleDef, { 'family' : 'Comic Sans MS,cursive' } );
			style.applyToRange( range );

			style = new CKEDITOR.style( styleDef, { 'family' : 'Courier New,Courier,monospace' } );
			style.applyToRange( range );

			var output = '<span style="font-family:courier new,courier,monospace;">outter</span><table><tbody><tr><td><span style="font-family:courier new,courier,monospace;">text</span></td></tr></tbody></table><span style="font-family:courier new,courier,monospace;">outter</span>';

			assert.areSame( fixHtml( output ), fixHtml( getInnerHtml( element ) ) );
		},

		// TC based on the state of the second step in the above test, before it got fixed.
		test_ticket_3091_3: function() {
			var element = playground;
			element.setHtml( '<p><i title="y">text</i><i title="x"></i></p><i title="y">outter</i><i title="x"></i>' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( element );

			assertAppliedStyle( playground, range, { element : 'i', attributes : { title : 'z' } },
				'<p><i title="z">text</i></p><i title="z">outter</i>' );
		},

		// Remove inline style when range collapsed at element boundaries,
		// move out of the removing-style element, with inner style copied.
		test_ticket_3309: function() {
			var element = playground;
			element.setHtml( 'this is some <b><i id="_i1">styles</i></b> text' );

			// This is some <b><i>styles^</i></b> text
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_i1' ), CKEDITOR.POSITION_BEFORE_END );

			var style = new CKEDITOR.style( { element : 'b' } );
			style.removeFromRange( range );

			assert.areSame( 'this is some <b><i id="_i1">styles</i></b><i></i> text', getInnerHtml( element ) );
		},

		// No inner style preserved, simply move out of the removing-style element.
		test_ticket_3309_2: function() {
			var element = playground;
			element.setHtml( 'this is some <b id="_b1">styles</b> text' );

			// This is some <b>styles^</b> text
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_b1' ), CKEDITOR.POSITION_BEFORE_END );

			var style = new CKEDITOR.style( { element : 'b' } );
			style.removeFromRange( range );
			// This is some <b>styles</b>^ text
			assert.areSame( doc.getById( '_b1' ).getParent().$, range.startContainer.$ );
			assert.areSame( 2, range.startOffset );
			assert.areSame( 'this is some <b id="_b1">styles</b> text', getInnerHtml( element ) );
		},

		// With style overrides.
		test_ticket_3309_3: function() {
			var element = playground;
			element.setHtml( 'text <strong><span><b><i id="_i1">styles</i></b></span></strong>' );

			// text <strong><span><b><i id="_i1">^styles</i></b></span></strong>
			var range = new CKEDITOR.dom.range( doc );
			range.setStartAt( doc.getById( '_i1' ), CKEDITOR.POSITION_AFTER_START );

			var style = new CKEDITOR.style( { element : 'b' , overrides : [ 'strong' ] } );
			style.removeFromRange( range );

			// text <span><i>^</i></span><span><b><i>styles</i></b></span>
			assert.areSame( 'text <span><i></i></span><strong><span><b><i id="_i1">styles</i></b></span></strong>', getInnerHtml( element ) );
		},

		test_ticket_7492: function() {
			var element = playground;
			element.setHtml( 'one <b><span class="fonttimes"><i>two</i></span></b> three' );

			var range = new CKEDITOR.dom.range( doc );
			range.selectNodeContents( element );

			var style = new CKEDITOR.style(
				{
					element		: 'span',
					attributes	: { 'class' : '#(family)' },
					overrides	: [ { element : 'span', attributes : { 'class' : /^font(?:comic|courier|times)$/ } } ]
				}
				, { family : 'fontcourier' } );

			style.applyToRange( range );

			assert.areSame( '<span class="fontcourier">one <b><i>two</i></b> three</span>', getInnerHtml( element ) );

			range.selectNodeContents( element );

			var style = new CKEDITOR.style(
				{
					element		: 'span',
					attributes	: { 'class' : '#(family)' },
					overrides	: [ { element : 'span', attributes : { 'class' : /^font(?:comic|courier|times)$/ } } ]
				}
				, { family : 'fontcomic' } );

			style.applyToRange( range );

			assert.areSame( '<span class="fontcomic">one <b><i>two</i></b> three</span>', getInnerHtml( element ) );
		},

		// #8078
		'test remove heading style': function() {
			function doTest( enterMode, expected ) {
				var range = bender.tools.setHtmlWithRange( playground, '<h1>h[eadi]ng</h1>' )[ 0 ];
				var style = new CKEDITOR.style( { element : 'h1' } );
				style._.enterMode = enterMode;
				style.removeFromRange( range );
				assert.areSame( expected, getInnerHtml( playground ) );
			}

			doTest( CKEDITOR.ENTER_P, '<p>heading</p>' );
			doTest( CKEDITOR.ENTER_BR, 'heading' );
			doTest( CKEDITOR.ENTER_DIV, '<div>heading</div>' );
		},

		// #4772, #8232
		'test color styles applied inside of link': function() {
			var ct = playground;
			var range = bender.tools.setHtmlWithRange( ct, '[some text and <a href="javascript:void(0)">a link</a>]' )[ 0 ];
			var style = new CKEDITOR.style(
			{
				element : 'span',
				styles : { 'color' : 'red' },
				childRule: function( element ) {
					return element.getName() != 'a' ||
						   element.getElementsByTag( 'a' ).count();
				}
			} );

			style.applyToRange( range );
			assert.areSame( '<span style="color:red;">some text and </span><a href="javascript:void(0)"><span style="color:red;">a link</span></a>', getInnerHtml( playground ) );


			range = bender.tools.setHtmlWithRange( ct, '<a href="http://t/">foo[</a> bar]' )[ 0 ];
			style.applyToRange( range );
			assert.areSame( '<a href="http://t/">foo</a><span style="color:red;"> bar</span>', getInnerHtml( playground ) );
		},

		'test alwaysRemoveStyle': function() {
			var ct = playground;
			var range = bender.tools.setHtmlWithRange( ct, 'abc [<b class="a">def</b>] ghi' )[ 0 ];

			var style1 = new CKEDITOR.style( { element : 'b', type : CKEDITOR.STYLE_INLINE } ),
				style2 = new CKEDITOR.style( { element : 'b', type : CKEDITOR.STYLE_INLINE, alwaysRemoveElement : 1 } );

			style1.removeFromRange( range );
			assert.areSame( 'abc <b class="a">def</b> ghi', getInnerHtml( playground ) );

			style2.removeFromRange( range );
			assert.areSame( 'abc def ghi', getInnerHtml( playground ) );
		},

		'test filler is preserved when applying block style': function() {
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			assertAppliedStyle2( playground, { element: 'h1' }, '<p>^<br></p>', '<h1><br></h1>' );
		}
	};

	var t = createAssertionFunction2( tcs, 'test apply block style - paragraphs', { element: 'h1' } );

	t.a( '<p>x</p><p>a^b</p><p>x</p>', '<p>x</p><h1>ab</h1><p>x</p>', 'tc1' );
	t.a( '<p>x</p><p>[ab]</p><p>x</p>', '<p>x</p><h1>ab</h1><p>x</p>', 'tc2' );
	t.a( '<p>x</p><p>a[b</p><p>c]d</p><p>x</p>', '<p>x</p><h1>ab</h1><h1>cd</h1><p>x</p>', 'tc3' );
	t.a( '<p><b>a^b</b>c</p>', '<h1><b>ab</b>c</h1>', 'tc4' );


	t = createAssertionFunction2( tcs, 'test remove block style', { element: 'h1' } );

	t.r( '<h1>x</h1><h1>a^b</h1><h1>x</h1>', '<h1>x</h1><p>ab</p><h1>x</h1>', 'tc1' );
	t.r( '<h1>x</h1><h1>a[b</h1><h1>c]d</h1><h1>x</h1>', '<h1>x</h1><p>ab</p><p>cd</p><h1>x</h1>', 'tc2' );
	t.r( '<h1><b>a^b</b>c</h1>', '<p><b>ab</b>c</p>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test apply block style - bulleted lists', { element: 'h1' } );

	t.a( '<ul><li>x</li><li>a^b</li><li>x</li></ul>', '<ul><li>x</li><li><h1>ab</h1></li><li>x</li></ul>', 'tc1' );
	t.a( '<ul><li>x[y</li><li>a]b</li><li>x</li></ul>', '<ul><li><h1>xy</h1></li><li><h1>ab</h1></li><li>x</li></ul>', 'tc2' );
	t.a( '<ul><li><p>[x</p></li><li><p>a]</p><p>b</p></li><li>x</li></ul>', '<ul><li><h1>x</h1></li><li><h1>a</h1><p>b</p></li><li>x</li></ul>', 'tc3' );


	// #12273
	t = createAssertionFunction2( tcs, 'test apply block style - description lists', { element: 'h1' } );

	t.a( '<dl><dt>x</dt><dd>a^b</dd><dt>x</dt></dl>', '<dl><dt>x</dt><dd><h1>ab</h1></dd><dt>x</dt></dl>', 'tc1' );
	t.a( '<dl><dt>x[y</dt><dd>a]b</dd><dt>x</dt></dl>', '<dl><dt><h1>xy</h1></dt><dd><h1>ab</h1></dd><dt>x</dt></dl>', 'tc2' );
	t.a( '<dl><dt><p>[x</p></dt><dd><p>a]</p><p>b</p></dd><dt>x</dt></dl>', '<dl><dt><h1>x</h1></dt><dd><h1>a</h1><p>b</p></dd><dt>x</dt></dl>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test do not apply block styles to non-editable blocks', { element: 'h1' } );

	t.a( '<p>[x</p><p @c=f>a</p><div @c=f>b</div><p>x]</p>', '<h1>x</h1><p @c=f>a</p><div @c=f>b</div><h1>x</h1>', 'tc1' );
	t.a( '[<p @c=f>a</p>]', '<p @c=f>a</p>', 'tc2' );
	t.a( '[<div @c=f><p>a</p></div>]', '<div @c=f><p>a</p></div>', 'tc3' );
	t.a( '[<div @c=f><p>a</p>b</div>]', '<div @c=f><p>a</p>b</div>', 'tc4' );


	t = createAssertionFunction2( tcs, 'test do not remove block styles from non-editable blocks', { element: 'h1' } );

	t.r( '<h1>[x</h1><h1 @c=f>a</h1><h1>x]</h1>', '<p>x</p><h1 @c=f>a</h1><p>x</p>', 'tc1' );


	t = createAssertionFunction2( tcs, 'test apply block styles to blocks with non-editable inline elements', { element: 'h1' } );

	t.a( '<p>[x<i @c=f>a</i>x]</p>', '<h1>x<i @c=f>a</i>x</h1>', 'tc1' );
	t.a( '<p>[x</p><p><i @c=f>a</i></p><p>x]</p>', '<h1>x</h1><h1><i @c=f>a</i></h1><h1>x</h1>', 'tc2' );
	t.a( '<p>x<i @c=f>a</i>x^y</p>', '<h1>x<i @c=f>a</i>xy</h1>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test remove block styles from blocks with non-editable inline elements', { element: 'h1' } );

	t.r( '<h1>[x<i @c=f>a</i>x]</h1>', '<p>x<i @c=f>a</i>x</p>', 'tc1' );
	t.r( '<h1>[x</h1><h1><i @c=f>a</i></h1><h1>x]</h1>', '<p>x</p><p><i @c=f>a</i></p><p>x</p>', 'tc2' );


	t = createAssertionFunction2( tcs, 'test apply inline styles on non-editable inline elements', { element: 'b' } );

	t.a( '<p>y[x<i @c=f>a</i>x]y</p>', '<p>y<b>x</b><i @c=f>a</i><b>x</b>y</p>', 'tc1' );
	t.a( '<p>y[x<i @c=f>a</i><u @c=f>a</u>x]y</p>', '<p>y<b>x</b><i @c=f>a</i><u @c=f>a</u><b>x</b>y</p>', 'tc2' );
	t.a( '<p>y[x<i @c=f>a</i>z<u @c=f>a</u>x]y</p>', '<p>y<b>x</b><i @c=f>a</i><b>z</b><u @c=f>a</u><b>x</b>y</p>', 'tc3' );
	t.a( '<p>[x</p><p><i @c=f>a</i></p><p>x]</p>', '<p><b>x</b></p><p><i @c=f>a</i></p><p><b>x</b></p>', 'tc4' );


	t = createAssertionFunction2( tcs, 'test apply inline styles on non-editable inline elements - includeReadonly', { element: 'b', includeReadonly: true } );

	t.a( '<p>y[x<i @c=f>a</i>x]y</p>', '<p>y<b>x<i @c=f>a</i>x</b>y</p>', 'tc1' );
	t.a( '<p>y[x<i @c=f>a</i><u @c=f>a</u>x]y</p>', '<p>y<b>x<i @c=f>a</i><u @c=f>a</u>x</b>y</p>', 'tc2' );
	t.a( '<p>y[x<i @c=f>a</i>z<u @c=f>a</u>x]y</p>', '<p>y<b>x<i @c=f>a</i>z<u @c=f>a</u>x</b>y</p>', 'tc3' );
	t.a( '<p>[x</p><p><i @c=f>a</i>x]</p>', '<p><b>x</b></p><p><b><i @c=f>a</i>x</b></p>', 'tc4' );
	t.a( '<p>y[x<i @c=f>a<b>b</b></i>x]y</p>', '<p>y<b>x<i @c=f>a<b>b</b></i>x</b>y</p>', 'tc5' );
	t.a( '<p>[x</p><p><i @c=f>a</i></p><p>x]</p>', '<p><b>x</b></p><p><b><i @c=f>a</i></b></p><p><b>x</b></p>', 'tc6' );


	t = createAssertionFunction2( tcs, 'test apply inline styles on non-editable inline elements - includeReadonly & override',
		{ element: 'b', includeReadonly: true, overrides: [ 'u' ] } );

	t.a( '<p>y[x<i @c=f>a<b>b</b></i>x]y</p>', '<p>y<b>x<i @c=f>a<b>b</b></i>x</b>y</p>', 'tc1' );
	t.a( '<p>y[x<i @c=f>a<u>b</u></i>x]y</p>', '<p>y<b>x<i @c=f>a<u>b</u></i>x</b>y</p>', 'tc2' );


	t = createAssertionFunction2( tcs, 'test remove inline styles from non-editable inline elements', { element: 'b' } );

	t.r( '<p><b>y[x</b><i @c=f>a</i><b>x]y</b></p>', '<p><b>y</b>x<i @c=f>a</i>x<b>y</b></p>', 'tc1' );
	t.r( '<p><b>y[x</b><i @c=f>a<b>b</b></i><b>x]y</b></p>', '<p><b>y</b>x<i @c=f>a<b>b</b></i>x<b>y</b></p>', 'tc2' );
	// This case is not doable without includeReadonly, but it may be generated in e.g. source mode.
	t.r( '<p><b>y[x<i @c=f>a</i>x]y</b></p>', '<p><b>y</b>x<i @c=f>a</i>x<b>y</b></p>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test remove inline styles from non-editable inline elements - includeReadonly', { element: 'b', includeReadonly: true } );

	t.r( '<p><b>y[x<i @c=f>a</i>x]y</b></p>', '<p><b>y</b>x<i @c=f>a</i>x<b>y</b></p>', 'tc1' );
	t.r( '<p>[y<b>x<i @c=f>a</i><u @c=f>a</u>x</b>y]</p>', '<p>yx<i @c=f>a</i><u @c=f>a</u>xy</p>', 'tc2' );
	t.r( '<p>[y<b>x<i @c=f>a</i>]<u @c=f>a</u>x</b>y</p>', '<p>yx<i @c=f>a</i><b><u @c=f>a</u>x</b>y</p>', 'tc3' );
	t.r( '<p>[y<b>x<i @c=f>a</i>z]z<u @c=f>a</u>x</b>y</p>', '<p>yx<i @c=f>a</i>z<b>z<u @c=f>a</u>x</b>y</p>', 'tc4' );
	t.r( '<p>[<b>x</b></p><p><b><i @c=f>a</i>x</b>]</p>', '<p>x</p><p><i @c=f>a</i>x</p>', 'tc5' );
	t.r( '<p>[y<b>x<i @c=f>a<b>b</b></i>x</b>y]</p>', '<p>yx<i @c=f>a<b>b</b></i>xy</p>', 'tc6' );
	t.r( '<p>[x<i @c=f>a<b>b</b>c</i>x]</p>', '<p>x<i @c=f>a<b>b</b>c</i>x</p>', 'tc7' );
	t.r( '<p>[<b>x</b></p><p><b><i @c=f>a</i></b></p><p><b>x</b>]</p>', '<p>x</p><p><i @c=f>a</i></p><p>x</p>', 'tc8' );


	function applyInlineToNonEditableBlocks( t ) {
		t.a( '<p>[x</p><p @c=f>a</p><p>x]</p>', '<p><b>x</b></p><p @c=f>a</p><p><b>x</b></p>', 'tc1' );
		t.a( '<p>x</p>[<p @c=f>a</p>]<p>x</p>', '<p>x</p><p @c=f>a</p><p>x</p>', 'tc2' );
		t.a( '[<p @c=f>a</p><p>x</p><p @c=f>a</p>]', '<p @c=f>a</p><p><b>x</b></p><p @c=f>a</p>', 'tc3' );
		t.a( '[<p @c=f>a<b>b</b></p>]', '<p @c=f>a<b>b</b></p>', 'tc4' );
	}

	t = createAssertionFunction2( tcs, 'test apply inline styles on non-editable block elements', { element: 'b' } );
	applyInlineToNonEditableBlocks( t );

	t = createAssertionFunction2( tcs, 'test apply inline styles on non-editable block elements - includeReadonly', { element: 'b', includeReadonly: true } );
	applyInlineToNonEditableBlocks( t );


	function removeInlineFromNonEditableBlocks( t ) {
		t.r( '<p>[<b>x</b></p><p @c=f>a</p><p><b>x</b>]</p>', '<p>x</p><p @c=f>a</p><p>x</p>', 'tc1' );
		t.r( '[<p @c=f>a</p><p><b>x</b></p><p @c=f>a</p>]', '<p @c=f>a</p><p>x</p><p @c=f>a</p>', 'tc2' );
		t.r( '[<p @c=f>a<b>b</b></p>]', '<p @c=f>a<b>b</b></p>', 'tc3' );
	}

	t = createAssertionFunction2( tcs, 'test remove inline styles from non-editable block elements', { element: 'b' } );
	removeInlineFromNonEditableBlocks( t );

	t = createAssertionFunction2( tcs, 'test remove inline styles from non-editable block elements - includeReadonly', { element: 'b', includeReadonly: true } );
	removeInlineFromNonEditableBlocks( t );


	t = createAssertionFunction2( tcs, 'test apply block styles on nested editables', { element: 'h1' } );

	t.a( '[<div @c=f><div @c=t>b</div></div>]', '<div @c=f><div @c=t><h1>b</h1></div></div>', 'tc1' );
	t.a( '[<div @c=f><div @c=t><p>b</p><p>c</p></div></div>]', '<div @c=f><div @c=t><h1>b</h1><h1>c</h1></div></div>', 'tc2' );
	t.a( '[<div @c=f><div>x<div><div @c=t>b</div></div></div></div>]', '<div @c=f><div>x<div><div @c=t><h1>b</h1></div></div></div></div>', 'tc3' );
	t.a( '[<div @c=f><div @c=t>b</div>x<div @c=t>c</div></div>]', '<div @c=f><div @c=t><h1>b</h1></div>x<div @c=t><h1>c</h1></div></div>', 'tc4' );
	t.a( '[<div @c=f><p @c=t>b</p></div>]', '<div @c=f><p @c=t>b</p></div>', 'tc5' );
	t.a( '<div @c=f><div @c=t><p>a^b</p></div></div>', '<div @c=f><div @c=t><h1>ab</h1></div></div>', 'tc6' );


	t = createAssertionFunction2( tcs, 'test remove block styles from nested editables', { element: 'h1' } );

	t.r( '[<div @c=f><div @c=t><h1>b</h1></div></div>]', '<div @c=f><div @c=t><p>b</p></div></div>', 'tc1' );
	t.r( '[<div @c=f><div @c=t><h1>b</h1><h1>c</h1></div></div>]', '<div @c=f><div @c=t><p>b</p><p>c</p></div></div>', 'tc2' );
	t.r( '[<div @c=f><div>x<div><div @c=t><h1>b</h1></div></div></div></div>]', '<div @c=f><div>x<div><div @c=t><p>b</p></div></div></div></div>', 'tc3' );
	t.r( '[<div @c=f><div @c=t><h1>b</h1></div>x<div @c=t><h1>c</h1></div></div>]', '<div @c=f><div @c=t><p>b</p></div>x<div @c=t><p>c</p></div></div>', 'tc4' );
	t.r( '[<div @c=f><h1 @c=t>b</h1></div>]', '<div @c=f><h1 @c=t>b</h1></div>', 'tc5' );
	t.r( '<div @c=f><div @c=t><h1>a^b</h1></div></div>', '<div @c=f><div @c=t><p>ab</p></div></div>', 'tc6' );


	t = createAssertionFunction2( tcs, 'test apply inline styles on nested editables', { element: 'b' } );

	t.a( '[<div @c=f><div @c=t>b</div></div>]', '<div @c=f><div @c=t>b</div></div>', 'tc1' );
	t.a( '[<div @c=f><p @c=t>b</p></div>]', '<div @c=f><p @c=t>b</p></div>', 'tc2' );
	t.a( '[<div @c=f><div @c=t><p>b</p></div></div>]', '<div @c=f><div @c=t><p>b</p></div></div>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test apply inline styles on nested editables - includeReadonly', { element: 'b', includeReadonly: true } );

	t.a( '[<div @c=f><div @c=t>b</div></div>]', '<div @c=f><div @c=t><b>b</b></div></div>', 'tc1' );
	t.a( '[<div @c=f><p @c=t>b</p></div>]', '<div @c=f><p @c=t><b>b</b></p></div>', 'tc2' );
	t.a( '[<div @c=f><div @c=t><p>b</p></div></div>]', '<div @c=f><div @c=t><p><b>b</b></p></div></div>', 'tc3' );
	t.a( '[<div @c=f>a<div @c=t>b</div>c</div>]', '<div @c=f>a<div @c=t><b>b</b></div>c</div>', 'tc4' );


	function removeInlineFromNestedEditables( t ) {
		t.r( '[<div @c=f><div @c=t><b>b</b></div></div>]', '<div @c=f><div @c=t>b</div></div>', 'tc1' );
		t.r( '[<div @c=f><b>b</b><div @c=t>c</div></div>]', '<div @c=f><b>b</b><div @c=t>c</div></div>', 'tc2' );
	}

	t = createAssertionFunction2( tcs, 'test remove inline styles from nested editables', { element: 'b' } );
	removeInlineFromNonEditableBlocks( t );

	t = createAssertionFunction2( tcs, 'test remove inline styles from nested editables - includeReadonly', { element: 'b', includeReadonly: true } );
	removeInlineFromNonEditableBlocks( t );


	( function() {
		t = createAssertionFunction2( tcs, 'test apply inline styles on nested editables - ACF integration', { element: 'b', includeReadonly: true } );

		var filter1 = new CKEDITOR.filter( 'i' ),
			filter2 = new CKEDITOR.filter( 'b' );

		t.a( '[<div @c=f><p @c=t @f=' + filter1.id + '>b</p></div>]', '<div @c=f><p @c=t @f=' + filter1.id + '>b</p></div>', 'tc1' );
		t.a( '[<div @c=f><p @c=t @f=' + filter2.id + '>b</p></div>]', '<div @c=f><p @c=t @f=' + filter2.id + '><b>b</b></p></div>', 'tc2' );
		t.a(
			'[<div @c=f><p @c=t @f=' + filter1.id + '>b</p><p @c=t @f=' + filter2.id + '>b</p></div>]',
			'<div @c=f><p @c=t @f=' + filter1.id + '>b</p><p @c=t @f=' + filter2.id + '><b>b</b></p></div>',
			'tc3' );
	} )();


	( function() {
		t = createAssertionFunction2( tcs, 'test apply block styles on nested editables - ACF integration', { element: 'h1' } );

		var filter1 = new CKEDITOR.filter( 'p' ),
			filter2 = new CKEDITOR.filter( 'h1 p' );

		t.a( '[<div @c=f><div @c=t @f=' + filter1.id + '><p>b</p></div></div>]', '<div @c=f><div @c=t @f=' + filter1.id + '><p>b</p></div></div>', 'tc1' );
		t.a( '[<div @c=f><div @c=t @f=' + filter2.id + '><p>b</p></div></div>]', '<div @c=f><div @c=t @f=' + filter2.id + '><h1>b</h1></div></div>', 'tc2' );
		t.a(
			'[<div @c=f><div @c=t @f=' + filter1.id + '><p>b</p></div><div @c=t @f=' + filter2.id + '><p>b</p></div></div>]',
			'<div @c=f><div @c=t @f=' + filter1.id + '><p>b</p></div><div @c=t @f=' + filter2.id + '><h1>b</h1></div></div>',
			'tc3' );
	} )();


	t = createAssertionFunction2( tcs, 'test apply style with data- attribute', { element: 'span', attributes: { 'data-element': 'a', lang: 'en' } } );

	t.a( '<p>[x<span data-element="b" lang="en">foo</span>y]</p>', '<p><span data-element="a" lang="en">x<span data-element="b">foo</span>y</span></p>', 'tc1' );
	t.a( '<p>[x<span data-element="a" lang="en">foo</span>y]</p>', '<p><span data-element="a" lang="en">x<span data-element="a">foo</span>y</span></p>', 'tc2' );
	t.a( '<p>x<span data-element="a" lang="en">f[o]o</span>y</p>', '<p>x<span data-element="a" lang="en">f<span data-element="a" lang="en">o</span>o</span>y</p>', 'tc3' );


	t = createAssertionFunction2( tcs, 'test remove style with data- attribute', { element: 'span', attributes: { 'data-element': 'a' } } );

	t.r( '<p>[x<span data-element="a">x<span data-element="a">x</span>x</span>x]</p>', '<p>xxxxx</p>', 'tc1' );
	t.r( '<p>[x<span data-element="a">x<span data-element="a" foo="1">x</span>x</span>x]</p>', '<p>xx<span foo="1">x</span>xx</p>', 'tc2' );


	bender.test( tcs );

} )();