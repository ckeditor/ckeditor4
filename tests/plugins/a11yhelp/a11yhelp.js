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

		_createEditor: function( config, fn ) {
			if ( bender.editor ) {
				bender.editor.destroy();
			}

			var tc = this;

			bender.editorBot.create( { config: config }, function( bot ) {
				bender.editor = tc.editor = bot.editor;
				tc.editorBot = bot;
				fn.call( tc );
			} );
		},


		'test representKeystroke': function() {
			this._createEditor( {}, function() {
				var editor = this.editor;
				assert.areSame( '<kbd><kbd>Alt</kbd>+<kbd>0</kbd></kbd>', CKEDITOR.plugins.a11yhelp.representKeystroke( editor, CKEDITOR.ALT + 48 ) );
			} );
		},

		'test visible label': function() {
			this._createEditor( {}, function() {
				var bot = this.editorBot;
				this._registerCommand( 'customCommand' );

				bot.dialog( 'a11yHelp', function( dialog ) {
					var dialogHtml = dialog.definition.contents[0].elements[0].html;
					assert.areNotSame( -1, dialogHtml.indexOf( '<tr><td>Test Label.</td><td><kbd><kbd>Alt</kbd>+<kbd>A</kbd></kbd></td></tr>' ) );
					dialog.hide();
				} );
			} );
		},

		'test visible key description': function() {
			this._createEditor( {}, function() {
				var editor = this.editor,
					bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keyDescription: 'Additional info.',
						getLabel: function() {
							return 'Modified label';
						}
					},
					keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );

				editor.once( 'dialogHide', function( evt ) {
					var dialogHtml = evt.data.definition.contents[0].elements[0].html; // evt.data === dialog
					assert.areNotSame( -1, dialogHtml.indexOf( '<tr><td>Modified label</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd><br />Additional info.</td></tr>' ) );
				} );

				bot.dialog( 'a11yHelp', function( dialog ) {
					dialog.hide();
				} );
			} );
		},

		'test visible key description (inline editor)': function() {
			this._createEditor( { creator: 'inline' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keyDescription: 'Additional info.',
						getLabel: function() {
							return 'Modified label';
						}
					},
				keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );


				editor.once( 'dialogHide', function( evt ) {
					var dialogHtml = evt.data.definition.contents[0].elements[0].html; // evt.data === dialog
					assert.areNotSame( -1, dialogHtml.indexOf( '<tr><td>Modified label</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd><br />Additional info.</td></tr>' ) );
				} );

				bot.dialog( 'a11yHelp', function( dialog ) {
					dialog.hide();
				} );
			} );
		},

		'test modified key description': function() {
			this._createEditor( {}, function() {
				var editor = this.editor,
					bot = this.editorBot,
					commandDefinition = {
						exec: function() {},
						label: 'Another Command',
						keyDescription: 'Additional info.',
						getKeyDescription: function() {
							return 'Modified key description';
						}
					},
				keystroke = CKEDITOR.SHIFT + 65; // Shift + A

				this._registerCommand( 'customCommand' );
				this._registerCommand( 'anotherCommand', commandDefinition, keystroke );


				editor.once( 'dialogHide', function( evt ) {
					var dialogHtml = evt.data.definition.contents[0].elements[0].html; // evt.data === dialog
					assert.areNotSame( -1, dialogHtml.indexOf( '<tr><td>Another Command</td><td><kbd><kbd>Shift</kbd>+<kbd>A</kbd></kbd><br />Modified key description</td></tr>' ) );
				} );

				bot.dialog( 'a11yHelp', function( dialog ) {
					dialog.hide();
				} );
			} );
		}

	} );
} )();
