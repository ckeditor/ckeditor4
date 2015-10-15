/* bender-tags: editor, 13798 */

( function() {
	'use strict';

	var BACKSPACE = 8;

	bender.editor = {
		config: {
		}
	};

	function fireKey( editor, key ) {
		editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
			keyCode: key,
			ctrlKey: false,
			shiftKey: false
		} ) );
	}

	bender.test( {
		'setUp': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();
		},

		'test caret position after pressing BACKSPACE between blocks': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( editor, '<h1>Head</h1><p>[]ing</p>' );

			fireKey( editor, BACKSPACE );

			assert.isInnerHtmlMatching(
				'<h1>Head^ing@</h1>',
				bender.tools.selection.getWithHtml( editor ),
				{ compareSelection: true, normalizeSelection: true }
			);
		}
	} );
} )();
