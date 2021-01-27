/* bender-ckeditor-plugins: pastefromword,image,undo */
/* bender-include: _helpers/blob.js */
/* global blobHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			extraPlugins: 'divarea'
		},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test replace blobUrl in PFW content to base64': function( editor ) {
			blobHelpers.simulatePasteBlob( editor, function( input, expected ) {
				assert.beautified.html( expected, editor.getData() );
			} );
		},

		'test replace multiple blobUrl in PFW content to base64': function( editor, bot ) {
			bot.setData( '', function() {
				blobHelpers.simulatePasteBlob( editor, function( input, expected ) {
					assert.beautified.html( expected, editor.getData() );
				}, {
					template: '<p{%CLASS%}><img style="height:200px; width:200px" src="{%URL%}" /><img style="height:200px; width:200px" src="{%URL%}" /></p>'
				} );
			} );
		},

		'test undo manager state after pasting image from Word': function( editor, bot ) {
			bot.setData( '', function() {
				editor.resetUndo();

				blobHelpers.simulatePasteBlob( editor, function() {
					assert.isTrue( editor.undoManager.hasUndo, 'Undo step is created' );
				} );
			} );
		},

		'test throwing error when the file type is not recognised': function( editor ) {
			var spy = sinon.spy( CKEDITOR, 'error' );

			blobHelpers.simulatePasteBlob( editor, function() {
				var spyCall = spy.getCall( 0 ),
					expectedSpyArguments = [
						'pastetools-unsupported-image',
						{
							type: 'blob',
							index: 0
						}
					];

				spy.restore();

				assert.areSame( 1, spy.callCount, 'errors raised' );
				objectAssert.areDeepEqual( expectedSpyArguments, spyCall.args );
			}, {
				image: new ArrayBuffer(),
				type: 'image/whatever'
			} );
		}
	};

	tests = CKEDITOR.tools.extend( tests, generateTestsForFixtures() );
	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	blobHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );

	function generateTestsForFixtures() {
		var testsFilesNames = [
				'comandeer.jpg',
				'ckeditor.png',
				'ckeditor.gif'
			];

		return CKEDITOR.tools.array.reduce( testsFilesNames, function( tests, test ) {
			tests[ 'test extract image from blob (' + test + ')' ] = generateTest( test );

			return tests;
		}, {} );

		function generateTest( name ) {
			return function( editor, bot ) {
				CKEDITOR.ajax.load( './_fixtures/blob/' + name + '?' + cacheBuster(), function( image ) {
					CKEDITOR.ajax.load( './_fixtures/blob/' + name + '.txt?' + cacheBuster(), function( txt ) {
						var dataUrl = CKEDITOR.tools.trim( txt );

						resume( function() {
							bot.setData( '', function() {
								blobHelpers.simulatePasteBlob( editor, function( input, expected ) {
									assert.beautified.html( expected, editor.getData() );
								}, {
									image: image,
									imageType: getImageTypeFromExtension( name ),
									imageDataUrl: dataUrl
								} );
							} );
						} );
					} );
				}, 'arraybuffer' );
				wait();
			};
		}

		function cacheBuster() {
			return ( new Date() ).getTime().toString() + Math.floor( Math.random() * 1000000 ).toString();
		}

		function getImageTypeFromExtension( fileName ) {
			var nameParts = fileName.split( '.' ),
				extension = nameParts.pop();

			if ( extension === 'jpg' ) {
				extension = 'jpeg';
			}

			return 'image/' + extension;
		}
	}
} )();
