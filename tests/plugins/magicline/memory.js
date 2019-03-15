/* bender-tags: editor,magicline */
/* bender-ckeditor-plugins: magicline */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#589)
		'test magicline backdoor reference is removed after editor.destroy': function() {
			var editor = this.editor;

			editor.destroy();

			assert.isUndefined( CKEDITOR.plugins.registered.magicline.backdoor );
		}
	} );
} )();
