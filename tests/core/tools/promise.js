/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		// (#2962)
		'test promise initialization': function() {
			if ( window.Promise ) {
				assert.areSame( window.Promise, CKEDITOR.tools.promise, 'Native Promise should be enabled' );
			} else {
				assert.areSame( window.ES6Promise, CKEDITOR.tools.promise, 'Polyfill Promise should be enabled' );
			}
		}
	} );

} )();
