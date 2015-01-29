/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard,pastetext */

( function() {
	'use strict';

	bender.editors = {
		editorPlain: {
			name: 'editorPlain',
			config: {
				pasteFilter: 'plain-text',
				allowedContent: true
			}
		},

		editorSemantic: {
			name: 'editorSemantic',
			config: {
				pasteFilter: 'semantic-content',
				allowedContent: true
			}
		},

		editorCustom: {
			name: 'editorCustom',
			config: {
				pasteFilter: 'p h1 h2 span',
				allowedContent: true
			}
		},

		editorSemanticPAPT: {
			name: 'editorSemanticPAPT',
			config: {
				pasteFilter: 'semantic-content',
				forcePasteAsPlainText: true,
				allowedContent: true
			}
		}
	};

	var contents = {
		listWithSpan: '<ul><li>he<span>fkdjfkdj</span>llo</li><li>moto</li></ul>',
		various: '<div><h1>Header 1</h1><h3>Header <span>3</span></h3><p>Heeey</p></div>'
	};

	bender.test( {
		setUp: function() {
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();
		},

		'test plain': function() {
			var bot = this.editorBots.editorPlain,
				editor = bot.editor;

			editor.execCommand( 'paste', contents.listWithSpan );

			assert.areSame( '<p>hefkdjfkdjllo</p><p>moto</p>', editor.getData() );
		},

		'test semantic': function() {
			var bot = this.editorBots.editorSemantic,
				editor = bot.editor;

			editor.execCommand( 'paste', contents.listWithSpan );
			assert.areSame( '<ul><li>hefkdjfkdjllo</li><li>moto</li></ul>', editor.getData() );
		},

		'test custom': function() {
			var bot = this.editorBots.editorCustom,
				editor = bot.editor;

			editor.execCommand( 'paste', contents.various );
			assert.areSame( '<h1>Header 1</h1><p>Header <span>3</span></p><p>Heeey</p>', editor.getData() );
		},

		'test semantic papt': function() {
			var bot = this.editorBots.editorSemanticPAPT,
				editor = bot.editor;

			editor.execCommand( 'paste', contents.various );
			assert.areSame( '<p>Header 1</p><p>Header 3</p><p>Heeey</p>', editor.getData() );
		}
	} );
}() );
