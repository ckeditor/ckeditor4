/* bender-tags: editor,unit,utils */

'use strict';

bender.editors = {
	framed: {},
	inline: {
		creator: 'inline'
	}
};

bender.test( {
	'test': function() {
		assert.areSame( 2, CKEDITOR.tools.objectKeys( this.editors ).length, 'this.editors' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( this.editorBots ).length, 'this.editorBots' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( bender.editors ).length, 'bender.editors' );
		assert.areSame( 2, CKEDITOR.tools.objectKeys( bender.editorBots ).length, 'bender.editorBots' );
		assert.areSame( 'framed', bender.editors.framed.name );
		assert.areSame( 'inline', bender.editors.inline.name );
	}
} );