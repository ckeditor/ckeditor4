/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,editorplaceholder,toolbar,undo */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				editorplaceholder: 'Type your comment'
			}
		},

		divarea: {
			config: {
				extraPlugins: 'divarea',
				editorplaceholder: 'Type your comment'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				editorplaceholder: 'Type your comment'
			}
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'editorplaceholder' );
		},

		'test getting data from editor': function( editor ) {
			assert.areSame( '', editor.getData(), 'placeholder text is not part of editor data' );
		},

		'test placeholder present on editor initialisation': function( editor ) {
			assert.isTrue( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		},

		'test placeholder disappear on editor focus and reappears on blur': function( editor ) {
			var editable = editor.editable();

			editable.$.focus();

			setTimeout( function() {
				resume( function() {
					assert.isFalse( editable.hasAttribute( 'data-cke-editorplaceholder' ),
						'placeholder is hidden on focus' );

					CKEDITOR.document.getById( 'focus-trap' ).$.focus();

					setTimeout( function() {
						resume( function() {
							assert.isTrue( editable.hasAttribute( 'data-cke-editorplaceholder' ),
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
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tests[ 'test not applying placeholder if config.editorplaceholder is not set' ] = function() {
		bender.editorBot.create( {
			name: 'no_config'
		}, function( bot ) {
			var editor = bot.editor;

			assert.isFalse( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	tests[ 'test placeholder stays on change event if content is not changed' ] = function() {
		bender.editorBot.create( {
			name: 'change_event',
			config: {
				editorplaceholder: 'Some placeholder'
			}
		}, function( bot ) {
			var editor = bot.editor;

			editor.fire( 'change' );

			assert.isTrue( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	tests[ 'test placeholder disappears on change event if content is actually changed' ] = function() {
		bender.editorBot.create( {
			name: 'change_event2',
			config: {
				editorplaceholder: 'Some placeholder'
			}
		}, function( bot ) {
			var editor = bot.editor,
				editable = editor.editable();

			// setHtml is used to prevent unnecessary focusing of the editor
			// as focus can make the test false positive (it changes placeholder state).
			editable.setHtml( '<p>Test</p>' );
			editor.fire( 'change' );

			assert.isFalse( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	tests[ 'test placeholder works correctly in full-page editor' ] = function() {
		bender.editorBot.create( {
			name: 'fullpage',
			config: {
				editorplaceholder: 'Comandeer is a really good JS developer',
				fullPage: true
			}
		}, function( bot ) {
			var editor = bot.editor;

			assert.isTrue( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	// (#4249)
	tests[ 'test placeholder works correctly in full-page editor with htmlwriter and some content' ] = function() {
		bender.editorBot.create( {
			name: 'fullpageregex',
			config: {
				extraPlugins: 'htmlwriter',
				editorplaceholder: 'Comandeer is a really good JS developer',
				fullPage: true
			},
			startupData: '<p>Whatever</p>'
		}, function( bot ) {
			var editor = bot.editor;

			// If we are already here, it means that the issue is fixed – as regex didn't throw.
			assert.isFalse( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	// (#4249)
	tests[ 'test placeholder works correctly with RTL setting' ] = function() {
		bender.editorBot.create( {
			name: 'fullpageregexrtl',
			config: {
				contentsLangDirection: 'rtl',
				editorplaceholder: 'Comandeer is a really good JS developer',
				fullPage: true
			},
			startupData: ''
		}, function( bot ) {
			var editor = bot.editor;

			// If we are already here, it means that the issue is fixed – as regex didn't throw.
			assert.isTrue( editor.editable().hasAttribute( 'data-cke-editorplaceholder' ) );
		} );
	};

	tests[ 'test integration with easyimage' ] = function() {
		if ( CKEDITOR.env.ie || CKEDITOR.env.version < 11 ) {
			assert.ignore();
		}

		bender.editorBot.create( {
			config: {
				extraPlugins: 'easyimage',
				editorplaceholder: 'Some placeholder'
			},
			startupData: '<p><figure class="easyimage"><img src="/tests/_assets/lena.jpg" alt=""><figcaption>Lena</figcaption></figure>'
		}, function( bot ) {
			var editor = bot.editor;

			assert.areSame( 0, editor.editable().find( '[data-cke-caption-hidden]' ).count() );
		} );
	};

	bender.test( tests );
}() );
