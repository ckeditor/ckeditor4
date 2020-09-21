/* bender-tags: editor */
/* global testLoadVar1, testLoadVar2, testLoadVar3 */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test second load check': function() {
			var tc = this;

			var scriptsToLoad = [
				'_assets/a1.js',
				'_assets/a2.js',
				'_assets/a3.js'
			];
			var callBackFuncSecond = function(success) {
				tc.resume( function() {
					assert.areSame( 'A1', testLoadVar1, 'Script has been loaded.' );
					assert.areSame( 'A2', testLoadVar2, 'Script has been loaded.' );
					assert.areSame( 'A3', testLoadVar3, 'Script has been loaded.' );

					arrayAssert.itemsAreSame( scriptsToLoad, success, 'Scripts loaded in queue order.' );
				} );
			};
			var callBackFuncFirst = function() {
				CKEDITOR.scriptLoader.load(scriptsToLoad, callBackFuncSecond);
			};
			CKEDITOR.scriptLoader.load(scriptsToLoad, callBackFuncFirst);

			this.wait();
		}
	} );
} )();
