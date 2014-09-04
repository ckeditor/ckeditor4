/* bender-tags: editor,unit */

( function() {
	'use strict';

	var config = {
		autoParagraph: false,
		allowedContent: true
	};

	var editors = {
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
		img_src = '%BASE_PATH%_assets/img.gif';

	var tests = {
		_should: {
			ignore: {
				// 'test get: bogus #2': !CKEDITOR.env.needsBrFiller,
				// 'test get: bogus #8': !CKEDITOR.env.needsBrFiller,
				// 'test get: various anchored in element #10': !CKEDITOR.env.needsBrFiller,
			}
		},

		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( editors, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.editables = {};

				for ( var e in editors )
					that.editables[ e ] = editors[ e ].editable();

				that.callback();
			} );
		}
	};

	// <DEV>
	// var playground = CKEDITOR.document.createElement( 'dl' );
	// playground.on( 'paste', function( e ) {
	// 	console.log( e.data.$.clipboardData.getData( 'text/html' ) );
	// } );
	// </DEV>

		// On old IEs nbsp will always fill empty blocks.
	var emptyBlockFiller = CKEDITOR.env.needsBrFiller ? '<br />' : '&nbsp;',
		// On old IEs nbsp will never exist if element isn't empty or after <p><br>^</p>.
		brFiller = CKEDITOR.env.needsBrFiller ? '<br />' : '',
		tdLiFiller = CKEDITOR.env.needsBrFiller ? '@!' : '@';

	function decodeInputFillers( html ) {
		return html.replace( /@!/g, emptyBlockFiller ).replace( /@/g, brFiller );
	}

	function decodeOutputFillers( html ) {
		return html.replace( /@1/g, tdLiFiller );
	}

	function addTests( cases, editor ) {
		var testsGet = {},
			testsExtract = {},

			group, i, tc, name;

		for ( group in cases ) {
			for ( i = 0; i < cases[ group ].length; i++ ) {
				tc = cases[ group ][ i ];
				name = group + ' #' + ( i + 1 );

				// <DEV>
				// CKEDITOR.dom.element.createFromHtml( '<dt>' + name + ':</dt>' ).appendTo( playground );
				// CKEDITOR.dom.element.createFromHtml( '<dd contenteditable="true" style="outline: 1px dashed orange; font-family: monospace">' + decodeBoguses( tc[ 0 ] ) + '</dd>' ).appendTo( playground );
				// </DEV>

				testsGet[ 'test get: ' + name ] = assertGetSelectedHtmlFromRange( editor, tc[ 0 ], tc[ 1 ] );
				testsExtract[ 'test extract: ' + name ] = assertExtractSelectedHtmlFromRange( editor, tc[ 0 ], tc[ 1 ], tc[ 2 ] );
			}
		}

		CKEDITOR.tools.extend( tests, testsGet, testsExtract );
	}

	var compareInnerHtmlOptions = {
		noInterWS: true,
		fixStyles: true,
		compareSelection: true,
		normalizeSelection: false,
	};

	function assertGetSelectedHtmlFromRange( editor, html, expected ) {
		return function() {
			html = decodeInputFillers( html );

			var editable = this.editables[ editor ],
				range = setWithHtml( editable, html ),
				docFragment = editable.getSelectedHtmlFromRange( range );

			assert.isInnerHtmlMatching( expected, docFragment.getHtml(), compareInnerHtmlOptions, 'Selected HTML' );
			assert.isInnerHtmlMatching( html, getWithHtml( editable, range ), compareInnerHtmlOptions, 'HTML of editable, untouched once get' );
		};
	}

	function assertExtractSelectedHtmlFromRange( editor, html, htmlGet, htmlWithSelection ) {
		return function() {
			html = decodeInputFillers( html );
			htmlWithSelection = decodeOutputFillers( htmlWithSelection );

			var editable = this.editables[ editor ],
				range = setWithHtml( editable, html ),
				docFragment = editable.extractSelectedHtmlFromRange( range );

			assert.isInnerHtmlMatching( htmlGet, docFragment.getHtml(), compareInnerHtmlOptions, 'HTML which has been extracted' );
			assert.isInnerHtmlMatching( htmlWithSelection, getWithHtml( editable, range ), compareInnerHtmlOptions, 'HTML of editable, once extracted' );
		};
	}

// '@' meaning			(needs br		|	need nbsp)
//
// * input HTML:
//   * @		-		<br>			|	nothing
//   * @!		-		<br>			|	nbsp
//
// * output HTML:
//   * @		-		like compareInnerHtml							(we use it for uncertain cases)
//   * @!		-		like compareInnerHtml							(we use it for empty blocks)
//   * @1		-		expected <br>	|	expected nothing			(we use it for <li> i <td>)

	addTests( {
		'no block': [
/* 1 */		[ '{a}', 																'a',															'[]@' ],
/* 2 */		[ '{}a', 																'',																'[]a' ]
		],
/* 1 */	'block': [
/* 2 */		[ '<p>{a}</p>', 														'a',															'<p>[]@!</p>' ],
/* 3 */		[ '<p>a{b}</p>', 														'b',															'<p>a[]</p>' ],
/* 4 */		[ '<p>{a}b</p>', 														'a',															'<p>[]b</p>' ],
/* 5 */		[ '<p>a{b}c</p>', 														'b',															'<p>a[]c</p>' ]
		],
		'cross-block': [
/* 1 */		[ '<p>a{</p><p>}b</p>', 												'<br data-cke-eol="1" />',										'<p>a[]b</p>' ],
/* 2 */		[ '<p>a{@!</p><p>}b</p>', 												'<br data-cke-eol="1" />',										'<p>a[]b</p>' ],
/* 3 */		[ '<p>{a</p><p>b}</p>', 												'<p>a</p><p>b</p>',												'<p>[]@!</p>' ],
/* 4 */		[ '<h1>{a</h1><p>b}</p>', 												'<h1>a</h1><p>b</p>',											'<h1>[]@!</h1>' ],
/* 5 */		[ '<p>a{b</p><p>c}d</p>',											 	'<p>b</p><p>c</p>',												'<p>a[]d</p>' ],
/* 6 */		[ '<blockquote>a{b</blockquote><p>c}d</p>', 							'<blockquote>b</blockquote><p>c</p>',							'<blockquote>a[]d</blockquote>' ],
/* 7 */		[ '<blockquote>a{b</blockquote><div>c</div><p>d}e</p>', 				'<blockquote>b</blockquote><div>c</div><p>d</p>',				'<blockquote>a[]e</blockquote>' ],
/* 8 */		[ '<div>a<div>{b</div></div><div>c</div><p>d}e</p>', 					'<div><div>b</div></div><div>c</div><p>d</p>',					'<div>a<div>[]e</div></div>' ], /*!*/
/* 9 */		[ '<p>a{b</p><p>}c</p>', 												'<p>b</p><br data-cke-eol="1" />',								'<p>a[]c</p>' ],
/* 10 */	[ '<p>a{</p><p>b}c</p>', 												'<br data-cke-eol="1" /><p>b</p>',								'<p>a[]c</p>' ],
/* 11 */	[ '<p>a{b</p><p>c</p><p>}d</p>', 										'<p>b</p><p>c</p><br data-cke-eol="1" />',						'<p>a[]d</p>' ],
/* 12 */	[ '<p>ab{</p><p>c</p><p>}de</p>', 										'<br data-cke-eol="1" /><p>c</p><br data-cke-eol="1" />',		'<p>ab[]de</p>' ],
/* 13 */	[ '<h1><b>{a</b></h1><p>b}</p>', 										'<h1><b>a</b></h1><p>b</p>',									'<h1>[]@!</h1>' ],
/* 14 */	[ '<h1>{a</h1><p><b>b}</b></p>', 										'<h1>a</h1><p><b>b</b></p>',									'<h1>[]@!</h1>' ]
		],
		'inline': [
/* 1 */		[ '<p>a<b>{b}</b>c</p>', 												'<b>b</b>',														'<p>a[]c</p>' ],
/* 2 */		[ '<p>a<b>b{c}d</b>e</p>', 												'<b>c</b>',														'<p>a<b>b[]d</b>e</p>' ],
/* 3 */		[ '<p><b>{a}</b></p>', 													'<b>a</b>',														'<p>[]@!</p>' ],
/* 4 */		[ '<p>a<a href="#">{b}</a>c</p>', 										'<a href="#">b</a>',											'<p>a[]c</p>' ],
/* 5 */		[ '<p>a<a href="#">b{c}d</a>e</p>', 									'<a href="#">c</a>',											'<p>a<a href="#">b[]d</a>e</p>' ],
/* 6 */		[ '<p>a<b id="foo">{b}</b>c</p>', 										'<b id="foo">b</b>',											'<p>a[]c</p>' ],
/* 7 */		[ '<p><b style="color:red">{a}</b></p>', 								'<b style="color:red">a</b>',									'<p>[]@!</p>' ],
/* 8 */		[ '<p>a<b style="color:red">{b}</b>c</p>', 								'<b style="color:red">b</b>',									'<p>a[]c</p>' ],
/* 9 */		[ '<p>a<i><b>{b}</b></i></p>', 											'<i><b>b</b></i>',												'<p>a[]</p>' ],
/* 10 */	[ '<p>a<i>b<b>{c}</b></i></p>', 										'<i><b>c</b></i>',												'<p>a<i>b[]</i></p>' ],
/* 11 */	[ '<p><i><b>{a}</b></i></p>', 											'<i><b>a</b></i>',												'<p>[]@!</p>' ],
/* 12 */	[ '[<br />]',															'<br />',														'[]@' ],
/* 13 */	[ 'a{<br /><br />}b',													'<br /><br />',													'a[]b' ],
/* 14 */	[ '<p>[<b>a</b>]</p>',													'<b>a</b>',														'<p>[]@!</p>' ],
/* 15 */	[ '<p>a{<b>b}</b>c</p>',												'<b>b</b>',														'<p>a[]c</p>' ],
/* 16 */	[ '<p>a{<img src="' + img_src + '" />}b</p>',							'<img src="' + img_src + '" />',								'<p>a[]b</p>' ],
/* 17 */	[ '<p>a{<a href="foo"><img src="' + img_src + '" /></a>}b</p>',			'<a href="foo"><img src="' + img_src + '" /></a>',				'<p>a[]b</p>' ]
		],
		'cross-inline': [
/* 1 */		[ '<p>{a<b>b}</b>c</p>', 												'a<b>b</b>',													'<p>[]c</p>' ],
/* 2 */		[ '<p>a<b>{b</b>c}</p>', 												'<b>b</b>c',													'<p>a[]</p>' ],
/* 3 */		[ '<p>{a<b>b</b>c}</p>', 												'a<b>b</b>c',													'<p>[]@!</p>' ],
/* 4 */		[ '<p>a{<b>b</b>}c</p>', 												'<b>b</b>',														'<p>a[]c</p>' ],
/* 5 */		[ '<p><b>{a</b><b>b}</b></p>', 											'<b>a</b><b>b</b>',												'<p>[]@!</p>' ],
/* 6 */		[ '<p><b>a{b</b><b>c}d</b></p>', 										'<b>b</b><b>c</b>',												'<p><b>a[]d</b></p>' ],
/* 7 */		[ '<p>a<b class="a">{b</b><b class="b">c}</b>d</p>', 					'<b class="a">b</b><b class="b">c</b>',							'<p>a[]d</p>' ],
/* 8 */		[ '<p>a<b class="a">{b</b>c<b class="b">d}</b>e</p>', 					'<b class="a">b</b>c<b class="b">d</b>',						'<p>a[]e</p>' ]
		],
		'bogus': [
/* 1 */		[ '<p>{a}@</p>', 														'a',															'<p>[]@!</p>' ],
/* 2 */		[ '<p>{a@]</p>', 														'a',															'<p>[]@!</p>' ],
/* 3 */		[ '<p><b>{a}</b>@</p>', 												'<b>a</b>',														'<p>[]@!</p>' ],
/* 4 */		[ '<p>{a}<br />@</p>',													'a',															'<p>[]<br />@</p>' ],
/* 5 */		[ '{a<br />]@',															'a<br />',														'[]@' ],
/* 6 */		[ '<p>{a<br />]@</p>',													'a<br />',														'<p>[]@!</p>' ],
/* 7 */		[ '<div>b<p>{a@]</p>b</div>', 											'a',															'<div>b<p>[]@!</p>b</div>' ]
		],
		'tables': [
/* 1 */		[ '<table><tbody><tr><td>{a}</td></tr></tbody></table>', 				'a',															'<table><tbody><tr><td>[]@1</td></tr></tbody></table>' ],
/* 2 */		[ '<div><table><tbody><tr><td>{a}</td></tr></tbody></table></div>',		'a',															'<div><table><tbody><tr><td>[]@1</td></tr></tbody></table></div>' ],
/* 3 */		[ '<table><tbody><tr><td>a{b}c</td></tr></tbody></table>', 				'b',															'<table><tbody><tr><td>a[]c</td></tr></tbody></table>' ],
/* 4 */		[ '<table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table>', 	'<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',	'<table><tbody><tr><td>a[]</td><td>d</td></tr></tbody></table>' ],
/* 5 */		[ '<div><table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table></div>',
																					'<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',	'<div><table><tbody><tr><td>a[]</td><td>d</td></tr></tbody></table></div>' ],
/* 6 */		[ '<table><tbody><tr>[<td>a</td><td>b}c</td></tr></tbody></table>', 	'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',	'<table><tbody><tr><td>[]@1</td><td>c</td></tr></tbody></table>' ],
/* 7 */		[ '<table><tbody><tr><td>{a</td></tr></tbody></table><table><tbody><tr><td>b</td></tr><tr><td>c}</td><td>d</td></tr></tbody></table>',
																					'<table><tbody><tr><td>a</td></tr></tbody></table><table><tbody><tr><td>b</td></tr><tr><td>c</td></tr></tbody></table>',
																																					'<table><tbody><tr><td>[]@1</td></tr></tbody></table><table><tbody><tr><td>@</td><td>d</td></tr></tbody></table>' ], /*!*/
/* 8 */		[ '<table><tbody><tr><td>a{b</td><td>c</td></tr><tr><td>d}e</td><td>f</td></tr></tbody></table>',
																					'<table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td></tr></tbody></table>',
																																					'<table><tbody><tr><td>a[]</td><td>@</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>' ],
/* 9 */		[ '<p>[a</p><table><tbody><tr><td>b</td><td>c]d</td></tr></tbody></table>',
																					'<p>a</p><table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>',
																																					'<p>[]@!</p><table><tbody><tr><td>@</td><td>d</td></tr></tbody></table>' ],
/* 10 */	[ '<p>[a</p><table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td><td>e]f</td></tr></tbody></table>',
																					'<p>a</p><table><tbody><tr><td>b</td><td>c</td></tr><tr><td>d</td><td>e</td></tr></tbody></table>',
																																					'<p>[]@!</p><table><tbody><tr><td>@</td><td>f</td></tr></tbody></table>' ],
/* 11 */	[ '<table><tbody><tr><td>{a</td><td>b}</td></tr></tbody></table>',		'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>', 	'<p>[]@!</p>' ],
/* 12 */	[ '<table border="1" style="width:500px"><tbody><tr><td>{a</td><td>b}</td></tr></tbody></table>',
																					'<table border="1" style="width:500px"><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',
																																					'<p>[]@!</p>' ],
/* 13 */	[ '<table><tbody><tr><td>a</td><td>b</td></tr><tr><td>{c</td><td>d}</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>',
																					'<table><tbody><tr><td>c</td><td>d</td></tr></tbody></table>',	'<table><tbody><tr><td>a</td><td>b[]</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>' ],
/* 14 */	[ '<table><tbody><tr><td>{a</td><td>b</td></tr><tr><td>c</td><td>d}</td></tr><tr><td>e</td><td>f</td></tr></tbody></table>',
																					'<table><tbody><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></tbody></table>',
																																					'<table><tbody><tr><td>[]e</td><td>f</td></tr></tbody></table>' ],
/* 15 */	[ '<p>[a</p><table><tbody><tr><td>b</td><td>cd</td></tr></tbody></table><p>e}f</p>',
																					'<p>a</p><table><tbody><tr><td>b</td><td>cd</td></tr></tbody></table><p>e</p>',
																																					'<p>[]@!</p><table><tbody><tr><td>@</td><td>@</td></tr></tbody></table><p>f</p>' ]
		],
		'lists': [
/* 1 */		[ '<ol><li>a{b}c</li></ol>', 											'b',															'<ol><li>a[]c</li></ol>' ],
/* 2 */		[ '<ol><li>{a}</li></ol>', 												'a',															'<ol><li>[]@1</li></ol>' ],
/* 3 */		[ '<div><ol><li>{a}</li></ol></div>', 									'a',															'<div><ol><li>[]@1</li></ol></div>' ],
/* 4 */		[ '<ol><li>a{b</li><li>c}d</li></ol>', 									'<ol><li>b</li><li>c</li></ol>',								'<ol><li>a[]d</li></ol>' ],
/* 5 */		[ '<ol><li>a{b</li></ol><ol><li>c}d</li></ol>', 						'<ol><li>b</li></ol><ol><li>c</li></ol>',						'<ol><li>a[]d</li></ol>' ],
/* 6 */		[ '<ol><li>a{b</li></ol><ul><li>c}d</li></ul>', 						'<ol><li>b</li></ol><ul><li>c</li></ul>',						'<ol><li>a[]d</li></ol>' ],
/* 7 */		[ '<ol><li>a<ul><li>b{c</li></ul></li><li>d}e</li></ol>', 				'<ol><li><ul><li>c</li></ul></li><li>d</li></ol>',				'<ol><li>a<ul><li>b[]e</li></ul></li></ol>' ],
/* 8 */		[ '<ol><li>a{b<ul><li>c}d</li><li>e</li></ul></li><li>f</li></ol>', 	'<ol><li>b<ul><li>c</li></ul></li></ol>',						'<ol><li>a[]d<ul><li>e</li></ul></li><li>f</li></ol>' ],
/* 9 */		[ '<ol><li>a</li><li>b{c</li><li>d}e</li></ol>', 						'<ol><li>c</li><li>d</li></ol>',								'<ol><li>a</li><li>b[]e</li></ol>' ],
/* 10 */	[ '<ol><li>a{b</li><li><b>c}d</b></li></ol>', 							'<ol><li>b</li><li><b>c</b></li></ol>',							'<ol><li>a[]<b>d</b></li></ol>' ],
/* 11 */	[ '<ol><li><b>a{b</b></li><li><b>c}d</b></li></ol>', 					'<ol><li><b>b</b></li><li><b>c</b></li></ol>',					'<ol><li><b>a[]d</b></li></ol>' ]
		],
		'various anchored in element': [
/* 1 */		[ '<p>[]a</p>', 														'',																'<p>[]a</p>' ],
/* 2 */		[ '<p>[a]</p>', 														'a',															'<p>[]@!</p>' ],
/* 3 */		[ '<p>a[b]</p>', 														'b',															'<p>a[]</p>' ],
/* 4 */		[ '<p>a<b>[b]</b>c</p>', 												'<b>b</b>',														'<p>a[]c</p>' ],
/* 5 */		[ '<p>a<a href="#">[b]</a>c</p>', 										'<a href="#">b</a>',											'<p>a[]c</p>' ],
/* 6 */		[ '<p>a[<b>b</b>]c</p>', 												'<b>b</b>',														'<p>a[]c</p>' ],
/* 7 */		[ '<table><tbody><tr>[<td>a</td>]</tr></tbody></table>', 				'a',															'<table><tbody><tr><td>[]@1</td></tr></tbody></table>' ],
/* 8 */		[ '<table><tbody><tr><td>a[</td><td>b</td>]</tr></tbody></table>', 		'<table><tbody><tr><td></td><td>b</td></tr></tbody></table>',	'<table><tbody><tr><td>a[]</td><td>@</td></tr></tbody></table>' ],
/* 9 */		[ '<table><tbody><tr>[<td>a</td><td>b</td>]</tr></tbody></table>', 		'<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>',	'<p>[]@!</p>' ],
/* 10 */	[ '<p>[a@]</p>', 														'a',															'<p>[]@!</p>' ],
/* 11 */	[ '<p>[a]@</p>', 														'a',															'<p>[]@!</p>' ],
/* 12 */	[ '<p>[a]<br />@</p>', 													'a',															'<p>[]<br />@</p>' ],
/* 13 */	[ '<p>[a<br />]@</p>', 													'a<br />',														'<p>[]@!</p>' ],
/* 14 */	[ '[<hr />]', 															'<hr />',														'[]@' ],
/* 15 */	[ '[<img src="' + img_src + '" />]', 									'<img src="' + img_src + '" />',								'[]@' ],
/* 16 */	[ '<p>[<img src="' + img_src + '" />]</p>', 							'<img src="' + img_src + '" />',								'<p>[]@!</p>' ],
/* 17 */	[ '<br />[<br />]<br />',												'<br />',														'<br />[]<br />' ],
/* 18 */	[ '<table><thead><tr>[<th>a</th>]</tr></thead><tbody><tr><td>b</td></tr></tbody></table>',
																					'a',															'<table><tbody><tr><td>b</td></tr></tbody></table>' ]
		]
	}, 'inline' );

	addTests( {
		'header': [
/* 1 */		[ '{a}',																'a',															'[]@' ],
/* 2 */		[ 'a<b>{b}</b>c',														'<b>b</b>',														'a[]c' ],
/* 3 */		[ '{a<b>b</b>c}',														'a<b>b</b>c',													'[]@' ],
/* 4 */		[ '[a<b>b</b>c]',														'a<b>b</b>c',													'[]@' ]
		]
	}, 'header' );

	bender.test( tests );

	// <DEV>
	// playground.appendTo( CKEDITOR.document.getBody() );
	// </DEV>
} )();