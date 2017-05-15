/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, pastetext */

( function() {
	'use strict';

	// Safari does not use CTRL + SHIFT + 86 as paste as plain text. It uses
	// CTRL + SHIFT + ALT + 86 so there is no conflict between copyformatting and pastetext plugins.
	var defaultKeystrokeCommand = CKEDITOR.env.safari ? undefined : 'pastetext',
		defaultKeystroke = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86, // CTRL + SHIFT + V
		customKeystroke = CKEDITOR.CTRL + CKEDITOR.SHIFT + 77; // CTRL + SHIFT + M

	bender.editors = {
		editor1: {
			name: 'editor1',
			config: {
				allowedContent: true
			}
		},
		editor2: {
			name: 'editor2',
			config: {
				allowedContent: true,
				copyFormatting_keystrokePaste: customKeystroke
			}
		}

	};

	bender.test( {
		'test default paste keystroke set on editor init': function() {
			assert.areEqual( defaultKeystrokeCommand, this.editors.editor1.keystrokeHandler.keystrokes[ defaultKeystroke ] );
		},

		'test copy keystroke set on editor init': function() {
			assert.areEqual( 'copyFormatting', this.editors.editor1.keystrokeHandler.keystrokes[ CKEDITOR.config.copyFormatting_keystrokeCopy ] );
		},

		'test keystroke detached when copied format canceled (normal)': function() {
			var editor = this.editors.editor1;

			bender.tools.selection.setWithHtml( editor, '<p>Copy <em>for{}mat</em></p>' );

			editor.execCommand( 'copyFormatting' );

			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );

			editor.execCommand( 'copyFormatting' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
		},

		'test keystroke detached when copied format canceled (sticky)': function() {
			var editor = this.editors.editor1;

			bender.tools.selection.setWithHtml( editor, '<p>Copy <em>for{}mat</em></p>' );

			editor.execCommand( 'copyFormatting', { sticky: true } );

			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );

			editor.execCommand( 'copyFormatting' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
		},

		'test keystroke attached on format copy (normal) and detached on format apply': function() {
			var editor = this.editors.editor1;

			bender.tools.selection.setWithHtml( editor, '<p>Copy <em>for{}mat</em></p>' );

			editor.execCommand( 'copyFormatting' );

			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );

			editor.execCommand( 'applyFormatting' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
		},

		'test keystroke attached on format copy (sticky) and not detached on format apply': function() {
			var editor = this.editors.editor1;

			bender.tools.selection.setWithHtml( editor, '<p>Copy <em>for{}mat</em></p>' );

			editor.execCommand( 'copyFormatting', { sticky: true } );

			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );

			editor.execCommand( 'applyFormatting' );

			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
		},

		'test keystroke attached on format copy (normal) and detached on format apply with custom keystroke': function() {
			var editor = this.editors.editor2;

			bender.tools.selection.setWithHtml( editor, '<p>Copy <em>for{}mat</em></p>' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );

			editor.execCommand( 'copyFormatting' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
			assert.areEqual( 'applyFormatting', editor.keystrokeHandler.keystrokes[ customKeystroke ] );

			editor.execCommand( 'applyFormatting' );

			assert.areEqual( defaultKeystrokeCommand, editor.keystrokeHandler.keystrokes[ defaultKeystroke ] );
			assert.areEqual( undefined, editor.keystrokeHandler.keystrokes[ customKeystroke ] );
		}
	} );
}() );
