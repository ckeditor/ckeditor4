/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard,pastetext */

( function() {
	'use strict';

	bender.editors = {
		editorNoConfiguration: {
			name: 'editorNoConfiguration',
			config: {
				allowedContent: true
			}
		},

		editorForcedPAPT: {
			name: 'editorForcedPAPT',
			config: {
				forcePasteAsPlainText: true
			}
		},

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
		},

		editorModifyInstance: {
			name: 'editorModifyInstance',
			config: {
				pasteFilter: 'h2',
				allowedContent: true
			}
		}
	};

	var contents = {
		listWithSpan: '<ul><li>he<span>fkdjfkdj</span>llo</li><li>moto</li></ul>',
		various: '<div><h1>Header 1</h1><h3>Header <span>3</span></h3><p>Heeey</p></div>',
		classyAndStylish: '<h1 contenteditable="true" class="ugly" style="background-color: red;">I am so classy and stylish :)</h1>'
	};

	var tests = {};

	tests.setUp = function() {
		CKEDITOR.plugins.clipboard.resetDragDataTransfer();
	};

	function curryCreateTest( tests ) {
		return function( testName, editorName, pastedContent, expectedContent ) {
			tests[ testName ] = function() {
				var bot = this.editorBots[ editorName ],
					editor = bot.editor;

				editor.setData( '', function() {
					resume( function() {
						editor.execCommand( 'paste', pastedContent );
						assert.areSame( expectedContent, editor.getData() );
					} );
				} );

				wait();
			};
		};
	}

	var createTest = curryCreateTest( tests );

	tests[ 'editor no configuration' ] = function() {
		var bot = this.editorBots.editorNoConfiguration;

		assert.isObject( bot.editor.pasteFilter );
	};

	tests[ 'editor defined pasteFilter if forcePAPT' ] = function() {
		var bot = this.editorBots.editorForcedPAPT,
			editor = bot.editor,
			pasteFilter = editor.pasteFilter;

		assert.isObject( pasteFilter );
	};

	tests[ 'exposed pasteFilter in editor' ] = function() {
		var bot = this.editorBots.editorPlain,
			editor = bot.editor,
			pasteFilter = editor.pasteFilter;

		assert.isObject( pasteFilter );
		assert.isInstanceOf( CKEDITOR.filter, pasteFilter );
	};

	tests[ 'exposed proper pasteFilter in editor' ] = function() {
		var bot = this.editorBots.editorPlain,
			editor = bot.editor,
			pasteFilter = editor.pasteFilter,
			allowedElements = pasteFilter.allowedContent[ 0 ].elements;

		assert.areSame( 1, Object.keys( allowedElements ).length, 'there is only one element' );
		assert.isTrue( allowedElements.br );
	};

	tests[ 'allow to modify pasteFilter in editor' ] = function() {
		var bot = this.editorBots.editorModifyInstance,
			editor = bot.editor,
			pasteFilter = editor.pasteFilter;

		editor.execCommand( 'paste', '<h2>Second head</h2>' );
		assert.areSame( '<h2>Second head</h2>', editor.getData() );

		pasteFilter.disallow( 'h2' );

		editor.setData( '', function() {
			resume( function() {
				editor.execCommand( 'paste', '<h2>Second head</h2>' );
				assert.areSame( '<p>Second head</p>', editor.getData() );
			} );
		} );

		wait();
	};

	createTest(
		'test plain', 'editorPlain', contents.listWithSpan,
		'<p>hefkdjfkdjllo</p><p>moto</p>'
	);

	createTest(
		'test semantic', 'editorSemantic', contents.listWithSpan,
		'<ul><li>hefkdjfkdjllo</li><li>moto</li></ul>'
	);

	createTest(
		'test custom', 'editorCustom', contents.various,
		'<h1>Header 1</h1><p>Header <span>3</span></p><p>Heeey</p>'
	);

	createTest(
		'test semantic papt', 'editorSemanticPAPT', contents.various,
		'<p>Header 1</p><p>Header 3</p><p>Heeey</p>'
	);

	createTest(
		'test semantic remove styles and classes', 'editorSemantic', contents.classyAndStylish,
		'<h1 contenteditable="true">I am so classy and stylish :)</h1>'
	);

	bender.test( tests );
}() );
