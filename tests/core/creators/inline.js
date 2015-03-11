/* bender-tags: editor,unit */

bender.editor = {
	creator: 'inline'
};

'use strict';

bender.test( {
	'test initial properties': function() {
		var editor = this.editor;

		assert.areSame( editor.name, editor.container.getId() );
		assert.areSame( editor.name, editor.ui.contentsElement.getId() );
	}
} );