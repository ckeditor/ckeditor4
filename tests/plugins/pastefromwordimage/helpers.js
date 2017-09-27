/* bender-tags: editor,pastefromwordimage */
/* bender-ckeditor-plugins: pastefromwordimage,ajax */

( function() {
	'use strict';

	bender.test( {
		'test img tags extraction from html string': function() {
			bender.tools.testInputOut( 'source1', function( input, output ) {
				var expectedResult = JSON.parse( output.replace( /<!--/, '' ).replace( /-->/, '' ) ),
					actualResult = CKEDITOR.plugins.pastefromwordimage.extractImgTagsFromHtmlString( input ),
					i;

				assert.areSame( expectedResult.length, actualResult.length );

				for ( i = 0; i < actualResult.length; i++ ) {
					assert.areSame( expectedResult[ i ][ 0 ], actualResult[ i ][ 0 ] );
					assert.areSame( expectedResult[ i ][ 1 ], actualResult[ i ][ 1 ] );
				}
			} );
		},

		'test extract images hexstrings from rtf': function() {
			var actualResult,
				testCase,
				testCases = [
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers1.rtf' ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers1.json' ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers2.rtf' ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers2.json' ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers3.rtf' ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers3.json' ) )
				}
			];

			while ( testCase = testCases.shift() ) {
				actualResult = CKEDITOR.plugins.pastefromwordimage.extractImagesFromRtf( testCase.rtf );
				assert.areSame( testCase.result.length, actualResult.length );
				for ( var i = 0; i < actualResult.length; i++ ) {
					objectAssert.areEqual( testCase.result[ i ], actualResult[ i ] );
				}
			}
		}
	} );
} )();
