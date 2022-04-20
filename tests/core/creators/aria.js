/* bender-tags: editor */

( function() {
	'use strict';

	var labelWithSpecialCharacters = '"><!';

	bender.test( {
		'test labels (inline)': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'inline',
				config: {
					// They are needed for the floating toolbar to appear.
					plugins: 'floatingspace,toolbar',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					expectedApplicationLabel = createApplicationLabel( editor ),
					actualApplicationLabel = CKEDITOR.document.findOne( '#cke_inline_arialbl' ).getHtml(),
					expectedEditorLabel = createEditorLabel( editor ),
					actualEditorLabel = container.getAttribute( 'aria-label' );

				assert.areSame( expectedApplicationLabel, actualApplicationLabel, 'Application label is incorrect' );
				assert.areSame( expectedEditorLabel, actualEditorLabel, 'Editor label is incorrect' );
			} );
		},

		'test labels (divarea)': function() {
			bender.editorBot.create( {
				creator: 'replace',
				name: 'divarea',
				config: {
					plugins: 'divarea',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					expectedApplicationLabel = createApplicationLabel( editor ),
					actualApplicationLabel = container.findOne( '#cke_divarea_arialbl' ).getHtml(),
					expectedEditorLabel = createEditorLabel( editor ),
					actualEditorLabel = container.findOne( '.cke_editable' ).getAttribute( 'aria-label' );

				assert.areSame( expectedApplicationLabel, actualApplicationLabel, 'Application label is incorrect' );
				assert.areSame( expectedEditorLabel, actualEditorLabel, 'Editor label is incorrect' );
			} );
		},

		'test labels (wysiwygarea)': function() {
			bender.editorBot.create( {
				creator: 'replace',
				name: 'wysiwygarea',
				config: {
					plugins: 'wysiwygarea',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					frame = container.findOne( 'iframe' ),
					expectedApplicationLabel = createApplicationLabel( editor ),
					actualApplicationLabel = container.findOne( '#cke_wysiwygarea_arialbl' ).getHtml(),
					expectedEditorLabel = createEditorLabel( editor ),
					actualEditorLabel = frame.getAttribute( 'title' ),
					actualBodyLabel = frame.getFrameDocument().findOne( 'body' ).getAttribute( 'aria-label' );

				assert.areSame( expectedApplicationLabel, actualApplicationLabel, 'Application label is incorrect' );
				assert.areSame( expectedEditorLabel, actualEditorLabel, 'Editor label is incorrect' );
				assert.areSame( expectedEditorLabel, actualBodyLabel, 'Editor\'s body label is incorrect' );
			} );
		},

		'test label with special characters (inline)': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'inline-special',
				config: {
					title: labelWithSpecialCharacters,
					// They are needed for the floating toolbar to appear.
					plugins: 'floatingspace,toolbar',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					actualEditorLabel = container.getAttribute( 'aria-label' );

				assert.areSame( labelWithSpecialCharacters, actualEditorLabel, 'Editor label is incorrect' );
			} );
		},

		'test label with special characters (divarea)': function() {
			bender.editorBot.create( {
				creator: 'replace',
				name: 'divarea-special',
				config: {
					title: labelWithSpecialCharacters,
					plugins: 'divarea',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					actualEditorLabel = container.findOne( '.cke_editable' ).getAttribute( 'aria-label' );

				assert.areSame( labelWithSpecialCharacters, actualEditorLabel, 'Editor label is incorrect' );
			} );
		},

		'test label with special characters (wysiwygarea)': function() {
			bender.editorBot.create( {
				creator: 'replace',
				name: 'wysiwygarea-special',
				config: {
					title: labelWithSpecialCharacters,
					plugins: 'wysiwygarea',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					container = editor.container,
					frame = container.findOne( 'iframe' ),
					actualEditorLabel = frame.getAttribute( 'title' ),
					actualBodyLabel = frame.getFrameDocument().findOne( 'body' ).getAttribute( 'aria-label' );

				assert.areSame( labelWithSpecialCharacters, actualEditorLabel, 'Editor label is incorrect' );
				assert.areSame( labelWithSpecialCharacters, actualBodyLabel, 'Editor\'s body label is incorrect' );
			} );
		}
	} );

	function createApplicationLabel( editor ) {
		var lang = CKEDITOR.lang.en,
			applicationLabel = lang.application;

		return applicationLabel + ', ' + editor.name;
	}

	function createEditorLabel( editor ) {
		var lang = CKEDITOR.lang.en,
			editorLabel = lang.editor;

		return editorLabel + ', ' + editor.name;
	}
} )();
