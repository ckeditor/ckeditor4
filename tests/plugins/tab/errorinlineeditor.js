/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,tab */
/* bender-ui: collapsed */

( function() {
	'use strict';

	bender.editor = {
		creator: 'inline'
	};

	// #424 - https://dev.ckeditor.com/ticket/17028
	bender.test( {
		'test tab in inline editor': function() {
			var editor = this.editor;

			editor.focus();
			editor.fire( 'key', {
				domEvent: {
					getKey: function() {
						return 9;
					}
				},
				keyCode: 9
			} );
			assert.pass();
		}
	} );
} )();
