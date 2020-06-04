/* bender-tags: colorbuttons */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */
/* bender-ui: collapsed */

( function() {
	'use strict';

	bender.editor = {
		name: 'classic',
		config: {
			removeButtons: 'TextColor,BGColor',
			allowedContent: true
		}
	};

	bender.test( {
		'test should not throw error when buttons are not present in the toolbar': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><span style="color:#ffffff"><span style="background-color:#c0392b">[foo]</span></span></p>' );

			// There should be no error after selection change, which triggers editor.attachStyleStateChange()
			bot.fireSelectionChange();

			// There should be no registered ui element.
			assert.isUndefined( editor.ui.get( 'TextColor' ) );
			assert.isUndefined( editor.ui.get( 'BGColor' ) );
		}
	} );
} )();
