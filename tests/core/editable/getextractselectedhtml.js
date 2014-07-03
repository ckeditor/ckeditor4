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
		}
	};

	var setWithHtml = bender.tools.range.setWithHtml,
		getWithHtml = bender.tools.range.getWithHtml,
		container = new CKEDITOR.dom.element( 'div' ),
		img_src = '%BASE_PATH%_assets/img.gif';

	var tests = {
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
	var playground = CKEDITOR.document.createElement( 'dl' );
	playground.on( 'paste', function( e ) {
		console.log( e.data.$.clipboardData.getData( 'text/html' ) );
	} );
	// </DEV>

	function decodeBoguses( html ) {
		return html.replace( /@/g, '<br>' );
	}

	function addTests( cases, prefix ) {
		var testsGet = {},
			testsExtract = {},

			group, i, tc, name;

		for ( group in cases ) {
			for ( i = 0; i < cases[ group ].length; i++ ) {
				tc = cases[ group ][ i ];
				name = group + ' #' + ( i + 1 );

				// <DEV>
				CKEDITOR.dom.element.createFromHtml( '<dt>' + name + ':</dt>' ).appendTo( playground );
				CKEDITOR.dom.element.createFromHtml( '<dd contenteditable="true" style="outline: 1px dashed orange; font-family: monospace">' + decodeBoguses( tc[ 0 ] ) + '</dd>' ).appendTo( playground );
				// </DEV>

				testsGet[ 'test get: ' + name ] = assertGetSelectedHtmlFromRange( tc[ 0 ], tc[ 1 ] );
				testsExtract[ 'test extract: ' + name ] = assertExtractSelectedHtmlFromRange( tc[ 0 ], tc[ 1 ], tc[ 2 ] );
			}
		}

		CKEDITOR.tools.extend( tests, testsGet, testsExtract );
	}

	function assertGetSelectedHtmlFromRange( html, expected ) {
		return function() {
			html = decodeBoguses( html );
			expected = decodeBoguses( expected );

			var editable = this.editables.inline,
				range = setWithHtml( editable, html ),
				docFragment = editable.getSelectedHtmlFromRange( range );

			assert.areSame( expected, docFragment.getHtml(), 'Selected HTML' );
			assert.areSame( html, getWithHtml( editable, range ), 'HTML of editable, untouched once get' );
		};
	}

	function assertExtractSelectedHtmlFromRange( html, htmlGet, htmlWithSelection ) {
		return function() {
			html = decodeBoguses( html );
			htmlGet = decodeBoguses( htmlGet );
			htmlWithSelection = decodeBoguses( htmlWithSelection );

			var editable = this.editables.inline,
				range = setWithHtml( editable, html ),
				docFragment = editable.extractSelectedHtmlFromRange( range );

			assert.areSame( htmlGet, docFragment.getHtml(), 'HTML which has been extracted' );
			assert.areSame( htmlWithSelection, getWithHtml( editable, range ), 'HTML of editable, once extracted' );
		};
	}

	addTests( {
		'no block': [
/*1*/		[ '{x}', 																'x',															'[]' ],
/*2*/		[ '{}x', 																'',															 	'[]x' ],
		],
		'block': [
/*1*/		[ '<p>{x}</p>', 														'<p>x</p>',														'[]' ],
/*2*/		[ '<p>x{x}</p>', 														'x',															'<p>x[]</p>' ],
/*3*/		[ '<p>{x}x</p>', 														'x',															'<p>[]x</p>' ],
/*4*/		[ '<p>x{x}x</p>', 														'x',															'<p>x[]x</p>' ],
		],
		'cross-block': [
/*1*/		[ '<p>x{</p><p>}x</p>', 												'',																'<p>x[]</p><p>x</p>' ],
/*2*/		[ '<p>{x</p><p>x}</p>', 												'<p>x</p><p>x</p>',												'[]' ],
/*3*/		[ '<p>y{x</p><p>x}y</p>', 												'<p>x</p><p>x</p>',												'<p>y[]</p><p>y</p>' ],
/*4*/		[ '<blockquote>y{x</blockquote><p>x}y</p>', 							'<blockquote>x</blockquote><p>x</p>',							'<blockquote>y[]</blockquote><p>y</p>' ],
/*5*/		[ '<blockquote>y{x</blockquote><div>x</div><p>x}y</p>', 				'<blockquote>x</blockquote><div>x</div><p>x</p>',				'<blockquote>y[]</blockquote><p>y</p>' ],
/*6*/		[ '<div>y<div>{x</div></div><div>x</div><p>x}y</p>', 					'<div><div>x</div></div><div>x</div><p>x</p>',					'<div>y<div>[]</div></div><p>y</p>' ],
		],
		'inline': [
/*1	*/		[ '<p>x<b>{y}</b>x</p>', 												'<b>y</b>',														'<p>x[]x</p>' ],
/*2	*/		[ '<p>x<b>y{y}y</b>x</p>', 												'<b>y</b>',														'<p>x<b>y[]y</b>x</p>' ],
/*3	*/		[ '<p><b>{y}</b></p>', 													'<p><b>y</b></p>',												'[]' ],
/*4	*/		[ '<p>x<a href="#">{y}</a>x</p>', 										'<a href="#">y</a>',											'<p>x[]x</p>' ],
/*5	*/		[ '<p>x<a href="#">x{y}x</a>x</p>', 									'<a href="#">y</a>',											'<p>x<a href="#">x[]x</a>x</p>' ],
/*6	*/		[ '<p>x<b id="foo">{y}</b>x</p>', 										'<b id="foo">y</b>',											'<p>x[]x</p>' ],
/*7	*/		[ '<p><b style="color:red">{y}</b></p>', 								'<p><b style="color:red">y</b></p>',							'[]' ],
/*8	*/		[ '<p>x<b style="color:red">{y}</b>x</p>', 								'<b style="color:red">y</b>',									'<p>x[]x</p>' ],
/*9	*/		[ '<p>x<i><b>{y}</b></i></p>', 											'<i><b>y</b></i>',												'<p>x[]</p>' ],
/*10*/		[ '<p><i><b>{y}</b></i></p>', 											'<p><i><b>y</b></i></p>',										'[]' ],
		],
		'cross-inline': [
/*1*/		[ '<p>{x<b>y}</b>x</p>', 												'x<b>y</b>',													'<p>[]x</p>' ],
/*2*/		[ '<p>x<b>{y</b>x}</p>', 												'<b>y</b>x',													'<p>x[]</p>' ],
/*3*/		[ '<p>{x<b>y</b>x}</p>', 												'<p>x<b>y</b>x</p>',											'[]' ],
/*4*/		[ '<p>x{<b>y</b>}x</p>', 												'<b>y</b>',														'<p>x[]x</p>' ],
/*5*/		[ '<p><b>{x</b><b>y}</b></p>', 											'<p><b>x</b><b>y</b></p>',										'[]' ],
/*6*/		[ '<p><b>x{x</b><b>y}y</b></p>', 										'<b>x</b><b>y</b>',												'<p><b>x[]</b><b>y</b></p>' ],
/*7*/		[ '<p>x<b class="a">{y</b><b class="b">y}</b>x</p>', 					'<b class="a">y</b><b class="b">y</b>',							'<p>x[]x</p>' ],
/*8*/		[ '<p>x<b class="a">{y</b>x<b class="b">y}</b>x</p>', 					'<b class="a">y</b>x<b class="b">y</b>',						'<p>x[]x</p>' ],
		],
		'bogus': [
/*1*/		[ '<p>{x}@</p>', 														'<p>x</p>',														'[]' ],
/*2*/		[ '<p>{x@]</p>', 														'<p>x</p>',														'[]' ],
/*3*/		[ '<p><b>{x}</b>@</p>', 												'<p><b>x</b></p>',												'[]' ],
/*4*/		[ '<p><b>{x}@</b></p>', 												'<b>x</b>',														'<p>[]</p>' ],
/*5*/		[ '<p>{x}<br>@</p>', 													'x',															'<p>[]<br>@</p>' ],
		],
		'tables': [
/*1*/		[ '<table><tbody><tr><td>{x}</td></tr></tbody></table>', 				'x',															'<table><tbody><tr><td>[]</td></tr></tbody></table>' ],
/*2*/		[ '<table><tbody><tr><td>x{x}x</td></tr></tbody></table>', 				'x',															'<table><tbody><tr><td>x[]x</td></tr></tbody></table>' ],
/*3*/		[ '<table><tbody><tr><td>y{x</td><td>x}y</td></tr></tbody></table>', 	'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>',	'<table><tbody><tr><td>y[]</td><td>y</td></tr></tbody></table>' ],
/*4*/		[ '<div><table><tbody><tr><td>y{x</td><td>x}y</td></tr></tbody></table></div>',
																					'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>',	'<div><table><tbody><tr><td>y[]</td><td>y</td></tr></tbody></table></div>' ],
/*5*/		[ '<div><table><tbody><tr><td>{x}</td></tr></tbody></table></div>',		'x',															'<div><table><tbody><tr><td>[]</td></tr></tbody></table></div>' ],
/*6*/		[ '<table><tbody><tr>[<td>x</td><td>x}y</td></tr></tbody></table>', 	'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>',	'<table><tbody><tr><td>[]y</td></tr></tbody></table>' ],
/*7*/		[ '<table><tbody><tr><td>{x</td></tr></tbody></table><table><tbody><tr><td>x</td></tr><tr><td>x}</td><td>y</td></tr></tbody></table>',
																					'<table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>x</td></tr><tr><td>x</td></tr></tbody></table>',
																																					'<table><tbody><tr><td>[]</td></tr></tbody></table><table><tbody><tr><td></td><td>y</td></tr></tbody></table>' ],
/*8*/		[ '<table><tbody><tr><td>x{y</td><td>y</td></tr><tr><td>y}x</td><td>x</td></tr></tbody></table>',
																					'<table><tbody><tr><td>y</td><td>y</td></tr><tr><td>y</td></tr></tbody></table>',
																																					'<table><tbody><tr><td>x[]</td></tr><tr><td>x</td><td>x</td></tr></tbody></table>' ],
		],
		'lists': [
/*1*/		[ '<ol><li>x{x}x</li></ol>', 											'x',															'<ol><li>x[]x</li></ol>' ],
/*2*/		[ '<ol><li>{x}</li></ol>', 												'<ol><li>x</li></ol>',											'[]' ],
/*3*/		[ '<div><ol><li>{x}</li></ol></div>', 									'<ol><li>x</li></ol>',											'<div>[]</div>' ],
/*4*/		[ '<ol><li>y{x</li><li>x}y</li></ol>', 									'<ol><li>x</li><li>x</li></ol>',								'<ol><li>y[]y</li></ol>' ],
/*5*/		[ '<ol><li>y{x</li></ol><ol><li>x}y</li></ol>', 						'<ol><li>x</li></ol><ol><li>x</li></ol>',						'<ol><li>y[]y</li></ol>' ],
/*6*/		[ '<ol><li><ul><li>y{x</li></ul></li><li>x}y</li></ol>', 				'<ol><li><ul><li>x</li></ul></li><li>x</li></ol>',				'<ol><li><ul><li>y[]y</li></ol>' ],
/*7*/		[ '<ol><li>z</li><li>y{x</li><li>x}y</li></ol>', 						'<ol><li>x</li><li>x</li></ol>',								'<ol><li>z</li><li>y[]y</li></ol>' ],
/*8*/		[ '<ol><li>y{x</li></ol>x<ol><li>x}y</li></ol>', 						'<ol><li>x</li></ol>x<ol><li>x</li></ol>',						'<ol><li>y[]y</li></ol>' ],
/*9*/		[ '<ol><li>y{x</li></ol>x<ul><li>x}y</li></ul>', 						'<ol><li>x</li></ol>x<ul><li>x</li></ul>',						'<ol><li>y[]</li></ol><ul><li>y</li></ul>' ],
/*10*/		[ '<ol><li>y{x</li></ol><ol dir="rtl"><li>x}y</li></ol>', 				'<ol><li>x</li></ol><ol dir="rtl"><li>x</li></ol>',				'<ol><li>y[]</li></ol><ol dir="rtl"><li>y</li></ol>' ],
/*11*/		[ '<ol><li>y{x</li></ol><ol><li dir="rtl">x}y</li></ol>', 				'<ol><li>x</li></ol><ol><li dir="rtl">x</li></ol>',				'<ol><li>y[]</li><li dir="rtl">y</li></ol>' ],
		],
		'various anchored in element': [
/*1 */		[ '<p>[]x</p>', 														'',																'<p>[]x</p>' ],
/*2 */		[ '<p>[x]</p>', 														'<p>x</p>',														'[]' ],
/*3 */		[ '<p>x[x]</p>', 														'x',															'<p>x[]</p>' ],
/*4 */		[ '<p>x<b>[y]</b>x</p>', 												'<b>y</b>',														'<p>x[]x</p>' ],
/*5 */		[ '<p>x<a href="#">[y]</a>x</p>', 										'<a href="#">y</a>',											'<p>x[]x</p>' ],
/*6 */		[ '<p>x[<b>y</b>]x</p>', 												'<b>y</b>',														'<p>x[]x</p>' ],
/*7 */		[ '<table><tbody><tr>[<td>x</td>]</tr></tbody></table>', 				'<table><tbody><tr><td>x</td></tr></tbody></table>',			'[]' ],
/*8 */		[ '<table><tbody><tr><td>x[</td><td>y</td>]</tr></tbody></table>', 		'<table><tbody><tr><td></td><td>y</td></tr></tbody></table>',	'<table><tbody><tr><td>x[]</td></tr></tbody></table>' ],
/*9 */		[ '<ol><li>x[</li></ol><ol><li>x]y</li></ol>', 							'<ol><li></li></ol><ol><li>x</li></ol>',						'<ol><li>x[]y</li></ol>' ],
/*10*/		[ '<p>[x@]</p>', 														'<p>x</p>',														'[]' ],
/*11*/		[ '<p>[x]@</p>', 														'<p>x</p>',														'[]' ],
/*12*/		[ '<p>[x]<br>@</p>', 													'x',															'<p>[]<br>@</p>' ],
/*13*/		[ '<p>[x<br>]@</p>', 													'<p>x<br></p>',													'[]' ],
/*14*/		[ '[<hr>]', 															'<hr>',															'[]' ],
/*15*/		[ '[<img src="' + img_src + '">]', 										'<img src="' + img_src + '">',									'[]' ],
		]
	} );

	bender.test( tests );

	// <DEV>
	playground.appendTo( CKEDITOR.document.getBody() );
	// </DEV>
} )();