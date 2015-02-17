/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: basicstyles,toolbar,undo,sourcearea */

( function() {
	'use strict';

	bender.editors = {
		framed: {
			name: 'framed',
			config: {
				allowedContent: true,
				on: {
					instanceReady: onInstanceReady
				}
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: {
				allowedContent: true,
				on: {
					instanceReady: onInstanceReady
				}
			}
		},
		divarea: {
			name: 'divarea',
			config: {
				extraPlugins: 'divarea',
				allowedContent: true,
				on: {
					instanceReady: onInstanceReady
				}
			}
		}
	};

	CKEDITOR.disableAutoInline = true;

	function onInstanceReady() {
		this.dataProcessor.dataFilter.addRules( {
			attributeNames: [
				[ /^data-foo$/, 'data-foo-internal' ]
			]
		} );
		this.dataProcessor.htmlFilter.addRules( {
			attributeNames: [
				[ /^data-foo-internal$/, 'data-foo' ]
			]
		} );
	}

	var tests = {
		'test initial state': function( editor ) {
			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			// There should be no snapshot after initial setData.
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'initial undo' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'initial redo' );
		},

		'test setData with undoing': function( editor ) {
			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			bender.tools.setHtmlWithSelection( editor, '<p>[foo]</p>' );
			editor.resetUndo();

			editor.execCommand( 'italic' );

			editor.setData( 'bar', function() {
				resume( function() {
					var sel = editor.getSelection(),
						elem = editor.editable().findOne( 'p' );

					sel.selectElement( elem );

					editor.execCommand( 'bold' );

					assert.isMatching( /<p><strong>bar(<br>)?<\/strong>(<br>)?<\/p>/i, editor.editable().getHtml(), 'begin' );
					assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'before 1st undo' );

					editor.execCommand( 'undo' );

					assert.isMatching( /<p>bar(<br>)?<\/p>/i, editor.editable().getHtml() );
					assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'after 1st undo' );

					editor.execCommand( 'undo' );

					assert.isMatching( /<p><em>foo(<br>)?<\/em>(<br>)?<\/p>/i, editor.editable().getHtml() );
					assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'after 2nd undo' );

					editor.execCommand( 'undo' );

					assert.isMatching( /<p>foo(<br>)?<\/p>/i, editor.editable().getHtml() );
					assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'after 3rd undo' );
					assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'before 1st redo' );

					editor.execCommand( 'redo' );

					assert.isMatching( /<p><em>foo(<br>)?<\/em>(<br>)?<\/p>/i, editor.editable().getHtml() );
					assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'after 1st redo' );

					editor.execCommand( 'redo' );

					assert.isMatching( /<p>bar(<br>)?<\/p>/i, editor.editable().getHtml() );
					assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'after 2nd redo' );

					editor.execCommand( 'redo' );

					assert.isMatching( /<p><strong>bar(<br>)?<\/strong>(<br>)?<\/p>/i, editor.editable().getHtml(), 'end' );
					assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'after 3rd redo' );
				}, 0 );
			} );

			wait();
		},

		'test switch mode without changes': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			bender.tools.setHtmlWithSelection( editor, '<p>[foo]</p>' );
			editor.resetUndo();

			switchMode( editor, function( callback ) {
				// In source mode do nothing.
				callback();
			}, function() {
				// In wysiwyg mode.
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo 1' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo 1' );
				assert.isNull( editor.undoManager.locked, 'undo manager is unlocked' );
			} );
		},

		'test switch mode with changes in source': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			bender.tools.setHtmlWithSelection( editor, '<p>[foo]</p>' );
			editor.resetUndo();

			switchMode( editor, function( callback ) {
				// In source mode.
				editor.editable().setValue( '<p>bar</p>' );
				callback();
			}, function() {
				// In wysiwyg mode.
				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undo 1' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo 1' );
				assert.isNull( editor.undoManager.locked, 'undo manager is unlocked' );

				editor.execCommand( 'undo' );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo 2' );
				assert.areSame( '<p>foo</p>', editor.getData(), 'data after undo 1' );
			} );
		},

		'test switch mode with setData in source': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			bender.tools.setHtmlWithSelection( editor, '<p>[foo]</p>' );
			editor.resetUndo();

			switchMode( editor, function( callback ) {
				// In source mode.
				editor.setData( '<p>bar1</p>', function() {
					editor.setData( '<p>bar2</p>', function() {
						callback();
					} );
				} );
			}, function() {
				// In wysiwyg mode.
				// Undo is available because data changed in source area.
				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undo 1' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo 1' );

				editor.execCommand( 'undo' );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo 2' );
				// But undoing once reverts all changes in source mode, because
				// they are not recorded.
				assert.areSame( '<p>foo</p>', editor.getData(), 'data after undo 1' );
			} );
		},

		'test switch mode with content that is differently represented in data and inner HTML': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			// Handle sync and async setData.
			wait( function() {
				// See onInstanceReady function.
				editor.setData( '<p data-foo="1">x</p>', function() {
					resume( function() {
						editor.resetUndo();

						switchMode( editor, function( callback ) {
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo in source' );
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo in source' );

							callback();
						}, function() {
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo in wysiwyg' );
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo in wysiwyg' );
						} );
					} );
				} );
			} );
		},

		// http://dev.ckeditor.com/ticket/5217#comment:20
		'test switch mode with unrecoreded, inner HTML specific content (boguses)': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );
			editor.resetUndo();

			// Mimic editables' fixDom on FF.
			editor.fire( 'lockSnapshot' );
			var paras = editor.editable().find( 'p' );
			for ( var i = 0; i < paras.count(); ++i ) {
				paras.getItem( i ).appendBogus();
			}
			editor.fire( 'unlockSnapshot' );

			switchMode( editor, function( callback ) {
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo in source' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo in source' );

				callback();
			}, function() {
				editor.fire( 'saveSnapshot' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo in wysiwyg' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo in wysiwyg' );
			} );
		},

		// http://dev.ckeditor.com/ticket/5217#comment:20
		'test switch mode with unrecoreded, inner HTML specific content (boguses) plus changes in source mode': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var undo = editor.getCommand( 'undo' ),
				redo = editor.getCommand( 'redo' );

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );
			editor.resetUndo();

			// Mimic editables' fixDom on FF.
			editor.fire( 'lockSnapshot' );
			var paras = editor.editable().find( 'p' );
			for ( var i = 0; i < paras.count(); ++i ) {
				paras.getItem( i ).appendBogus();
			}
			editor.fire( 'unlockSnapshot' );

			switchMode( editor, function( callback ) {
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo in source' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo in source' );

				editor.editable().setValue( '<p>x</p><p>y</p>' );

				callback();
			}, function() {
				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undo 1 in wysiwyg' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo 1 in wysiwyg' );

				// Just to make sure that nothing else left unrecored. But do this after changing states
				// because snapshot should be recorded while changing modes.
				editor.fire( 'saveSnapshot' );

				editor.execCommand( 'undo' );
				assert.areSame( '<p>foo</p><p>bar</p>', editor.getData(), 'data after undo' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, undo.state, 'undo 2 in wysiwyg' );
				assert.areSame( CKEDITOR.TRISTATE_OFF, redo.state, 'redo 2 in wysiwyg' );

				editor.execCommand( 'redo' );
				assert.areSame( '<p>x</p><p>y</p>', editor.getData(), 'data after redo' );
				assert.areSame( CKEDITOR.TRISTATE_OFF, undo.state, 'undo 3 in wysiwyg' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, redo.state, 'redo 3 in wysiwyg' );
			} );
		}
	};

	function switchMode( editor, doInSourceMode, doInWysiwygMode ) {
		// Ensure async (that wait is called before resume).
		wait( function() {
			editor.setMode( 'source', function() {
				resume( function() {
					assert.areSame( 'source', editor.mode, 'source mode' );
					doInSourceMode( callbackFunction );
				} );
			} );
		} );

		function callbackFunction() {
			// Ensure async (that wait is called before resume.
			wait( function() {
				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						assert.areSame( 'wysiwyg', editor.mode, 'wysiwyg mode' );
						doInWysiwygMode();
					} );
				} );
			} );
		}
	}

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();