/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: ../copyformatting/_helpers/tools.js */

( function() {
	'use strict';


	bender.editor = {};

	function testStyles( name ) {
		bender.tools.testInputOut( name, function( styles, expected ) {
			var tested = CKEDITOR.plugins.pastefromword.styles.inliner.parse( styles );

			// In `CKEDITOR.plugins.pastefromword.styles.inliner.parse#createIsolatedStylesheet`
			// function Edge camelcases the selectors so we need to lowercase them (#1042).
			if ( CKEDITOR.plugins.clipboard.isCustomCopyCutSupported && CKEDITOR.env.edge ) {
				CKEDITOR.tools.array.forEach( tested, function( item ) {
					item.selector = item.selector.toLowerCase();
				} );
			}

			assert.beautified.js( expected, JSON.stringify( tested ), name );
		} );
	}

	function testInlining( name ) {
		bender.tools.testInputOut( name, function( input, output ) {
			var parsed = CKEDITOR.plugins.pastefromword.styles.inliner.inline( input );

			bender.assert.beautified.html( output, bender.tools.fixHtml( parsed.getBody().getHtml() ), name );
		} );
	}

	function testFiltering( name ) {
		bender.tools.testInputOut( name, function( styles, expected ) {
			var tested = CKEDITOR.plugins.pastefromword.styles.inliner.filter( JSON.parse( styles ) );

			assert.beautified.js( expected, JSON.stringify( tested ), name );
		} );
	}

	var tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}
		},

		'test if parseStyles parses styles correctly': function() {
			testStyles( 'styles1' );
			testStyles( 'styles2' );
			testStyles( 'multiple' );
			testStyles( 'empty' );
			testStyles( 'font-face' );
			testStyles( 'page' );
		},

		'test parsing styles from real style element': function() {
			var parseStyles = CKEDITOR.plugins.pastefromword.styles.inliner.parse,
				expected = [ {
					selector: '.MsoChpDefault',
					styles: {
						'font-family': 'Calibri'
					}
				} ];

			assert.beautified.js( JSON.stringify( expected ),
				JSON.stringify( parseStyles( CKEDITOR.document.getById( 'real-style' ) ) ) );
		},

		'test parsing styles from a fake style element': function() {
			var parseStyles = CKEDITOR.plugins.pastefromword.styles.inliner.parse,
				expected = [ {
					selector: '.MsoChpDefault',
					styles: {
						'font-family': 'Calibri'
					}
				}, {
					selector: 'div a.foo, .bar',
					styles: {
						'text-decoration': 'underline'
					}
				} ];

			assert.beautified.js( JSON.stringify( expected ),
				JSON.stringify( parseStyles( CKEDITOR.document.getById( 'fake-style' ) ) ) );
		},

		'test filtering styles': function() {
			testFiltering( 'filter1' );
		},

		'test inlining styles': function() {
			testInlining( 'inline1' );
			testInlining( 'inline2' );
			testInlining( 'multiple-inline' );
		},

		'test parsing styles specificity': function() {
			testInlining( 'style-specificity' );
			testInlining( 'style-specificity-multiple' );
			testInlining( 'style-specificity-inline' );
			testInlining( 'style-specificity-order' );
		}
	};

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/pastefromword/filter/default.js' ), function() {
		bender.test( tests );
	}, null, true );
} )();
