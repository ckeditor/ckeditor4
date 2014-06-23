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
		container = new CKEDITOR.dom.element( 'div' );

	function g( html, expected ) {
		return function() {
			var editable = this.editables.inline,
				range = setWithHtml( editable, html ),
				docFragment = editable.getSelectedHtmlFromRange( range );

			assert.areSame( expected, docFragment.getHtml(), 'Selected HTML' );
			assert.areSame( html, getWithHtml( editable, range ), 'HTML of editable, untouched once get' );
		};
	}

	function e( html, expected ) {
		return function() {
			var editable = this.editables.inline,
				range = setWithHtml( editable, html );

			editable.extractSelectedHtmlFromRange( range );

			assert.areSame( expected, getWithHtml( editable, range ), 'HTML of editable, once extracted' );
		};
	}

	bender.test( {
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
		},

		'test get: #1 (text)': 					g( '{x}', 																'x' ),
		'test get: #2 (text)': 					g( '{}x', 																'' ),
		'test get: #3 (text)': 					g( '{}x', 																'' ),
		'test get: #4 (text)': 					g( '<p>x<b>{y}</b>x</p>', 												'<b>y</b>' ),
		'test get: #5 (text)': 					g( '<p>x<b>y{y}y</b>x</p>', 											'<b>y</b>' ),
		'test get: #6 (text)': 					g( '<p><b>{y}</b></p>', 												'<b>y</b>' ),
		'test get: #7 (text)': 					g( '<p>x<a href="#">{y}</a>x</p>', 										'<a href="#">y</a>' ),
		'test get: #8 (text)': 					g( '<p>x<a href="#">x{y}x</a>x</p>', 									'<a href="#">y</a>' ),
		'test get: #9 (text)': 					g( '<p><span style="color:red">{y}</span></p>', 						'<span style="color:red">y</span>' ),
		'test get: #10 (text)': 				g( '<p>x<span style="color:red">{y}</span>x</p>', 						'<span style="color:red">y</span>' ),
		'test get: #11 (text)': 				g( '<p>{x<b>y}</b>x</p>', 												'<p>x<b>y</b></p>' ),
		'test get: #12 (text)': 				g( '<p>x<b>{y</b>x}</p>', 												'<p><b>y</b>x</p>' ),
		'test get: #13 (text)': 				g( '<p>{x<b>y</b>x}</p>', 												'<p>x<b>y</b>x</p>' ),
		'test get: #14 (text)': 				g( '<p>x{<b>y</b>}x</p>', 												'<p><b>y</b></p>' ),
		'test get: #15 (text)': 				g( '<p>x{</p><p>}x</p>', 												'' ),
		'test get: #16 (text)': 				g( '<p>{x</p><p>x}</p>', 												'<p>x</p><p>x</p>' ),

		//'test get: #9 (text)': 							g( '<table><tbody><tr>[<td>foo</td><td>x]y</td></tr></tbody></table>', 								'<span style="color:red">{y}</span>' ),

		'test extract: #1 (text)': 				e( '<p>x<a href="#">{y}</a>x</p>', 										'<p>x{}x</p>' ),
		'test extract: #2 (text)': 				e( '<p>x<span>{y}</span>x</p>', 										'<p>x{}x</p>' ),
		'test extract: #3 (text)': 				e( '<p>{x}</p>', 														'{}' )
	} );
} )();