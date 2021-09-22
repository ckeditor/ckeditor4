/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,templates,format*/

( function() {
	'use strict';

	bender.test( {
		'test aborting template insertion': function() {
			bender.editorBot.create( {
				name: 'editor_abort_template',
				startupData: '<p>Lorem ipsum</p>',
				config: {
					templates_files: [ '/tests/plugins/templates/_assets/test.js' ],
					templates: 'test'
				}
			}, function( bot ) {
				bot.dialog( 'templates', function( dialog ) {
					dialog.getButton( 'cancel' ).click();

					assert.areEqual( '<p>^Lorem ipsum</p>', bot.htmlWithSelection(),
						'Editor data has not been altered.' );

				} );
			} );
		},

		'test insert template and replace content': function() {
			bender.editorBot.create( {
				name: 'editor_insert_and_replace',
				startupData: '<p>Lorem ipsum</p>',
				config: {
					templates_files: [ '/tests/plugins/templates/_assets/test.js' ],
					templates: 'test'
				}
			}, function( bot ) {
				bot.dialog( 'templates', function( dialog ) {
					dialog.getContentElement( 'selectTpl', 'chkInsertOpt' ).setValue( true );
					setTimeout( function() {
						dialog.getContentElement( 'selectTpl', 'templatesList' ).getElement().find( 'a' ).$[ 1 ].click();

						setTimeout( function() {
							resume( function() {
								assert.areEqual( '<p>^I am a text</p><p>Here is some more text</p>',
									bot.htmlWithSelection(), 'Editor data has been replaced by the template.' );
							} );
						}, 100 );
					}, 100 );
					wait();
				} );
			} );
		},

		'test insert template file and replace content': function() {
			bender.editorBot.create( {
				name: 'editor_insert_file_and_replace',
				startupData: '<p>Lorem ipsum</p>',
				config: {
					templates_files: [ '/tests/plugins/templates/_assets/test.js' ],
					templates: 'test'
				}
			}, function( bot ) {
				bot.dialog( 'templates', function( dialog ) {
					dialog.getContentElement( 'selectTpl', 'chkInsertOpt' ).setValue( true );

					setTimeout( function() {
						dialog.getContentElement( 'selectTpl', 'templatesList' ).getElement().findOne( 'a' ).$.click();

						setTimeout( function() {
							resume( function() {
								assert.areEqual( '<h1>^I am a title</h1><p>I am a text</p>', bot.htmlWithSelection(),
									'Editor data has been replaced by the template.' );
							} );
						}, 100 );
					}, 100 );
					wait();
				} );
			} );
		},

		'test insert template file at cursor position': function() {
			bender.editorBot.create( {
				name: 'editor_insert_file',
				startupData: '<p>Lorem ipsum</p>',
				config: {
					templates_files: [ '/tests/plugins/templates/_assets/test.js' ],
					templates: 'test'
				}
			}, function( bot ) {
				setCursorAtTheEnd( bot.editor );

				bot.dialog( 'templates', function( dialog ) {
					dialog.getContentElement( 'selectTpl', 'chkInsertOpt' ).setValue( false );

					setTimeout( function() {
						dialog.getContentElement( 'selectTpl', 'templatesList' ).getElement().findOne( 'a' ).$.click();

						setTimeout( function() {
							resume( function() {
								assert.areEqual( '<p>Lorem ipsum</p><h1>I am a title</h1><p>I am a text^</p>',
									bot.htmlWithSelection(), 'Template has been inserted.' );
							} );
						}, 100 );
					}, 100 );

					wait();
				} );
			} );
		},
		'test insert template at cursor position': function() {
			bender.editorBot.create( {
				name: 'editor_insert',
				startupData: '<p>Lorem ipsum</p>',
				config: {
					templates_files: [ '/tests/plugins/templates/_assets/test.js' ],
					templates: 'test'
				}
			}, function( bot ) {
				setCursorAtTheEnd( bot.editor );
				bot.dialog( 'templates', function( dialog ) {
					dialog.getContentElement( 'selectTpl', 'chkInsertOpt' ).setValue( false );

					setTimeout( function() {
						dialog.getContentElement( 'selectTpl', 'templatesList' ).getElement().find( 'a' ).$[ 1 ].click();

						setTimeout( function() {
							resume( function() {
								assert.areEqual( '<p>Lorem ipsum</p><p>I am a text</p><p>Here is some more text^</p>',
									bot.htmlWithSelection(), 'Template has been inserted.' );
							} );
						}, 100 );
					}, 100 );

					wait();
				} );
			} );
		}
	} );

	function setCursorAtTheEnd( editor ) {
		editor.focus();
		var range = editor.createRange();
		range.moveToElementEditEnd( editor.editable() );
		range.select();
	}
} )();
