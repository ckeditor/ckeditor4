/* bender-tags: editor,unit,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: ../copyformatting/_helpers/tools.js */

( function() {
	'use strict';


	bender.editor = {};

	function testStyles( name ) {
		bender.tools.testInputOut( name, function( styles, parsed ) {
			var stylesObj = JSON.parse( parsed ),
				tested = CKEDITOR.plugins.pastefromword.parseStyles( styles );

			objectAssert.areDeepEqual( stylesObj, tested, name );
		} );
	}

	function testInlining( name ) {
		bender.tools.testInputOut( name, function( input, output ) {
			var parsed = CKEDITOR.plugins.pastefromword.inlineStyles( input );

			bender.assert.beautified.html( output, bender.tools.fixHtml( parsed.getBody().getHtml() ), name );
		} );
	}

	function testFiltering( name ) {
		bender.tools.testInputOut( name, function( styles, parsed ) {
			var stylesObj = JSON.parse( parsed ),
				tested = CKEDITOR.plugins.pastefromword.filterStyles( JSON.parse( styles ) );

			objectAssert.areDeepEqual( stylesObj, tested, name );
		} );
	}

	var tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}
		},

		'test if CKEDITOR.parseStyles parses styles correctly': function() {
			testStyles( 'styles1' );
			testStyles( 'styles2' );
			testStyles( 'multiple' );
			testStyles( 'empty' );
			testStyles( 'font-face' );
			testStyles( 'page' );
		},

		'test parsing styles from real style element': function() {
			var expected = {
					'.MsoChpDefault': {
						'font-family': 'Calibri'
					}
				},
				actual = CKEDITOR.plugins.pastefromword.parseStyles( CKEDITOR.document.getById( 'real-style' ) );

			objectAssert.areDeepEqual( expected, actual );
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
