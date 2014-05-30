/* bender-tags: editor,unit */

( function() {
	'use strict';

	var editors = {};

	CKEDITOR.disableAutoInline = true;
	CKEDITOR.config.plugins = 'basicstyles,toolbar';

	function setUpEditors() {
		var toDo = {
				framed: {
					name: 'framed'
				},
				framedStartReadOnly: {
					name: 'framedStartReadOnly',
					config: {
						readOnly: true
					}
				},

				inline: {
					name: 'inline',
					creator: 'inline'
				},
				inlineStartReadOnly: {
					name: 'inlineStartReadOnly',
					creator: 'inline',
					config: {
						readOnly: true
					}
				},
				inlineNoCE: {
					name: 'inlineNoCE',
					creator: 'inline'
				},

				divarea: {
					name: 'divarea',
					config: {
						extraPlugins: 'divarea'
					}
				}
			},
			names = [];

		for ( var name in toDo )
			names.push( name );

		next();

		function next() {
			var name = names.shift();

			if ( !name ) {
				bender.test( tests );
				return;
			}

			bender.editorBot.create( toDo[ name ], function( bot ) {
				editors[ name ] = bot.editor;

				bot.editor.dataProcessor.writer.sortAttributes = true;

				next();
			} );
		}
	}

	setUpEditors();

	function keyTester( editor ) {
		var keystrokeHandler = editor.keystrokeHandler,
			blockedKeys = keystrokeHandler.blockedKeystrokes,
			numAssert = 1;

		return {
			assertKeyBlocked: function( key, expected, msg ) {
				assert.areSame(
					blockedKeys[ key ],
					expected,
					msg || '(' + numAssert++ + ') ' + key + ' key is' + ( expected ? '' : 'n\'t' ) + ' blocked' );
			}
		};
	}

	var tests = {
		'test BACKSPACE in read-only mode: framed': function() {
			var editor = editors.framed,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: framed config.readOnly=true': function() {
			var editor = editors.framedStartReadOnly,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline': function() {
			var editor = editors.inline,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline config.readOnly=true': function() {
			var editor = editors.inlineStartReadOnly,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: inline no contenteditable attribute': function() {
			var editor = editors.inlineNoCE,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		},

		'test BACKSPACE in read-only mode: divarea': function() {
			var editor = editors.divarea,
				t = keyTester( editor );

			t.assertKeyBlocked( 8, 0 );

			editor.setReadOnly( true );
			t.assertKeyBlocked( 8, 1 );

			editor.setReadOnly( false );
			t.assertKeyBlocked( 8, 0 );
		}
	};

} )();