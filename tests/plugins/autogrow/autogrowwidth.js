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

			var html = '';
			for ( var i = 0; i < 6; i++ ) {
				html += '<p>test ' + i + '</p>';
			}

			bot.setData( html, function() {
				setTimeout( function() {
					resume( function() {
						var width = parseInt( editor.editable().getComputedStyle( 'width' ), 10 );
						assert.isTrue( width > 0, true );
					} );
				}, 1000 );
				wait();
			} );
		}
	} );
} )();
