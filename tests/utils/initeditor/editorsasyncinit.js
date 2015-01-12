/* bender-tags: editor,unit,utils */

'use strict';

bender.editors = {
	framed: {
		name: 'framed'
	},
	inline: {
		name: 'inline',
		creator: 'inline'
	}
};

bender.test( {
	'async:init': function() {
		assert.areSame( 2, CKEDITOR.tools.objectKeys( bender.editors ).length );
		this.callback();
	},

	'test': function() {
		assert.areSame( 2, CKEDITOR.tools.objectKeys( this.editors ).length, 'this.editors' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( this.editorBots ).length, 'this.editorBots' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( bender.editors ).length, 'bender.editors' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( bender.editorBots ).length, 'bender.editorBots' );
		assert.areSame( 'framed', bender.editors.framed.name );
		assert.areSame( 'inline', bender.editors.inline.name );
	}
} );