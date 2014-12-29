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

	'test sample': function() {
		assert.areSame( 'foo', this.editor.name, 'Test works.' );
	}
} );