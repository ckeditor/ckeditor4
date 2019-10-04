/* bender-tags: editor,pastefromword */
/* bender-ckeditor-plugins: pastetools, pastefromword,ajax */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';


	var extractImagesTestsGenerator = function() {
		function cacheBuster() {
			return ( new Date() ).getTime().toString() + Math.floor( Math.random() * 1000000 ).toString();
		}

		function getTest( name ) {
			return function() {
				CKEDITOR.ajax.load( './_fixtures/' + name + '.rtf?' + cacheBuster(), function( rtf ) {
					CKEDITOR.ajax.load( './_fixtures/' + name + '.json?' + cacheBuster(), function( json ) {
						resume( function() {
							var actualResult = CKEDITOR.plugins.pastefromword.images.extractFromRtf( rtf ),
								expectedResult = JSON.parse( json );
							assert.areSame( expectedResult.length, actualResult.length );
							for ( var i = 0; i < actualResult.length; i++ ) {
								objectAssert.areEqual( expectedResult[ i ], actualResult[ i ] );
							}
						} );
					} );
				} );
				wait();
			};
		}

		var i,
			obj = {},
			testsFilesNames = [
				'singleimage_win',
				'multipleimagesandshapes_win',
				'noimage_win',
				'hyperlinkedimage_win',
				'wrappedimage_win',
				'twoimages_mac',
				'multipleimagesandshapes_mac',
				'hyperlinkedimage_mac',
				'wrappedimage_mac'
			];

		for ( i = 0; i < testsFilesNames.length; i++ ) {
			obj[ 'test extract images from rtf file (' + testsFilesNames[ i ] + ')' ] = getTest( testsFilesNames[ i ] );
		}
		return obj;
	};

	var tests = {
		'test img tags extraction from html string': function() {
			var sourceLength = 5,
				i;

			for ( i = 0; i < sourceLength; i++ ) {
				bender.tools.testInputOut( 'source' + i, function( input, output ) {
					var expectedResult = JSON.parse( output ),
						actualResult = CKEDITOR.plugins.pastefromword.images.extractTagsFromHtml( input ),
						j;
					assert.areSame( expectedResult.length, actualResult.length );
					for ( j = 0; j < actualResult.length; j++ ) {
						assert.areSame( expectedResult[ j ], actualResult[ j ] );
					}
				} );
			}
		}
	};

	tests = CKEDITOR.tools.extend( tests, extractImagesTestsGenerator() );

	ptTools.ignoreTestsOnMobiles( tests );

	ptTools.testWithFilters( tests, [
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastefromword' ) + 'filter/default.js' )
	] );
} )();
