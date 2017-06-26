/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: a11yhelp,dialog*/

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		_registerCommand: function( commandName, commandDefinition, keystroke ) {
			var editor = this.editor;

			if ( !commandDefinition ) {
				commandDefinition = {
					exec: function() {},
					label: 'Test Label.'
				};
			}

			if ( !keystroke ) {
				keystroke = CKEDITOR.ALT + 65; // Alt + A
			}

			if ( !editor.getCommand( commandName ) ) {
				editor.addCommand( commandName, commandDefinition );
				editor.setKeystroke( keystroke, commandName );
			}
		},

		'test representKeystroke': function() {
			var editor = this.editor;
			assert.areSame( '<kbd><kbd>Alt</kbd>+<kbd>0</kbd></kbd>', CKEDITOR.plugins.a11yhelp.representKeystroke( editor, CKEDITOR.ALT + 48 ) );
		},

		'test keystrokeEntry event': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.on( 'keystrokeEntry', function() {
				assert.pass();
			} );

			this._registerCommand( 'customCommand' );
			bot.dialog( 'a11yHelp', function( dialog ) {
				dialog.hide();
			} );
		},

		'test visible label': function() {
			var bot = this.editorBot;

			this._registerCommand( 'customCommand' );

			bot.dialog( 'a11yHelp', function( dialog ) {
				var dialogHtml = dialog.definition.contents[0].elements[0].html;
				assert.isTrue( dialogHtml.indexOf( '<tr><td>Test Label.</td><td><kbd><kbd>Alt</kbd>+<kbd>A</kbd></kbd></td></tr>' ) !== -1 );
				dialog.hide();
			} );
		},

		'test visible description': function() {
			var editor = this.editor,
				bot = this.editorBot,
				commandDefinition = {
					exec: function() {},
					label: 'Another Command',
					description: 'Additional info.'
				},
				keystroke = CKEDITOR.SHIFT + 65; // Shift + A

			this._registerCommand( 'anotherCommand', commandDefinition, keystroke );
			editor.on( 'keystrokeEntry', function( evt ) {
				evt.data.label = 'Modified Command Label';
			} );
			bot.dialog( 'a11yHelp', function( ) {} );
		}

	} );
} )();
