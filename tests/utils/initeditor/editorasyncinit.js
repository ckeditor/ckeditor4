/* bender-tags: editor,unit,utils */

'use strict';

bender.editor = {
	name: 'foo'
};

bender.test( {
	'async:init': function() {
		assert.areSame( 'foo', this.editor.name, 'Editor name.' );
		this.callback();
	},

	'test': function() {
		assert.areSame( 'foo', this.editor.name, 'this.editor' );
		assert.areSame( 'foo', this.editorBot.editor.name, 'this.editorBot' );
		assert.areSame( 'foo', bender.editor.name, 'bender.editor' );
	}
} );