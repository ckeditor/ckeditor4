/* bender-tags: editor,pastefromwordimage */
/* bender-ckeditor-plugins: pastefromwordimage */
/* bender-include: _lib/helpers-fixtures.js */
/* global fixtures */

( function() {
	'use strict';

	bender.test( {
		'test image to process': function() {
			var item,
				i,
				length,
				test,
				result;

			test = [
				{
					dataValue: '<p><img src="http://example-picture.com/random.png" /></p>',
					result: [
						[ '<img src="http://example-picture.com/random.png', 'http://example-picture.com/random.png' ]
					]
				},
				{
					dataValue: '<p><img class="border" width="400" height="300" data-custom="something" src="http://example-picture.com/random.png?parameter=2" /></p>',
					result: [
						[ '<img class="border" width="400" height="300" data-custom="something" src="http://example-picture.com/random.png?parameter=2',
							'http://example-picture.com/random.png?parameter=2' ]
					]
				},
				{
					dataValue: '<p><img src="file://Some/Path/To/Local/Resources/kitty.jpeg" class="invisible" /></p>',
					result: [
						[ '<img src="file://Some/Path/To/Local/Resources/kitty.jpeg', 'file://Some/Path/To/Local/Resources/kitty.jpeg' ]
					]
				},
				{
					dataValue: '<p><img class="one" src="//example.com/pic1.png" /></p><p>Hello world</p><p><img src="//example.com/pic2.gif" class="two" /></p>' +
						'<div><span class="something"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==" /></span></div>',
					result: [
						[ '<img class="one" src="//example.com/pic1.png', '//example.com/pic1.png' ],
						[ '<img src="//example.com/pic2.gif', '//example.com/pic2.gif' ],
						[ '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==',
							'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==' ]
					]
				},
				{
					dataValue: '<p>There is no img</p>',
					result: []
				}
			];

			while ( item = test.shift() ) {
				result = CKEDITOR.plugins.pastefromwordimage.imagesToProcess( item.dataValue );
				assert.areSame( item.result.length, result.length );
				for ( i = 0, length = result.length; i < length; i++ ) {
					assert.areSame( item.result[ i ][ 0 ], result[ i ][ 0 ] );
					assert.areSame( item.result[ i ][ 1 ], result[ i ][ 1 ] );
				}
			}
		},

		'test extract images from rtf': function() {
			var testCase,
				result,
				i,
				length;

			while ( testCase = fixtures.shift() ) {
				result = CKEDITOR.plugins.pastefromwordimage.extractImagesFromRtf( testCase.rtf );
				if ( result ) {
					for ( i = 0, length = result.length; i < length; i++ ) {
						assert.areSame( testCase.result[ i ].hex, result[ i ].hex );
						assert.areSame( testCase.result[ i ].type, result[ i ].type );
					}
				}
				// Test where no image is returned and both value should be undefiend.
				else {
					assert.areSame( testCase.result, result );
				}
			}
		}
	} );
} )();
