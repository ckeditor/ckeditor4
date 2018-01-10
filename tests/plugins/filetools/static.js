/* bender-tags: editor,clipboard,filetools */
/* bender-ckeditor-plugins: filetools,clipboard */

( function() {
	'use strict';

	bender.test( {
		'test fileTools.isFileUploadSupported': function() {
			assert.areSame( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ? false : true, CKEDITOR.fileTools.isFileUploadSupported );
		}
	} );
} )();
