/* bender-tags: editor,unit,utils */

'use strict';

bender.editor = {
	name: 'foo'
};

bender.test( {
	'init': function() {
		assert.areSame( 'foo', this.editor.name, 'Editor name.' );
	},

	'test sample': function() {
		assert.areSame( 'foo', this.editor.name, 'Test works.' );
	}
} );