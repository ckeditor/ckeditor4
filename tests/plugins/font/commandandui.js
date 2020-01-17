/* bender-ckeditor-plugins: font,toolbar,wysiwygarea */
/* bender-tags: font, command, 3728 */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test font ui should react on command changes': function() {
			var editor = this.editor,
				combo = editor.ui.get( 'Font' ),
				command = editor.getCommand( 'font' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, command.state, 'Start command state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, combo.getState(), 'Start combo state' );

			command.disable();

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, command.state, 'Disabled command state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, combo.getState(), 'Combo state for disabled command' );

			command.setState( CKEDITOR.TRISTATE_ON );

			assert.areSame( CKEDITOR.TRISTATE_ON, command.state, 'Turned on command state' );
			assert.areSame( CKEDITOR.TRISTATE_ON, combo.getState(), 'Combo state for turned on command' );

			command.setState( CKEDITOR.TRISTATE_OFF );
		},

		'test font size ui should react on command changes': function() {
			var editor = this.editor,
				combo = editor.ui.get( 'FontSize' ),
				command = editor.getCommand( 'fontSize' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, command.state, 'Start command state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, combo.getState(), 'Start combo state' );

			command.disable();

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, command.state, 'Disabled command state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, combo.getState(), 'Combo state for disabled command' );

			command.setState( CKEDITOR.TRISTATE_ON );

			assert.areSame( CKEDITOR.TRISTATE_ON, command.state, 'Turned on command state' );
			assert.areSame( CKEDITOR.TRISTATE_ON, combo.getState(), 'Combo state for turned on command' );

			command.setState( CKEDITOR.TRISTATE_OFF );
		},

		'test font and font size should adjust to read only mode': function() {
			var editor = this.editor,
				fontCombo = editor.ui.get( 'Font' ),
				fontCommand = editor.getCommand( 'font' ),
				fontSizeCombo = editor.ui.get( 'FontSize' ),
				fontSizeCommand = editor.getCommand( 'fontSize' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, fontCommand.state, 'Start font command state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, fontSizeCommand.state, 'Start fontSize command state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, fontCombo.getState(), 'Start font combo state' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, fontSizeCombo.getState(), 'Start fontSize combo state' );

			editor.setReadOnly();

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, fontCommand.state, 'Start font command state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, fontSizeCommand.state, 'Start fontSize command state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, fontCombo.getState(), 'Start font combo state' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, fontSizeCombo.getState(), 'Start fontSize combo state' );

			editor.setReadOnly( false );
		}
	} );
} )();
