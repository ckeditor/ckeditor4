/* bender-tags: editor, clipboard, 13872 */
/* bender-ckeditor-plugins: toolbar, clipboard */

'use strict';

bender.editors = {
	classic: {
		config: {
			readOnly: true
		}
	},
	inline: {
		creator: 'inline',
		config: {
			readOnly: true
		}
	}
};

var tests = {
	'test if cut is prevented in read-only editor': function( editor, bot ) {
		var content = '<p>[Some] text</p>';

		bot.setHtmlWithSelection( content );

		editor.editable().fire( 'cut', new CKEDITOR.dom.event( {} ) );

		assert.areSame( content, bot.htmlWithSelection() );
	}
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

bender.test( tests );
