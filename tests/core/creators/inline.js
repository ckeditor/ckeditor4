/* bender-tags: editor */

bender.editor = {
	creator: 'inline'
};

'use strict';

bender.test( {
	'test initial properties': function() {
		var editor = this.editor;

		assert.areSame( editor.name, editor.container.getId() );
		assert.areSame( editor.name, editor.ui.contentsElement.getId() );
	},

	// (#3866)
	'test forcing editable mode': function() {
		CKEDITOR.inline( 'readOnly', {
			readOnly: false,
			on: {
				instanceReady: function( evt ) {
					resume( function() {
						assert.isFalse( evt.editor.readOnly, 'Editor is in read-only mode' );
					} );
				}
			}
		} );
		wait();
	}
} );
