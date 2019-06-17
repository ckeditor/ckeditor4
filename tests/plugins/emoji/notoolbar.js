/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji */
/* bender-include: _helpers/tools.js */

( function() {
	'use strict';

	bender.editor = {
		config: {
			plugins: 'emoji',
			removePlugins: 'toolbar'
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'emoji' );
		},
		'test emoji does not throw error without toolbar plugin': function() {
			assert.pass();
		}
	} );
} )();
