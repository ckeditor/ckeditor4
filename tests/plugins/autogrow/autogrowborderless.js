/* bender-tags: editor, autogrow */
/* bender-ckeditor-plugins: autogrow */
/* bender-include: _helpers/tools.js */
/* global autogrowTools */

( function() {
	'use strict';

	bender.editors = {
		borderless: {}
	};

	bender.test( {
		init: function() {
			// Remove border for borderless editor.
			var borderlessEditor = CKEDITOR.document.getById( 'cke_borderless' );
			borderlessEditor.setStyle( 'border', 'none' );
		},

		// #4286
		'test autogrow with borderless editor': function() {
			if ( bender.env.ie && bender.env.version < 9 ) {
				assert.ignore();
			}

			var editor = this.editors.borderless,
				bot = this.editorBots.borderless;

			var html = '',
				initialEditorWidth = autogrowTools.getEditorSize( editor ).width,
				initialEditorHeight = autogrowTools.getEditorSize( editor ).height;

			for ( var i = 0; i < 6; i++ ) {
				html += '<p>test ' + i + '</p>';
			}

			bot.setData( html, function() {
				editor.once( 'afterCommandExec', function() {
					resume( function() {
						var editorWidth = autogrowTools.getEditorSize( editor ).width,
							editorHeight = autogrowTools.getEditorSize( editor ).height;

						assert.isTrue( editorHeight > initialEditorHeight, 'editor height should increase' );
						assert.isTrue( editorWidth > 0, 'editor width should be greater than zero' );
						assert.areEqual( initialEditorWidth, editorWidth, 'editor width should not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );
				wait();
			} );
		}
	} );
} )();
