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
			// Remove border for borderless editor (#4286).
			CKEDITOR.document.getById( 'cke_borderless' ).setStyle( 'border', 'none' );
		},

		// (#4286)
		'test autogrow with borderless editor': function() {
			if ( bender.env.ie && bender.env.version < 9 ) {
				assert.ignore();
			}

			var editor = this.editors.borderless,
				bot = this.editorBots.borderless,
				initialEditorSize = autogrowTools.getEditorSize( editor );

			bot.setData( autogrowTools.getTestContent( 8 ), function() {
				editor.once( 'afterCommandExec', function() {
					resume( function() {
						var editorSize = autogrowTools.getEditorSize( editor );

						assert.isTrue( editorSize.height > initialEditorSize.height, 'editor height should increase' );
						assert.isTrue( editorSize.width > 0, 'editor width should be greater than zero' );
						assert.areEqual( editorSize.width, initialEditorSize.width, 'editor width should not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );

				wait();
			} );
		}
	} );
} )();
