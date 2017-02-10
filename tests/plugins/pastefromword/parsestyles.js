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
		},

		'test parsing styles from real style element': function() {
			var expected = {
					'.MsoChpDefault': {
						'font-family': 'Calibri'
					}
				},
				actual = CKEDITOR.plugins.pastefromword.parseStyles( CKEDITOR.document.getById( 'real-style' ) );

			objectAssert.areDeepEqual( expected, actual );
		}
	};

	CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/pastefromword/filter/default.js' ), function() {
		bender.test( tests );
	}, null, true );
} )();
