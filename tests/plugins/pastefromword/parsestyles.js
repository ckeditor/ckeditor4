/* bender-tags: editor,unit,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: ../copyformatting/_helpers/tools.js */

( function() {
	'use strict';


	bender.editor = {};

	function testStyles( name ) {
		bender.tools.testInputOut( name, function( styles, expected ) {
			var tested = CKEDITOR.plugins.pastefromword.styles.inliner.parse( styles );

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
				expected = {
					'.MsoChpDefault': {
						'font-family': 'Calibri'
					}
				};

			assert.beautified.js( JSON.stringify( expected ),
				JSON.stringify( parseStyles( CKEDITOR.document.getById( 'real-style' ) ) ) );
		},

		'test parsing styles from a fake style element': function() {
			var parseStyles = CKEDITOR.plugins.pastefromword.styles.inliner.parse,
				expected = {
					'.MsoChpDefault': {
						'font-family': 'Calibri'
					},
					'div a.foo, .bar': {
						'text-decoration': 'underline'
					}
				};

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
		}
	};

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/pastefromword/filter/default.js' ), function() {
		bender.test( tests );
	}, null, true );
} )();
