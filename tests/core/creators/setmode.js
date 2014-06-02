/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,sourcearea,undo */

( function() {

	'use strict';

	var setModeEvents = [ 'beforeSetMode', 'beforeModeUnload', 'mode' ];

	bender.editor = {
		startupData: '<p>  foo  </p>'
	};

	bender.test( {
		'test first mode - wysiwyg': function() {
			var eventsRecorder;

			bender.editorBot.create( {
				name: 'test_editor_first_mode_wysiwyg',
				startupData: '<p>  foo  </p>',
				config: {
					on: {
						pluginsLoaded: function() {
							eventsRecorder = bender.tools.recordEvents( this, setModeEvents );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				eventsRecorder.assert( [ 'beforeSetMode', 'mode' ] );
				assert.areSame( '<p>  foo  </p>', editor._.previousModeData, 'previous mode data has been retrieved from cached editor\'s data' );
				assert.areSame( 'wysiwyg', editor.mode, 'editor.mode' );
				assert.isFalse( editor.checkDirty(), 'editor.checkDirty' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'undo is disabled' );
			} );
		},

		'test first mode - source': function() {
			var eventsRecorder;

			bender.editorBot.create( {
				name: 'test_editor_first_mode_source',
				startupData: '<p>  foo  </p>',
				config: {
					startupMode: 'source',
					on: {
						pluginsLoaded: function() {
							eventsRecorder = bender.tools.recordEvents( this, setModeEvents );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				eventsRecorder.assert( [ 'beforeSetMode', 'mode' ] );
				assert.areSame( '<p>  foo  </p>', editor._.previousModeData, 'previous mode data has been retrieved from cached editor\'s data' );
				assert.areSame( 'source', editor.mode, 'editor.mode' );
				assert.isFalse( editor.checkDirty(), 'editor.checkDirty' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'undo is disabled' );
			} );
		},

		'test setMode to source': function() {
			var editor = this.editor,
				eventsRecorder = bender.tools.recordEvents( editor, setModeEvents );

			editor.editable().setHtml( '<p data-cke-x="1">foo1</p>' );
			editor.resetUndo();
			editor.resetDirty();

			editor.setMode( 'source', function() {
				// Stop recording.
				eventsRecorder.pause();

				var previousModeData = editor._.previousModeData,
					previousMode = editor._.previousMode,
					mode = editor.mode,
					dirty = editor.checkDirty(),
					undoState = editor.getCommand( 'undo' ).state;

				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						eventsRecorder.assert( [ 'beforeSetMode', 'beforeModeUnload', 'mode' ] );
						assert.areSame( '<p>foo1</p>', previousModeData, 'previous mode data has been retrieved from real data' );
						assert.areSame( 'wysiwyg', previousMode, 'previous mode' );
						assert.areSame( 'source', mode, 'editor.mode' );
						assert.isFalse( dirty, 'editor.checkDirty' );
						assert.areSame( CKEDITOR.TRISTATE_DISABLED, undoState, 'undo is disabled' );
					} );
				} );
			} );

			wait();
		},

		'test setMode to wysiwyg': function() {
			var editor = this.editor,
				eventsRecorder;

			editor.setMode( 'source', function() {
				eventsRecorder = bender.tools.recordEvents( editor, setModeEvents );

				editor.editable().setValue( '<p>  foo2  </p>' );
				editor.resetUndo();
				editor.resetDirty();

				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						eventsRecorder.assert( [ 'beforeSetMode', 'beforeModeUnload', 'mode' ] );
						assert.areSame( '<p>  foo2  </p>', editor._.previousModeData, 'previous mode data has been retrieved from real data' );
						assert.areSame( 'source', editor._.previousMode, 'previous mode' );
						assert.areSame( 'wysiwyg', editor.mode, 'editor.mode' );
						assert.isFalse( editor.checkDirty(), 'editor.checkDirty' );
						assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'undo is disabled' );
					} );
				} );
			} );

			wait();
		}
	} );

} )();