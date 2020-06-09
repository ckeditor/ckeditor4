/* bender-tags: widgetcore, 3998 */
/* bender-ckeditor-plugins: wysiwygarea,sourcearea,widget */

( function() {
	'use strict';

	function pressCtrlEnter( editor ) {
		editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 13 } ) );
	}

	bender.editor = {
		config: {
			keystrokes: [
				[ CKEDITOR.CTRL + 13 /*Enter*/, 'source' ]
			]
		}
	};

	bender.test( {
		// (#3998)
		'test change wysiwyg mode to source mode by pressing keystroke': function() {
			var editor = this.editor;

			assert.areSame( 'wysiwyg', editor.mode, 'Wysiwyg mode is active at start.' );
			pressCtrlEnter( editor );
			assert.areSame( 'source', editor.mode, 'Source mode is active (changed from wysiwyg mode).' );
		},

		// (#3998)
		'test change source mode to wysiwyg mode by pressing keystroke': function() {
			var editor = this.editor;

			assert.areSame( 'source', editor.mode, 'Source mode is active at start.' );
			pressCtrlEnter( editor );
			wait( function() {
				assert.areSame( 'wysiwyg', editor.mode, 'Wysiwyg mode is active (changed from source mode).' );
			}, 100 );
		}
	} );
} )();
