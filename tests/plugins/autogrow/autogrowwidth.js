/* bender-tags: editor, autogrow */
/* bender-ckeditor-plugins: autogrow */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		init: function() {
			// Remove root editor element border.
			var editorRootElement = CKEDITOR.document.getById( 'cke_test_editor' );
			editorRootElement.setStyle( 'border', 'none' );
		},

		// #4286
		'test editor width': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var html = '',
				initialEditorWidth = getEditorSize( editor ).width,
				initialEditorHeight = getEditorSize( editor ).height;

			for ( var i = 0; i < 6; i++ ) {
				html += '<p>test ' + i + '</p>';
			}

			bot.setData( html, function() {
				editor.once( 'afterCommandExec', function() {
					resume( function() {
						var editorWidth = getEditorSize( editor ).width,
							editorHeight = getEditorSize( editor ).height;

						assert.isTrue( editorHeight > initialEditorHeight, true, 'is editor height bigger than initial editor height' );
						assert.isTrue( editorWidth > 0, true, 'is editor width greater than zero' );
						assert.areEqual( editorWidth, initialEditorWidth, 'does width of editor changes' );
					} );
				} );

				editor.execCommand( 'autogrow' );
				wait();
			} );
		}
	} );

	function getEditorSize( editor ) {
		return {
			width: parseInt( editor.editable().getComputedStyle( 'width' ), 10 ),
			height: parseInt( editor.editable().getComputedStyle( 'height' ), 10 )
		}
	}
} )();
