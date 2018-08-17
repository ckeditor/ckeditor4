/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test CKEDITOR.lang.load': function() {
			assert.areSame( undefined, CKEDITOR.lang.en, 'CKEDITOR.lang.en already inited' );

			var callbackCalledTimes = 0,
				callback = function( langCode, langDictionary ) {
					callbackCalledTimes++;

					// Note that this operation will be async, so we need to do
					// assertions in resume.
					resume( function() {
						assert.areSame( 1, callbackCalledTimes, 'Callback calls count' );
						assert.areEqual( 'en', langCode, 'Language code in callback' );
						assert.areSame( CKEDITOR.lang.en, langDictionary, 'langDictionary in callback' );
						assert.areEqual( 'ltr', CKEDITOR.lang.en.dir, 'lang.en.dir' );
					} );
				};

			CKEDITOR.lang.load( 'en', 'en', callback );
			wait();
		},

		'test predefined language dir recognition': function() {
			// Mock loaded language.
			CKEDITOR.lang.ar = { foo: 'bar' };

			var	callbackCalledTimes = 0,
				callback = function( langCode, langDictionary ) {
					callbackCalledTimes++;

					resume( function() {
						assert.areSame( 1, callbackCalledTimes, 'Callback calls count' );
						assert.areEqual( 'ar', langCode, 'Language code in callback' );
						assert.areSame( CKEDITOR.lang.ar, langDictionary, 'langDictionary in callback' );
						assert.areEqual( 'rtl', CKEDITOR.lang.ar.dir, 'lang.ar.dir' );
					} );
				};

			CKEDITOR.lang.load( 'ar', 'ar', callback );
			wait();
		}
	} );
} )();
