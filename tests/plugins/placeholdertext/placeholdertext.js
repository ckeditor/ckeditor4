/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,placeholdertext,toolbar,undo */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				placeholdertext: 'Type your comment'
			}
		},

		divarea: {
			config: {
				extraPlugins: 'divarea',
				placeholdertext: 'Type your comment'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				placeholdertext: 'Type your comment'
			}
		}
	};

	var tests = {
		'test getting data from editor': function( editor ) {
			assert.areSame( '', editor.getData(), 'placeholder text is not part of editor data' );
		},

		'test placeholder present on editor initialisation': function( editor ) {
			assert.areSame( 1, editor.editable().find( '[data-cke-placeholdertext]' ).count() );
		},

		'test placeholder disappear on editor focus and reappears on blur': function( editor ) {
			editor.editable().$.focus();

			setTimeout( function() {
				resume( function() {
					assert.areSame( 0, editor.editable().find( '[data-cke-placeholdertext]' ).count(), 0,
						'placeholder is hidden on focus' );

					CKEDITOR.document.getById( 'focus-trap' ).$.focus();

					setTimeout( function() {
						resume( function() {
							assert.areSame( 1, editor.editable().find( '[data-cke-placeholdertext]' ).count(),
								'placeholder is visible on blur' );
						} );
					}, 300 );

					wait();
				} );
			}, 150 );

			wait();
		},

		'test placeholder does not generate an undo step': function( editor, bot ) {
			editor.resetUndo();

			editor.editable().$.focus();

			setTimeout( function() {
				resume( function() {
					bot.setData( 'whatever', function() {
						var snapshots = editor.undoManager.snapshots;

						// Safari sometimes generates one more snapshot, but with the same content.
						if ( CKEDITOR.env.safari && snapshots.length > 2 ) {
							assert.areSame( 3, snapshots.length );
							assert.isTrue( snapshots[ 0 ].equalsContent( snapshots[ 1 ] ) );
						} else {
							assert.areSame( 2, snapshots.length );
						}

					} );
				} );
			}, 150 );

			wait();
		},
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tests[ 'test if template is customisable' ] = function() {
		var oldTemplate = CKEDITOR.plugins.placeholdertext.template;

		CKEDITOR.plugins.placeholdertext.template = '<p class="hublabubla">Test</p>';

		bender.editorBot.create( {
			name: 'template_custom',
			config: {
				placeholdertext: 'Whatever'
			}
		}, function( bot ) {
			var editor = bot.editor;

			CKEDITOR.plugins.placeholdertext.template = oldTemplate;

			assert.areSame( 1, editor.editable().find( 'p.hublabubla' ).count() );
		} );
	};

	tests[ 'test not applying placeholder if config.placeholdertext is not set' ] = function() {
		bender.editorBot.create( {
			name: 'no_config'
		}, function( bot ) {
			var editor = bot.editor;

			assert.areSame( 0, editor.editable().find( '[data-cke-placeholdertext]' ).count() );
		} );
	};

	tests[ 'test integration with easyimage' ] = function() {
		if ( CKEDITOR.env.ie || CKEDITOR.env.version <= 11 ) {
			assert.ignore();
		}

		bender.editorBot.create( {
			config: {
				extraPlugins: 'easyimage',
				placeholdertext: 'Some placeholder'
			},
			startupData: '<p><figure class="easyimage"><img src="/tests/_assets/lena.jpg" alt=""><figcaption>Lena</figcaption></figure>'
		}, function( bot ) {
			var editor = bot.editor;

			assert.areSame( 0, editor.editable().find( '[data-cke-caption-hidden]' ).count() );
		} );
	};

	bender.test( tests );
}() );
