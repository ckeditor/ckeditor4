/* bender-tags: editor, autogrow */
/* bender-ckeditor-plugins: autogrow */

( function() {
	'use strict';

	bender.editors = {
		editor: {},
		borderless: {}
	};

	bender.test( {
		init: function() {
			// Remove border for borderless editor.
			var borderlessEditor = CKEDITOR.document.getById( 'cke_borderless' );
			borderlessEditor.setStyle( 'border', 'none' );
		},

		'test autogrow': function() {
			var editor = this.editors.editor,
				bot = this.editorBots.editor;

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

						assert.isTrue( editorHeight > initialEditorHeight, 'editor height should increase' );
						assert.areEqual( editorWidth, initialEditorWidth, 'editor width does not change' );
					} );
				} );

				editor.execCommand( 'autogrow' );
				wait();
			} );
		},

		// #4286
		'test borderless editor width': function() {
			var editor = this.editors.borderless,
				bot = this.editorBots.borderless;

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

						assert.isTrue( editorHeight > initialEditorHeight, 'editor height should increase' );
						assert.isTrue( editorWidth > 0, 'editor width should be greater than zero' );
						assert.areEqual( editorWidth, initialEditorWidth, 'editor width does not change' );
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
