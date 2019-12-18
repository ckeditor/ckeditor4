/* bender-tags: panelbutton, command */
/* bender-ckeditor-plugins: panelbutton,floatpanel,toolbar,wysiwygarea */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'testPlugin', {
		requires: 'panelbutton,floatpanel',
		init: function( editor ) {
			editor.addCommand( 'testCommand', {
				exec: function() {}
			} );

			editor.ui.add( 'testPanel', CKEDITOR.UI_PANELBUTTON, {
				command: 'testCommand',
				modes: { wysiwyg: 1 },
				panel: {
					attributes: {}
				}
			} );
		}
	} );

	bender.editor = {
		name: 'classic',
		config: {
			extraPlugins: 'testPlugin'
		}
	};

	bender.test( {
		'test panelbutton should have "ON" state when is opened': function() {
			var editor = this.editor,
				bot = this.editorBot,
				testPanel = editor.ui.get( 'testPanel' ),
				testCommand = editor.getCommand( 'testCommand' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, testCommand.state, '"testCommand" state should be OFF after initialization' );

			bot.panel( 'testPanel', function( panel ) {
				assert.areSame( CKEDITOR.TRISTATE_ON, testPanel.getState(), '"testPanel" state should be switched to ON when panel is beeing opened' );
				panel.hide();
			} );
		},

		'test closed panelbutton should have the same state as command': function() {
			var editor = this.editor,
				testPanel = editor.ui.get( 'testPanel' ),
				testCommand = editor.getCommand( 'testCommand' );

			testCommand.setState( CKEDITOR.TRISTATE_OFF );
			assert.areSame( CKEDITOR.TRISTATE_OFF, testPanel.getState(), 'Tristate OFF' );

			testCommand.setState( CKEDITOR.TRISTATE_ON );
			assert.areSame( CKEDITOR.TRISTATE_ON, testPanel.getState(), 'Tristate ON' );

			testCommand.setState( CKEDITOR.TRISTATE_DISABLED );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, testPanel.getState(), 'Tristate DISABLED' );
		},

		'test panelbutton should restore command state after panel hide': function() {
			var editor = this.editor,
				bot = this.editorBot,
				testPanel = editor.ui.get( 'testPanel' ),
				testCommand = editor.getCommand( 'testCommand' );

			testCommand.setState( CKEDITOR.TRISTATE_ON );

			bot.panel( 'testPanel', function( panel ) {
				panel.hide();

				assert.areSame( CKEDITOR.TRISTATE_ON, testPanel.getState(), '"testPanel" should have same state as command after closing it' );
			} );
		}
	} );
} )();
