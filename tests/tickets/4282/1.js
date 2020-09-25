/* bender-tags: editor */
/* global testLoadVar1, testLoadVar2, testLoadVar3 */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test second load check': function() {
			var tc = this;

			// Make sure test vars are not loaded.
			assert.areSame( undefined, window.testLoadVar1, 'Test var 1 is initially undefined.' );
			assert.areSame( undefined, window.testLoadVar2, 'Test var 2 is initially undefined.' );
			assert.areSame( undefined, window.testLoadVar3, 'Test var 3 is initially undefined.' );

			var scriptsToLoad = [
				'_assets/a1.js',
				'_assets/a2.js',
				'_assets/a3.js'
			];

			var secondCallback = function( success ) {
				tc.resume( function() {
					assert.areSame( 'A1', testLoadVar1, 'Script 1 has been loaded.' );
					assert.areSame( 'A2', testLoadVar2, 'Script 2 has been loaded.' );
					assert.areSame( 'A3', testLoadVar3, 'Script 3 has been loaded.' );

					arrayAssert.itemsAreSame( scriptsToLoad, success, 'All scripts loaded.' );
				} );
			};

			var firstCallback = function() {
				CKEDITOR.scriptLoader.load( scriptsToLoad, secondCallback );
			};

			CKEDITOR.scriptLoader.load( scriptsToLoad, firstCallback );

			this.wait();
		}
	} );
} )();
