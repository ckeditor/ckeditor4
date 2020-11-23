/* bender-tags: editor, autogrow */
/* bender-ckeditor-plugins: autogrow */
/* bender-include: _helpers/tools.js */
/* global autogrowTools */

( function() {
	'use strict';

	bender.editor = {};

	bender.createEditor = function( width, paragraphs ) {
		bender.editorBot.create( {
			name: 'EditorWidth' + width,
			config: {
				width: width
			}
		}, function(bot){
			bot.setData( autogrowTools.getTestContent( paragraphs ), function() {
				var editor = bot.editor;
				var initialEditorSize = autogrowTools.getEditorSize( editor );
				editor.once( 'afterCommandExec', function() {
					resume( function name( params ) {
						var editorSize = autogrowTools.getEditorSize( editor );

						assert.isTrue( editorSize.height > initialEditorSize.height, 'editor height should increase' );
						assert.areEqual( editorSize.width, initialEditorSize.width, 'editor width should not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );

				wait();
			} );
		} );
	};

	bender.test( {
		// (#4372)
		'test autogrow for editor width 200%': function() { bender.createEditor('200%', 6); },
		// (#4372)
		'test autogrow for editor width 20em': function() { bender.createEditor('20em', 6); },
		// (#4372)
		'test autogrow for editor width 200px': function() { bender.createEditor('200px', 6); },
		// (#4372)
		'test autogrow for editor width 200': function() { bender.createEditor(200, 6); },
		// (#4372)
		'test autogrow for editor width 0': function() { bender.createEditor(0, 6); },
		// (#4372)
		'test autogrow for editor width auto': function() { bender.createEditor('auto', 6); },
		// (#4286)
		'test autogrow': function() {
			if ( bender.env.ie && bender.env.version < 9 ) {
				assert.ignore();
			}

			var editor = this.editor,
				bot = this.editorBot,
				initialEditorSize = autogrowTools.getEditorSize( editor );

			bot.setData( autogrowTools.getTestContent( 8 ), function() {
				editor.once( 'afterCommandExec', function() {
					resume( function() {
						var editorSize = autogrowTools.getEditorSize( editor );

						assert.isTrue( editorSize.height > initialEditorSize.height, 'editor height should increase' );
						assert.areEqual( editorSize.width, initialEditorSize.width, 'editor width should not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );

				wait();
			} );
		}
	} );
} )();
