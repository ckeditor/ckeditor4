/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: undo,image */
/* bender-include: _helpers/tools.js */
/* global undoEventDispatchTestsTools */

( function() {
	'use strict';

	bender.editor = true;

	var keyCodesEnum, // keyCodesEnum will be inited in first setUp call.
		tcs = {
			setUp: function() {
				// Inits tools used to mimic events if needed.
				if ( !this.tools ) {
					this.tools = undoEventDispatchTestsTools( this );
					// Alias for more convenient accesss.
					this.keyTools = this.tools.key;
					keyCodesEnum = this.keyTools.keyCodesEnum;
				}

				this.undoManager = this.editor.undoManager;

				// For each TC we want to reset undoManager.
				this.editor.resetUndo();
			},

			// (#12327)
			'test image deletion': function() {
				bender.tools.selection.setWithHtml( this.editor, '<p>[<img src="%BASE_PATH%_assets/img.gif" />]Apollo 11</p>' );
				this.keyTools.keyEvent( keyCodesEnum.BACKSPACE, null, true );
				// TC should not cause any exception.
				assert.isTrue( true );
			}
		};

	bender.test( tcs );
} )();