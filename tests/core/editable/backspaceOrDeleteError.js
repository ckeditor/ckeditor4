/* bender-tags: editor,unit*/
/* bender-ckeditor-plugins: wysiwygarea */

'use strict';
bender.editor = {
	name: 'editor'
};

// #13096
bender.test( {
    'test deleting text without selection': function() {
		this.editor.getSelection().removeAllRanges();
		this.editor.fire( 'key', {
			domEvent: {
				getKey: function() {
					return 8;
				}
			}
		} );
		assert.pass('Error is not thrown');
    }
 } );
