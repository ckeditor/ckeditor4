( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},
		inline: {
			creator: 'inline'
		}
	};

	// (#3175)
	var tests = {
		'tc 1': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]</p><p>baz</p>'
		} ),
		'tc 2': testSelection( {
			initial: '<p>foo[</p><p>bar]</p><p>baz</p>',
			expected: '<p>foo</p><p>[bar]</p><p>baz</p>'
		} ),
		'tc 3': testSelection( {
			initial: '<p>foo[</p><p>bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]</p><p>baz</p>'
		} ),
		'tc 4': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>b]az</p>',
			expected: '<p>foo</p><p>[bar</p><p>b]az</p>'
		} ),
		'tc 5': testSelection( {
			initial: '<p>fo[o</p><p>bar]</p><p>baz</p>',
			expected: '<p>fo[o</p><p>bar]</p><p>baz</p>'
		} ),
		'tc 6': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]</p><p>baz</p>'
		} ),
		'tc 7': testSelection( {
			initial: '<p>foo</p><p>[]bar</p><p>baz</p>',
			expected: '<p>foo</p><p>[]bar</p><p>baz</p>'
		} )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function testSelection( options ) {
		return function( editor ) {
			bender.tools.selection.setWithHtml( editor, options.initial );

			var actual = bender.tools.selection.getWithHtml( editor );

			assert.beautified.html( options.expected, normalizeHtml( actual ) );
		};
	}

	function normalizeHtml( html ) {
		return html.toLowerCase()
			.replace( /(<p>(<br>|&nbsp;)<\/p>|<p><\/p>$|<br>|\s|\u200B)/g, '' )
			.replace( '{', '[' )
			.replace( '}', ']' );
	}
} )();
