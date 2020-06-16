/* bender-tags: editor,range,13465 */

( function() {
	'use strict';

	var config = {
		allowedContent: true
	};

	bender.editors = {
		inline: {
			name: 'inline',
			creator: 'inline',
			config: config
		},
		header: {
			name: 'header',
			creator: 'inline',
			config: config
		}
	};

	var setWithHtml = bender.tools.range.setWithHtml,
		getWithHtml = bender.tools.range.getWithHtml,
		img_src = '%BASE_PATH%_assets/img.gif',
		tests;

	// <DEV>
	// var playground = CKEDITOR.document.createElement( 'dl' );
	// playground.on( 'paste', function( e ) {
	//	console.log( e.data.$.clipboardData.getData( 'text/html' ) );
	// } );
	// </DEV>

	function decodeInputFillers( html ) {
		return html.replace( /@/g, CKEDITOR.env.needsBrFiller ? '<br />' : '' );
	}

	function addTests( cases, editor, removeEmptyBlock ) {
		var testsGet = {},
			testsExtract = {},

			group, i, tc, name;

		for ( group in cases ) {
			for ( i = 0; i < cases[ group ].length; i++ ) {
				tc = cases[ group ][ i ];
				name = group + ' #' + ( i + 1 );
				if ( removeEmptyBlock ) {
					name += ' (removeEmptyBlock)';
				}

				// <DEV>
				// CKEDITOR.dom.element.createFromHtml( '<dt>' + name + ':</dt>' ).appendTo( playground );
				// CKEDITOR.dom.element.createFromHtml( '<dd contenteditable="true" style="outline: 1px dashed orange; font-family: monospace">' + decodeBoguses( tc[ 0 ] ) + '</dd>' ).appendTo( playground );
				// </DEV>

				// getHtmlFromRange does not accept removeEmptyBlock param, so don't test it in such case.
				if ( !removeEmptyBlock ) {
					testsGet[ 'test getHtmlFromRange: ' + name ] = assertGetHtmlFromRange( editor, tc[ 0 ], tc[ 1 ] );
				}
				testsExtract[ 'test extractHtmlFromRange: ' + name ] = assertExtractHtmlFromRange( editor, tc[ 0 ], tc[ 1 ], tc[ 2 ], removeEmptyBlock );
			}
		}

		CKEDITOR.tools.extend( tests, testsGet, testsExtract );
	}

	var compareInnerHtmlOptions = {
		noInterWS: true,
		fixStyles: true,
		compareSelection: true,
		normalizeSelection: false
	};

	function assertGetHtmlFromRange( editor, html, expected ) {
		return function() {
			html = decodeInputFillers( html );

			var editable = this.editables[ editor ],
				range = setWithHtml( editable, html ),
				docFragment = editable.getHtmlFromRange( range );

			assert.isInnerHtmlMatching( expected, docFragment.getHtml(), compareInnerHtmlOptions, 'Selected HTML' );
			assert.isInnerHtmlMatching( html, getWithHtml( editable, range ), compareInnerHtmlOptions, 'HTML of editable, untouched once get' );
		};
	}

	function assertExtractHtmlFromRange( editor, html, htmlGet, htmlWithSelection, removeEmptyBlock ) {
		return function() {
			html = decodeInputFillers( html );

			var editable = this.editables[ editor ],
				range = setWithHtml( editable, html ),
				docFragment = editable.extractHtmlFromRange( range, removeEmptyBlock );

			assert.isInnerHtmlMatching( htmlGet, docFragment.getHtml(), compareInnerHtmlOptions, 'HTML which has been extracted' );

			if ( removeEmptyBlock ) {
				// If we remove empty ranges we do not care about selection.
				assert.isInnerHtmlMatching( htmlWithSelection, editable.getHtml(), 'HTML of editable, once extracted' );
			} else {
				assert.isInnerHtmlMatching( htmlWithSelection, getWithHtml( editable, range ), compareInnerHtmlOptions, 'HTML of editable, once extracted' );
			}
		};
	}

// # '@' meaning in HTML patterns
//
// pattern				|	needs br filler					|	needs nbsp filler
// ------------------------------------------------------------------------------------------------------------
// input HTML	|	@	|	<br>							|	nothing						(we use it to simulate bogus <br> in non-empty blocks)
// ------------------------------------------------------------------------------------------------------------
// output HTML	|	@	|	like compareInnerHtml (accept)	|	like compareInnerHtml		(we use it for uncertain cases)
//				|	@!	|	like compareInnerHtml (expect)	|	like compareInnerHtml		(we use it for empty blocks)

	tests = {
		init: function() {
			this.editables = {};

			for ( var e in this.editors )
				this.editables[ e ] = this.editors[ e ].editable();
		},

		'test node markers are cleared': function() {
			var html = decodeInputFillers( '<table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table>' ),
				expected = '<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',
				editable = this.editables.inline,
				range = setWithHtml( editable, html );

			var docFragment = editable.extractHtmlFromRange( range );

			assert.isInnerHtmlMatching( expected, docFragment.getHtml(), compareInnerHtmlOptions, 'Selected HTML' );
			assert.isNull( editable.findOne( 'tr' ).getChild( 0 ).getCustomData( 'visited_out' ), '1st cell should not have a marker' );
			assert.isNull( editable.findOne( 'tr' ).getChild( 1 ).getCustomData( 'visited_in' ), '2nd cell should not have a marker' );
		}
	};

	addTests( {
		'block': [
			[ '<p>{a}</p>',															'a',															'<p>[]@!</p>' ],
			[ '<p>a{b}</p>',														'b',															'<p>a[]</p>' ],
			[ '<p>{a}b</p>',														'a',															'<p>[]b</p>' ],
			[ '<p>a{b}c</p>',														'b',															'<p>a[]c</p>' ]
		],

		'cross-block': [
			[ '<p>a{</p><p>}b</p>',													'<br data-cke-eol="1" />',										'<p>a[]b</p>' ],
			[ '<p>a{@</p><p>}b</p>',												'<br data-cke-eol="1" />',										'<p>a[]b</p>' ],
			[ '<p>{a</p><p>b}</p>',													'<p>a</p><p>b</p>',												'<p>[]@!</p>' ],
			[ '<h1>{a</h1><p>b}</p>',												'<h1>a</h1><p>b</p>',											'<h1>[]@!</h1>' ],
			[ '<p>a{b</p><p>c}d</p>',												'<p>b</p><p>c</p>',												'<p>a[]d</p>' ],
			[ '<blockquote>a{b</blockquote><p>c}d</p>',								'<blockquote>b</blockquote><p>c</p>',							'<blockquote>a[]d</blockquote>' ],
			[ '<blockquote>a{b</blockquote><div>c</div><p>d}e</p>',					'<blockquote>b</blockquote><div>c</div><p>d</p>',				'<blockquote>a[]e</blockquote>' ],
			[ '<div>a<div>{b</div></div><div>c</div><p>d}e</p>',					'<div><div>b</div></div><div>c</div><p>d</p>',					'<div>a<div>[]e</div></div>' ], /*!*/
			[ '<p>a{b</p><p>}c</p>',												'<p>b</p><br data-cke-eol="1" />',								'<p>a[]c</p>' ],
			[ '<p>a{</p><p>b}c</p>',												'<br data-cke-eol="1" /><p>b</p>',								'<p>a[]c</p>' ],
			[ '<p>a{b</p><p>c</p><p>}d</p>',										'<p>b</p><p>c</p><br data-cke-eol="1" />',						'<p>a[]d</p>' ],
			[ '<p>ab{</p><p>c</p><p>}de</p>',										'<br data-cke-eol="1" /><p>c</p><br data-cke-eol="1" />',		'<p>ab[]de</p>' ],
			[ '<h1><b>{a</b></h1><p>b}</p>',										'<h1><b>a</b></h1><p>b</p>',									'<h1>[]@!</h1>' ],

			// (https://dev.ckeditor.com/ticket/13449)
			[ '<h1>{a</h1><p><b>b}</b></p>',										'<h1>a</h1><p><b>b</b></p>',									'<h1>[]@!</h1>' ],
			[ '<h1>{abc</h1><p><strong>de</strong>gh}<strong>jl</strong>mn</p>',	'<h1>abc</h1><p><strong>de</strong>gh</p>',						'<h1>[]<strong>jl</strong>mn</h1>' ]
		],

		'inline': [
			[ '<p>a<b>{b}</b>c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
			[ '<p>a<b>b{c}d</b>e</p>',												'<b>c</b>',														'<p>a<b>b[]d</b>e</p>' ],
			[ '<p><b>{a}</b></p>',													'<b>a</b>',														'<p>[]@!</p>' ],
			[ '<p>a<a href="#">{b}</a>c</p>',										'<a href="#">b</a>',											'<p>a[]c</p>' ],
			[ '<p>a<a href="#">b{c}d</a>e</p>',										'<a href="#">c</a>',											'<p>a<a href="#">b[]d</a>e</p>' ],
			[ '<p>a<b id="foo">{b}</b>c</p>',										'<b id="foo">b</b>',											'<p>a[]c</p>' ],
			[ '<p><b style="color:red">{a}</b></p>',								'<b style="color:red">a</b>',									'<p>[]@!</p>' ],
			[ '<p>a<b style="color:red">{b}</b>c</p>',								'<b style="color:red">b</b>',									'<p>a[]c</p>' ],
			[ '<p>a<i><b>{b}</b></i></p>',											'<i><b>b</b></i>',												'<p>a[]</p>' ],
			[ '<p>a<i>b<b>{c}</b></i></p>',											'<i><b>c</b></i>',												'<p>a<i>b[]</i></p>' ],
			[ '<p><i><b>{a}</b></i></p>',											'<i><b>a</b></i>',												'<p>[]@!</p>' ],
			[ '<p>[<b>a</b>]</p>',													'<b>a</b>',														'<p>[]@!</p>' ],
			[ '<p>a{<b>b}</b>c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
			[ '<p>a{<img src="' + img_src + '" />}b</p>',							'<img src="' + img_src + '" />',								'<p>a[]b</p>' ],
			[ '<p>a{<a href="foo"><img src="' + img_src + '" /></a>}b</p>',			'<a href="foo"><img src="' + img_src + '" /></a>',				'<p>a[]b</p>' ]
		],

		'cross-inline': [
			[ '<p>{a<b>b}</b>c</p>',												'a<b>b</b>',													'<p>[]c</p>' ],
			[ '<p>a<b>{b</b>c}</p>',												'<b>b</b>c',													'<p>a[]</p>' ],
			[ '<p>{a<b>b</b>c}</p>',												'a<b>b</b>c',													'<p>[]@!</p>' ],
			[ '<p>a{<b>b</b>}c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
			[ '<p><b>{a</b><b>b}</b></p>',											'<b>a</b><b>b</b>',												'<p>[]@!</p>' ],
			[ '<p><b>a{b</b><b>c}d</b></p>',										'<b>b</b><b>c</b>',												'<p><b>a[]d</b></p>' ],
			[ '<p>a<b class="a">{b</b><b class="b">c}</b>d</p>',					'<b class="a">b</b><b class="b">c</b>',							'<p>a[]d</p>' ],
			[ '<p>a<b class="a">{b</b>c<b class="b">d}</b>e</p>',					'<b class="a">b</b>c<b class="b">d</b>',						'<p>a[]e</p>' ]
		],

		'bogus': [
			[ '<p>{a}@</p>',														'a',															'<p>[]@!</p>' ],
			[ '<p>{a@]</p>',														'a',															'<p>[]@!</p>' ],
			[ '<p><b>{a}</b>@</p>',													'<b>a</b>',														'<p>[]@!</p>' ],
			[ '<p>{a}<br />@</p>',													'a',															'<p>[]<br />@</p>' ],
			[ '<p>{a<br />]@</p>',													'a<br />',														'<p>[]@!</p>' ],
			[ '<div>b<p>{a@]</p>b</div>',											'a',															'<div>b<p>[]@!</p>b</div>' ],
			// https://dev.ckeditor.com/ticket/13568.
			[ '<div>[<p>Foo bar@</p>]</div>',										'<p>Foo bar</p>',												'<div>[]@!</div>' ]

		],

		// (https://dev.ckeditor.com/ticket/13101)
		'html5': [
			[ '<div>[<figure>img</figure>]</div>',											'<figure>img</figure>',											'<div>[]@!</div>' ],
			[ '<div>[<div><figure>img<figcaption>cap</figcaption></figure></div>]</div>',	'<div><figure>img<figcaption>cap</figcaption></figure></div>',	'<div>[]@!</div>' ]
		],

		'tables': [
			// #1
			[ '<table><tbody><tr><td>{a}</td></tr></tbody></table>',				'a',															'<table><tbody><tr><td>[]@!</td></tr></tbody></table>' ],
			// #2
			[ '<div><table><tbody><tr><td>{a}</td></tr></tbody></table></div>',		'a',															'<div><table><tbody><tr><td>[]@!</td></tr></tbody></table></div>' ],
			// #3
			[ '<table><tbody><tr><td>a{b}c</td></tr></tbody></table>',				'b',															'<table><tbody><tr><td>a[]c</td></tr></tbody></table>' ],
			// #4
			[ '<table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table>',
				'<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',
				'<table><tbody><tr><td>a[]</td><td>d</td></tr></tbody></table>' ],
			// #5
			[ '<div><table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table></div>',
				'<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',
				'<div><table><tbody><tr><td>a[]</td><td>d</td></tr></tbody></table></div>' ],
			// #6
			[ '<table><tbody><tr>[<td>a</td><td>b}c</td></tr></tbody></table>',
				'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
				'<table><tbody><tr><td>[]@!</td><td>c</td></tr></tbody></table>' ],
			// #7
			[ '<table><tbody><tr>[<td>a</td>]<td>b</td></tr></tbody></table>',
				'a',
				'<table><tbody><tr><td>[]@!</td><td>b</td></tr></tbody></table>' ],
			// #8 Partial table + paragragh + partial table.
			[ '<table><tbody><tr><td>{a</td></tr></tbody></table><p>x</p><table><tbody><tr><td>b</td></tr><tr><td>c}</td><td>d</td></tr></tbody></table>',
				'<table><tbody><tr><td>a</td></tr></tbody></table><p>x</p><table><tbody><tr><td>b</td></tr><tr><td>c</td></tr></tbody></table>',
				'<table><tbody><tr><td>[]@!</td></tr></tbody></table><table><tbody><tr><td>@!</td></tr><tr><td>@!</td><td>d</td></tr></tbody></table>' ],
			// #9
			[ '<table><tbody><tr><td>a{b</td><td>c</td></tr><tr><td>d}e</td><td>f</td></tr></tbody></table>',
				'<table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td></tr></tbody></table>',
				'<table><tbody><tr><td>a[]</td><td>@</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>' ],
			// #10
			[ '<p>[a</p><table><tbody><tr><td>b</td><td>c]d</td></tr></tbody></table>',
				'<p>a</p><table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',
				'<p>[]@!</p><table><tbody><tr><td>@</td><td>d</td></tr></tbody></table>' ],
			// #11
			[ '<table><tbody><tr><td>b{c</td><td>d</td></tr></tbody></table><p>a}b</p>',
				'<table><tbody><tr><td>c</td><td>d</td></tr></tbody></table><p>a</p>',
				'<table><tbody><tr><td>b[]</td><td>@</td></tr></tbody></table><p>b</p>' ],
			// #12
			[ '<p>[a</p><table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td><td>e]f</td></tr></tbody></table>',
				'<p>a</p><table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td><td>e</td></tr></tbody></table>',
				'<p>[]@!</p><table><tbody><tr><td>@!</td><td>@!</td></tr><tr><td>@!</td><td>f</td></tr></tbody></table>' ],
			// #13
			[ '<table><tbody><tr><td>{a</td><td>b}</td></tr></tbody></table>',
				'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
				'<p>[]@!</p>' ],
			// #14
			[ '<table border="1" style="width:500px"><tbody><tr><td>{a</td><td>b}</td></tr></tbody></table>',
				'<table border="1" style="width:500px"><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
				'<p>[]@!</p>' ],
			// #15 Single row selection.
			[ '<table><tbody><tr><td>a</td><td>b</td></tr><tr><td>{c</td><td>d}</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>',
				'<table><tbody><tr><td>c</td><td>d</td></tr></tbody></table>',
				'<table><tbody><tr><td>a</td><td>b</td></tr><tr><td>[]@!</td><td>@!</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>' ],
			// #16 Two rows selection.
			[ '<table><tbody><tr><td>{a</td><td>b</td></tr><tr><td>c</td><td>d}</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>',
				'<table><tbody><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></tbody></table>',
				'<table><tbody><tr><td>[]@!</td><td>@!</td></tr><tr><td>@!</td><td>@!</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>' ],
			// #17
			[ '<p>[a</p><table><tbody><tr><td>b</td><td>cd</td></tr></tbody></table><p>e}f</p>',
				'<p>a</p><table><tbody><tr><td>b</td><td>cd</td></tr></tbody></table><p>e</p>',
				'<p>[]f</p>' ],
			// #18
			[ '<p>a</p>[<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>]<p>b</p>',
				'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>',
				'<p>a</p><p>[]@!</p><p>b</p>' ],
			// #19
			[ '<p>x</p><table><tbody><tr>[<td>a</td>]</tr></tbody></table>',
				'a',
				'<p>x</p><table><tbody><tr><td>[]@!</td></tr></tbody></table>' ],
			// #20
			[ '<p>x</p><table><tbody><tr><td>a[</td><td>b</td>]</tr></tbody></table>',
				'<table><tbody><tr><td></td><td>b</td></tr></tbody></table>',
				'<p>x</p><table><tbody><tr><td>a[]</td><td>@!</td></tr></tbody></table>' ],
			// #21
			[ '<p>x</p><table><tbody><tr>[<td>a</td><td>b</td>]</tr></tbody></table>',
				'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
				'<p>x</p><p>[]@!</p>' ],
			// #22
			[ '<table><thead><tr>[<th>a</th>]</tr></thead><tbody><tr><td>b</td></tr></tbody></table>',
				'a',
				'<table><thead><tr><th>[]@!</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>' ],
			// #23
			[ '<p>a{</p><table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>y</td></tr></tbody></table><p>}b</p>',
				'<br data-cke-eol="1" /><table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>y</td></tr></tbody></table><br data-cke-eol="1" />',
				'<p>a[]b</p>' ],
			// #24
			[ '<p>a</p>[<table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>y</td></tr></tbody></table>]<p>b</p>',
				'<table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>y</td></tr></tbody></table>',
				'<p>a</p><p>[]@!</p><p>b</p>' ],
			// #25 Mind the context.
			[ '<p>a</p><table class="t1"><tbody><tr><td><p>b{c</p><table class="t2"><tbody><tr><td><p>d}e</p></td></tr></tbody></table><p>f</p></td></tr></tbody></table><p>g</p>',
				'<p>c</p><table class="t2"><tbody><tr><td><p>d</p></td></tr></tbody></table>',
				'<p>a</p><table class="t1"><tbody><tr><td><p>b[]</p><table class="t2"><tbody><tr><td><p>e</p></td></tr></tbody></table><p>f</p></td></tr></tbody></table><p>g</p>' ],
			// #26 Context again, making our lives a misery.
			[ '<p>a</p><table class="t1"><tbody><tr><td><p>b{c</p></td><td><table class="t2"><tbody><tr><td><p>d}e</p></td></tr></tbody></table></td></tr></tbody></table><p>g</p>',
				'<table class="t1"><tbody><tr><td><p>c</p></td><td><table class="t2"><tbody><tr><td><p>d</p></td></tr></tbody></table></td></tr></tbody></table>',
				'<p>a</p><table class="t1"><tbody><tr><td><p>b[]</p></td><td><table class="t2"><tbody><tr><td><p>e</p></td></tr></tbody></table></td></tr></tbody></table><p>g</p>' ],

			// #27 (#787)
			[ '<table><tbody><tr><td>ab<table><tbody><tr>[<td>cd</td>]</tr></tbody></table>ef</td></tr></tbody></table>', 'cd',
				'<table><tbody><tr><td>ab<table><tbody><tr><td>[]@!</td></tr></tbody></table>ef</td></tr></tbody></table>' ],

			// #28 - br case (#787).
			[ '<table><tbody><tr><td>ab<table><tbody><tr>[<td>cd@</td>]</tr></tbody></table>ef</td></tr></tbody></table>',
				CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? 'cd' : '<table><tbody><tr><td>cd</td></tr></tbody></table>',
				'<table><tbody><tr><td>ab<table><tbody><tr><td>[]@!</td></tr></tbody></table>ef</td></tr></tbody></table>' ]
		],

		'lists': [
			[ '<ol><li>a{b}c</li></ol>',											'b',															'<ol><li>a[]c</li></ol>' ],
			[ '<ol><li>{a}</li></ol>',												'a',															'<ol><li>[]@!</li></ol>' ],
			[ '<div><ol><li>{a}</li></ol></div>',									'a',															'<div><ol><li>[]@!</li></ol></div>' ],
			[ '<ol><li>a{b</li><li>c}d</li></ol>',									'<ol><li>b</li><li>c</li></ol>',								'<ol><li>a[]d</li></ol>' ],
			[ '<ol><li>a{b</li></ol><ol><li>c}d</li></ol>',							'<ol><li>b</li></ol><ol><li>c</li></ol>',						'<ol><li>a[]d</li></ol>' ],
			[ '<ol><li>a{b</li></ol><ul><li>c}d</li></ul>',							'<ol><li>b</li></ol><ul><li>c</li></ul>',						'<ol><li>a[]d</li></ol>' ],
			[ '<ol><li>a<ul><li>b{c</li></ul></li><li>d}e</li></ol>',				'<ol><li><ul><li>c</li></ul></li><li>d</li></ol>',				'<ol><li>a<ul><li>b[]e</li></ul></li></ol>' ],
			[ '<ol><li>a{b<ul><li>c}d</li><li>e</li></ul></li><li>f</li></ol>',		'<ol><li>b<ul><li>c</li></ul></li></ol>',						'<ol><li>a[]d<ul><li>e</li></ul></li><li>f</li></ol>' ],
			[ '<ol><li>a</li><li>b{c</li><li>d}e</li></ol>',						'<ol><li>c</li><li>d</li></ol>',								'<ol><li>a</li><li>b[]e</li></ol>' ],
			[ '<ol><li>a{b</li><li><b>c}d</b></li></ol>',							'<ol><li>b</li><li><b>c</b></li></ol>',							'<ol><li>a[]<b>d</b></li></ol>' ],
			[ '<ol><li><b>a{b</b></li><li><b>c}d</b></li></ol>',					'<ol><li><b>b</b></li><li><b>c</b></li></ol>',					'<ol><li><b>a[]d</b></li></ol>' ]
		],

		'various anchored in element': [
			[ '<p>[]a</p>',															'',																'<p>[]a</p>' ],
			[ '<p>[a]</p>',															'a',															'<p>[]@!</p>' ],
			[ '<p>a[b]</p>',														'b',															'<p>a[]</p>' ],
			[ '<p>a<b>[b]</b>c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
			[ '<p>a<a href="#">[b]</a>c</p>',										'<a href="#">b</a>',											'<p>a[]c</p>' ],
			[ '<p>a[<b>b</b>]c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
			[ '<p>[a@]</p>',														'a',															'<p>[]@!</p>' ],
			[ '<p>[a]@</p>',														'a',															'<p>[]@!</p>' ],
			[ '<p>[a]<br />@</p>',													'a',															'<p>[]<br />@</p>' ],
			[ '<p>[a<br />]@</p>',													'a<br />',														'<p>[]@!</p>' ],
			[ '<p>x</p>[<hr />]<p>x</p>',											'<hr />',														'<p>x</p><p>[]@!</p><p>x</p>' ],
			[ '<p>[<img src="' + img_src + '" />]</p>',								'<img src="' + img_src + '" />',								'<p>[]@!</p>' ]
		]
	}, 'inline' );

	addTests( {
		'header': [
			[ '{a}',																'a',															'[]@' ],
			[ 'a<b>{b}</b>c',														'<b>b</b>',														'a[]c' ],
			[ '{a<b>b</b>c}',														'a<b>b</b>c',													'[]@' ],
			[ '[a<b>b</b>c]',														'a<b>b</b>c',													'[]@' ],
			[ '<br />[<br />]<br />',												'<br />',														'<br />[]<br />' ],
			[ '[<img src="' + img_src + '" />]',									'<img src="' + img_src + '" />',								'[]@' ],
			[ '{a<br />]@',															'a<br />',														'[]@' ],
			[ '[<br />]',															'<br />',														'[]@' ],
			[ 'a{<br /><br />}b',													'<br /><br />',													'a[]b' ],
			[ '{}a',																'',																'[]a' ]
		]
	}, 'header' );

	// With removeEmptyBlock = true.
	addTests( {
		'block': [
			[ '<p>a</p>[<p>b</p>]<p>c</p>',											'<p>b</p>',														'<p>a</p><p>c</p>' ],
			[ '<p>a</p><p>[b]</p><p>c</p>',											'b',															'<p>a</p><p>c</p>' ],
			[ '<p>a</p>[<p>b</p>]',													'<p>b</p>',														'<p>a</p>' ],
			[ '[<p>b</p>]<p>c</p>',													'<p>b</p>',														'<p>c</p>' ],
			[ '[<p>b</p>]',															'<p>b</p>',														'' ],
			[ '<p>{b}</p>',															'b',															'' ],
			[ '<p>a</p><p>[b]</p><p>c</p>',											'b',															'<p>a</p><p>c</p>' ],
			[ '<p>a</p><p>[<b>b</b>]</p><p>c</p>',									'<b>b</b>',														'<p>a</p><p>c</p>' ],
			[ '<p>a</p><p><b>[b]</b></p><p>c</p>',									'<b>b</b>',														'<p>a</p><p>c</p>' ],
			[ '<p>a[b]c</p>',														'b',															'<p>ac</p>' ],
			[ '<table><tbody><tr><td>{a</td><td>b}</td></tr></tbody></table>',		'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',	'' ],
			// (https://dev.ckeditor.com/ticket/13465)
			[
				'<p>[<span>foo</span>]<span data-cke-bookmark="1">&nbsp;</span></p>',
				'<span>foo</span>',
				'<p><span data-cke-bookmark="1">&nbsp;</span></p>'
			],
			// (https://dev.ckeditor.com/ticket/13465)
			[ '<p>a</p><p><span class="foo">{b}</span></p><p>c</p>',				'<span class="foo">b</span>',									'<p>a</p><p>c</p>' ],
			// (https://dev.ckeditor.com/ticket/13465)
			[ '<p>a</p><p><b>{b}</b><span class="foo"></span></p><p>c</p>',			'<b>b</b>',														'<p>a</p><p>c</p>' ]
		]
	}, 'inline', 1 );

	bender.test( tests );

	// <DEV>
	// playground.appendTo( CKEDITOR.document.getBody() );
	// </DEV>
} )();
