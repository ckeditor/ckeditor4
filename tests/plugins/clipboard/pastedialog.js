/* bender-tags: editor,unit,dialog */
/* bender-ckeditor-plugins: entities,button,clipboard */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Force language to avoid issues with missing dialog's title.
			language: 'en'
		}
	};

	bender.test( {
		setUp: function() {
			//Force dialog.
			this.editor._.forcePasteDialog = true;
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		'test pasteDialog event': function() {
			var tc = this,
				editor = this.editor;

			editor.on( 'dialogShow', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					var dialog = editor._.storedDialogs.paste;
					assert.isTrue( !!dialog );

					dialog.fire( 'cancel' );
					dialog.hide();
				} );
			} );

			editor.fire( 'pasteDialog' );
			tc.wait();
		},

		'test paste html': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var tc = this,
				editor = this.editor,
				beforePasteFired = false,
				notificationSpy = sinon.spy(),
				notificationListener;

			notificationListener = editor.on( 'notificationShow', notificationSpy );

			editor.on( 'beforePaste', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					assert.areEqual( 'auto', evt.data.type );
					beforePasteFired = true;
					tc.wait();
				} );
			} );

			editor.on( 'paste', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					assert.isTrue( beforePasteFired );
					assert.areEqual( 'html', evt.data.type );
					assert.areEqual( 'abc<b>def</b>', evt.data.dataValue );

					tc.wait();
				} );
			} );

			editor.on( 'afterPaste', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					notificationListener.removeListener();

					assert.areSame( 0, notificationSpy.callCount, 'notifications count' );
					assert.isTrue( editor._.storedDialogs.paste._.committed, 'Dialog committed state (after)' );
					assert.isFalse( editor._.forcePasteDialog, 'Force paste dialog' );
				} );
			} );

			editor.on( 'dialogShow', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					var dialog = editor._.storedDialogs.paste;
					assert.isTrue( !!dialog );
					assert.isFalse( dialog._.committed, 'Dialog committed state (before)' );

					var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
						.getInputElement().getFrameDocument();

					frameDoc.getBody().setHtml( 'abc<b>def</b>' );

					dialog.fire( 'ok' );
					dialog.hide();

					tc.wait();
				} );
			} );

			setTimeout( function() {
				editor.execCommand( 'paste' );
			} );
			tc.wait();
		},

		'test paste dialog focus': function() {
			var editor = this.editor;

			editor.on( 'ariaWidget', function( event ) {
				if ( !event.data.is( 'iframe' ) )
					return;

				event.removeListener();

				setTimeout( function() {
					resume( function() {
						var iframe = event.data,
							active = CKEDITOR.document.getActive(),
							dialog = editor._.storedDialogs.paste;

						assert.isTrue( editor.focusManager.hasFocus, 'editor has focus on paste dialog opened.' );
						assert.areSame( iframe, active, 'paste area has focused on paste dialog opened' );
						dialog.hide();
					} );
				} );
			} );

			editor.openDialog( 'paste' );
			wait();
		},

		'test paste event structure': function() {
			var editor = this.editor,
				dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer();

			editor.once( 'paste', function( evt ) {
				resume( function() {
					evt.cancel();

					assert.areSame( 'foo', evt.data.dataValue, 'dataValue' );
					assert.areSame( 'paste', evt.data.method, 'method' );
					assert.areSame( dataTransfer, evt.data.dataTransfer, 'dataTransfer' );
				} );
			} );

			editor.once( 'dialogShow', function() {
				resume( function() {
					var dialog = editor._.storedDialogs.paste;

					editor.fire( 'pasteDialogCommit', { dataValue: 'foo', dataTransfer: dataTransfer } );
					dialog.hide();
					wait();
				} );
			} );

			editor.fire( 'pasteDialog' );
			wait();
		},

		'test paste event count': function() {
			var editor = this.editor,
				spy = sinon.spy(),
				// Stub execCommand so that IE does not put the paste permission popup. Normally we'd use sinon here
				// unfortunately IE8 will cry that document.execCommand is an object, not a function.
				originalDocumentExec = editor.document.$.execCommand,
				listener;

			editor.document.$.execCommand = function() {
				return true;
			};

			listener = editor.on( 'paste', spy );

			editor.once( 'afterPaste', function() {
				setTimeout( function() {
					resume( function() {
						editor.document.$.execCommand = originalDocumentExec;
						listener.removeListener();

						assert.areSame( 1, spy.callCount, 'Paste count' );
					} );
				}, 100 );
			} );

			editor.once( 'dialogShow', function() {
				resume( function() {
					var dialog = editor._.storedDialogs.paste;

					var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
						.getInputElement().getFrameDocument();

					frameDoc.getBody().setHtml( 'foo' );

					dialog.fire( 'ok' );
					dialog.hide();
					wait();
				} );
			} );

			setTimeout( function() {
				editor.execCommand( 'paste' );
			} );
			wait();
		},

		'test paste dialog with some paste buttons removed': function() {
			bender.editorBot.create( {
				name: 'some_paste_buttons',
				config: {
					language: 'en',
					extraPlugins: 'pastetext,pastefromword',
					removeButtons: 'Paste,PasteText'
				}
			}, function( bot ) {
				arrayAssert.containsItems( [ 'Paste', 'PasteText', 'PasteFromWord' ], bot.editor._.pasteButtons );
			} );
		},

		'test paste dialog with all paste buttons removed': function() {
			bender.editorBot.create( {
				name: 'no_paste_buttons',
				config: {
					language: 'en',
					extraPlugins: 'pastetext',
					removeButtons: 'Paste,PasteText'
				}
			}, function( bot ) {
				arrayAssert.containsItems( [ 'Paste', 'PasteText' ], bot.editor._.pasteButtons );
			} );
		}
	} );
} )();
