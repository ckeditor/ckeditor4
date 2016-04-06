/* bender-tags: editor, clipboard, 13872 */
/* bender-ckeditor-plugins: toolbar, clipboard */

'use strict';

bender.editors = {
	classic: {
		config: {
			readOnly: true
		}
	},
	classic_editable: {},
	inline: {
		creator: 'inline',
		config: {
			readOnly: true
		}
	},
	inline_editable: {
		creator: 'inline'
	}
};

var tests = {
	setUp: function() {
		// The native handling of copy/cut doesn't have such problems.
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		this.initPasteSpy = sinon.spy( CKEDITOR.plugins.clipboard, 'initPasteDataTransfer' );
	},

	tearDown: function() {
		this.initPasteSpy.restore();
	},

	'test if cut is prevented depending on read-only mode': function( editor, bot ) {
		var content = '<p>[Some t]ext</p>',
			expected = editor.readOnly ? content : '<p>^ext</p>';

		bot.setHtmlWithSelection( content );

		editor.editable().fire( 'cut', new CKEDITOR.dom.event( {} ) );

		assert.areSame( expected, bot.htmlWithSelection() );
		assert.areSame( !editor.readOnly, CKEDITOR.plugins.clipboard.initPasteDataTransfer.called, 'initPasteDataTransfer call' );
	},

	'test copy depending on read-only mode': function( editor, bot ) {
		bot.setHtmlWithSelection( '<p>[Some] text</p>' );

		editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );

		assert.areSame( true, CKEDITOR.plugins.clipboard.initPasteDataTransfer.called, 'initPasteDataTransfer call' );
	}
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

bender.test( tests );
