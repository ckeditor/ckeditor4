/* bender-tags: editor,pastefromwordimage */
/* bender-ckeditor-plugins: pastefromwordimage,ajax */

( function() {
	'use strict';

	bender.test( {
		cacheBuster: function() {
			return ( new Date() ).getTime().toString() + Math.floor( Math.random() * 1000000 ).toString();
		},

		'test img tags extraction from html string': function() {
			var sourceLength = 5,
				i;

			for ( i = 0; i < sourceLength; i++ ) {
				bender.tools.testInputOut( 'source' + i, function( input, output ) {
					var expectedResult = JSON.parse( output.replace( /<!--/, '' ).replace( /-->/, '' ) ),
						actualResult = CKEDITOR.plugins.pastefromwordimage.extractImgTagsFromHtml( input ),
						j;

					assert.areSame( expectedResult.length, actualResult.length );
					for ( j = 0; j < actualResult.length; j++ ) {
						assert.areSame( expectedResult[ j ], actualResult[ j ] );
					}
				} );
			}
		},

		'test extract images hexstrings from rtf': function() {
			var oldEnv = CKEDITOR.env.mac,
				actualResult,
				testCase,
				// Test description:
				// 1. Single Image
				// 2. Mixed: image online, image offline, word shape
				// 3. No images in RTF
				// 4. Image with hyperlink
				// 5. Image with changed wrapping option
				testCases = [
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers1.rtf' + '?' + this.cacheBuster() ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers1.json' + '?' + this.cacheBuster() ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers2.rtf' + '?' + this.cacheBuster()  ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers2.json' + '?' + this.cacheBuster() ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers3.rtf' + '?' + this.cacheBuster() ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers3.json' + '?' + this.cacheBuster() ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers4.rtf' + '?' + this.cacheBuster() ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers4.json' + '?' + this.cacheBuster() ) )
				},
				{
					rtf: CKEDITOR.ajax.load( './_fixtures/helpers5.rtf' + '?' + this.cacheBuster() ),
					result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers5.json' + '?' + this.cacheBuster() ) )
				}
			];
			CKEDITOR.env.mac = false;
			while ( testCase = testCases.shift() ) {
				actualResult = CKEDITOR.plugins.pastefromwordimage.extractImagesFromRtf( testCase.rtf );
				assert.areSame( testCase.result.length, actualResult.length );
				for ( var i = 0; i < actualResult.length; i++ ) {
					objectAssert.areEqual( testCase.result[ i ], actualResult[ i ] );
				}
			}
			CKEDITOR.env.mac = oldEnv;
		},

		'test extract images hexstrings from rtf for MacOS': function() {
			var oldEnv = CKEDITOR.env.mac,
				actualResult,
				testCase,
				// Test description:
				// 1. Single Image
				// 2. Mixed: image online, image offline, word shape
				// 3. Image with hyperlink
				// 4. Image with changed wrapping option
				testCases = [
					{
						rtf: CKEDITOR.ajax.load( './_fixtures/helpers6.rtf' + '?' + this.cacheBuster() ),
						result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers6.json' + '?' + this.cacheBuster() ) )
					},
					{
						rtf: CKEDITOR.ajax.load( './_fixtures/helpers7.rtf' + '?' + this.cacheBuster() ),
						result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers7.json' + '?' + this.cacheBuster() ) )
					},
					{
						rtf: CKEDITOR.ajax.load( './_fixtures/helpers8.rtf' + '?' + this.cacheBuster() ),
						result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers8.json' + '?' + this.cacheBuster() ) )
					},
					{
						rtf: CKEDITOR.ajax.load( './_fixtures/helpers9.rtf' + '?' + this.cacheBuster() ),
						result: JSON.parse( CKEDITOR.ajax.load( './_fixtures/helpers9.json' + '?' + this.cacheBuster() ) )
					}
				];
			CKEDITOR.env.mac = true;

			while ( testCase = testCases.shift() ) {
				actualResult = CKEDITOR.plugins.pastefromwordimage.extractImagesFromRtf( testCase.rtf );
				assert.areSame( testCase.result.length, actualResult.length );
				for ( var i = 0; i < actualResult.length; i++ ) {
					objectAssert.areEqual( testCase.result[ i ], actualResult[ i ] );
				}
			}
			CKEDITOR.env.mac = oldEnv;
		}
	} );
} )();
