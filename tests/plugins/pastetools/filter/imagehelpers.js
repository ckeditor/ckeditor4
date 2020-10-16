/* bender-tags: editor,pastefromword */
/* bender-ckeditor-plugins: pastetools, ajax */
/* bender-include: ../_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	var extractImagesTestsGenerator = function() {
		function getTest( name ) {
			return function() {
				CKEDITOR.ajax.load( './_fixtures/' + name + '.rtf?' + cacheBuster(), function( rtf ) {
					CKEDITOR.ajax.load( './_fixtures/' + name + '.json?' + cacheBuster(), function( json ) {
						resume( function() {
							var actualResult = CKEDITOR.pasteFilters.image.extractFromRtf( rtf ),
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
				'wrappedimage_mac',
				'duplicatedimage'
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
						actualResult = CKEDITOR.pasteFilters.image.extractTagsFromHtml( input ),
						j;
					assert.areSame( expectedResult.length, actualResult.length );
					for ( j = 0; j < actualResult.length; j++ ) {
						assert.areSame( expectedResult[ j ], actualResult[ j ] );
					}
				} );
			}
		}
	};

	tests = CKEDITOR.tools.extend( tests, extractImagesTestsGenerator(), generateGetImageTypeTests() );

	ptTools.ignoreTestsOnMobiles( tests );

	ptTools.testWithFilters( tests, [
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js' ),
		CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js' )
	] );

	function generateGetImageTypeTests() {
		var pictureContent = '{\\*\\shppict{\\pict{\\*\\picprop\\shplid1025{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fFlipH}{\\sv 0}}{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn fLockAspectRatio}' +
			'{\\sv 1}}{\\sp{\\sn fLockPosition}{\\sv 0}}{\\sp{\\sn fLockAgainstSelect}{\\sv 0}}{\\sp{\\sn fLockAgainstGrouping}{\\sv 0}}' +
			'{\\sp{\\sn pictureGray}{\\sv 0}}{\\sp{\\sn pictureBiLevel}{\\sv 0}}{\\sp{\\sn fFilled}{\\sv 0}}{\\sp{\\sn fNoFillHitTest}{\\sv 1}}{\\sp{\\sn fLine}{\\sv 0}}' +
			'{\\sp{\\sn fNoLineDrawDash}{\\sv 0}}{\\sp{\\sn wzName}{\\sv Obraz 2}}{\\sp{\\sn wzDescription}{\\sv Descrip' +
			'tion: whatever}}{\\sp{\\sn pihlShape}{\\sv {\\*\\hl{\\hlfr http://ckeditor.com}{\\hlsrc http://ckeditor.com}}}}{\\sp{\\sn dhgt}' +
			'{\\sv 251658240}}{\\sp{\\sn fIsButton}{\\sv 1}}{\\sp{\\sn fHidden}{\\sv 0}}{\\sp{\\sn fLayoutInCell}{\\sv 1}}}\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0' +
			'\\piccropb0\\picw1693\\pich1693\\picwgoal960\\pichgoal960{MARKER}\\bliptag1808877785',
			fixtures = [
				{
					marker: '\\pngblip',
					type: 'image/png'
				},

				{
					marker: '\\jpegblip',
					type: 'image/jpeg'
				},

				{
					marker: '\\emfblip',
					type: 'image/emf'
				},

				{
					marker: '\\wmetafile8',
					type: 'image/wmf'
				},

				{
					marker: '\\hublabubla',
					type: 'unknown'
				}
			];

		return CKEDITOR.tools.array.reduce( fixtures, function( tests, fixture ) {
			var test = {};

			test[ 'getImageType for ' + fixture.type ] = function() {
				var picture = pictureContent.replace( /\{MARKER\}/g, fixture.marker ),
					type = CKEDITOR.pasteFilters.image.getImageType( picture );

				assert.areSame( fixture.type, type, 'extracted image type' );
			};

			return CKEDITOR.tools.object.merge( tests, test );
		}, {} );
	}

	function cacheBuster() {
		return ( new Date() ).getTime().toString() + Math.floor( Math.random() * 1000000 ).toString();
	}
} )();
