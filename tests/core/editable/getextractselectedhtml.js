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
		return html.replace( /@/g, '<br />' );
	}

	function addTests( cases, method, prefix ) {
		var group, i, tc, name;

		for ( group in cases ) {
			for ( i = 0; i < cases[ group ].length; i++ ) {
				tc = cases[ group ][ i ];
				name = 'test ' + prefix + ', ' + group + ' #' + ( i + 1 );

				// <DEV>
				CKEDITOR.dom.element.createFromHtml( '<dt>' + name + ':</dt>' ).appendTo( playground );
				CKEDITOR.dom.element.createFromHtml( '<dd contenteditable="true" style="outline: 1px dashed orange; font-family: monospace">' + tc[ 0 ] + '</dd>' ).appendTo( playground );
				// </DEV>

				tests[ name ] = method( tc[ 0 ], tc[ 1 ] );
			}
		}
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

	function assertExtractSelectedHtmlFromRange( html, expected ) {
		return function() {
			html = decodeBoguses( html );
			expected = decodeBoguses( expected );

			var editable = this.editables.inline,
				range = setWithHtml( editable, html );

			editable.extractSelectedHtmlFromRange( range );

			assert.areSame( expected, getWithHtml( editable, range ), 'HTML of editable, once extracted' );
		};
	}

	addTests( {
		'no block': [
			[ '{x}', 																'x' ],
			[ '{}x', 																'']
		],
		'block': [
			[ '<p>{x}</p>', 														'<p>x</p>' ],
			[ '<p>x{x}</p>', 														'x' ],
			[ '<p>{x}x</p>', 														'x' ],
			[ '<p>x{x}x</p>', 														'x' ],
		],
		'cross-block': [
			[ '<p>x{</p><p>}x</p>', 												'' ],
			[ '<p>{x</p><p>x}</p>', 												'<p>x</p><p>x</p>' ],
			[ '<p>y{x</p><p>x}y</p>', 												'<p>x</p><p>x</p>' ],
			[ '<blockquote>y{x</blockquote><p>x}y</p>', 							'<blockquote>x</blockquote><p>x</p>' ],
			[ '<blockquote>y{x</blockquote><div>x</div><p>x}y</p>', 				'<blockquote>x</blockquote><div>x</div><p>x</p>' ],
			[ '<div>y<div>{x</div></div><div>x</div><p>x}y</p>', 					'<div><div>x</div></div><div>x</div><p>x</p>' ],
		],
		'inline': [
			[ '<p>x<b>{y}</b>x</p>', 												'<b>y</b>' ],
			[ '<p>x<b>y{y}y</b>x</p>', 												'<b>y</b>' ],
			[ '<p><b>{y}</b></p>', 													'<b>y</b>' ],
			[ '<p>x<a href="#">{y}</a>x</p>', 										'<a href="#">y</a>' ],
			[ '<p>x<a href="#">x{y}x</a>x</p>', 									'<a href="#">y</a>' ],
			[ '<p>x<b id="foo">{y}</b>x</p>', 										'<b id="foo">{y}</b>' ],
			[ '<p><b style="color:red">{y}</b></p>', 								'<b style="color:red">y</b>' ],
			[ '<p>x<b style="color:red">{y}</b>x</p>', 								'<b style="color:red">y</b>' ],

		],
		'cross-inline': [
			[ '<p>{x<b>y}</b>x</p>', 												'x<b>y</b>' ],
			[ '<p>x<b>{y</b>x}</p>', 												'<b>y</b>x' ],
			[ '<p>{x<b>y</b>x}</p>', 												'<p>x<b>y</b>x</p>' ],
			[ '<p>x{<b>y</b>}x</p>', 												'<b>y</b>' ],
			[ '<p><b>{x</b><b>y}</b></p>', 											'<p><b>x</b><b>y</b></p>' ],
			[ '<p>x<b class="a">{y</b><b class="b">y}</b>x</p>', 					'<b class="a">y</b><b class="b">y</b>' ],
			[ '<p>x<b class="a">{y</b>x<b class="b">y}</b>x</p>', 					'<b class="a">y</b>x<b class="b">y</b>' ],
		],
		'bogus': [
			[ '<p>{x}@</p>', 														'<p>x</p>' ],
			[ '<p><b>{x}</b>@</p>', 												'<b>x</b>' ],
			[ '<p><b>{x}@</b></p>', 												'<b>x</b>' ],
		],
		'tables': [
			[ '<table><tbody><tr><td>{x}</td></tr></tbody></table>', 				'x' ],
			[ '<table><tbody><tr><td>x{x}x</td></tr></tbody></table>', 				'x' ],
			[ '<table><tbody><tr><td>y{x</td><td>x}y</td></tr></tbody></table>', 	'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>' ],
			[ '<table><tbody><tr>[<td>x</td><td>x}y</td></tr></tbody></table>', 	'<table><tbody><tr><td>x</td><td>x</td></tr></tbody></table>' ],
			[ '<table><tbody><tr><td>{x</td></tr></tbody></table><table><tbody><tr><td>x</td></tr><tr><td>x}</td><td>y</td></tr></tbody></table>',
																					'<table><tbody><tr><td>x</td></tr></tbody></table><table><tbody><tr><td>x</td></tr><tr><td>x</td></tr></tbody></table>' ],
		],
		'lists': [
			[ '<ol><li>{x}</li></ol>', 												'x' ],
			[ '<ol><li>x{x}x</li></ol>', 											'x' ],
			[ '<ol><li>y{x</li><li>x}y</li></ol>', 									'<ol><li>x</li><li>x</li></ol>' ],
			[ '<ol><li>y{x</li></ol><ol><li>x}y</li></ol>', 						'<ol><li>x</li></ol><ol><li>x</li></ol>' ],
			[ '<ol><li><ul><li>y{x</li></ul></li><li>x}y</li></ol>', 				'<ol><li><ul><li>x</li></ul></li><li>x</li></ol>' ],
		],
		'various anchored in element': [
			[ '<p>[]x</p>', 														'' ],
			[ '<p>[x]</p>', 														'<p>x</p>' ],
			[ '<p>x[x]</p>', 														'x' ],
			[ '<p>x<b>[y]</b>x</p>', 												'<b>y</b>' ],
			[ '<p>x<a href="#">[y]</a>x</p>', 										'<a href="#">y</a>' ],
			[ '<p>x[<b>y</b>]x</p>', 												'<b>y</b>' ],
			[ '<table><tbody><tr>[<td>x</td>]</tr></tbody></table>', 				'<table><tbody><tr><td>x</td></tr></tbody></table>' ],
			[ '<table><tbody><tr><td>x[</td><td>y</td>]</tr></tbody></table>', 		'<table><tbody><tr><td></td><td>y</td></tr></tbody></table>' ],
			[ '<ol><li>x[</li></ol><ol><li>x]y</li></ol>', 							'<ol><li></li></ol><ol><li>x</li></ol>' ],
			[ '<p>[x@]</p>', 														'<p>x</p>' ],
			[ '<p>[x]@</p>', 														'<p>x</p>' ],
			[ '[<hr>]', 															'<hr>' ],
			[ '[<img src="' + img_src + '">]', 										'<img src="' + img_src + '">' ],
		]
	}, assertGetSelectedHtmlFromRange, 'getSelectedHtmlFromRange' );

	bender.test( tests );

	// <DEV>
	playground.appendTo( CKEDITOR.document.getBody() );
	// </DEV>
} )();