/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji */
/* bender-include: _helpers/tools.js */
/* global emojiTools */

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
			if ( emojiTools.notSupportedEnvironment ) {
				assert.ignore();
			}
		},
		'test emoji does not throw error without toolbar plugin': function() {
			assert.pass();
		}
	} );
} )();
