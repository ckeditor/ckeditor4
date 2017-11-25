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
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		'pasteDialog event': function() {
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

		'paste html': function() {
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

			editor.on( 'afterPaste', function() {
				tc.resume( function() {
					notificationListener.removeListener();

					assert.areSame( 0, notificationSpy.callCount, 'notifications count' );
					assert.isTrue( editor._.storedDialogs.paste._.commited, 'Dialog commited state (after)' );
					assert.isFalse( editor._.forcePasteDialog, 'Force paste dialog' );
				} );
			} );

			editor.on( 'dialogShow', function( evt ) {
				evt.removeListener();

				tc.resume( function() {
					var dialog = editor._.storedDialogs.paste;
					assert.isTrue( !!dialog );
					assert.isFalse( dialog._.commited, 'Dialog commited state (before)' );

					var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
						.getInputElement().getFrameDocument();

					frameDoc.getBody().setHtml( 'abc<b>def</b>' );

					dialog.fire( 'ok' );
					dialog.hide();

					tc.wait();
				} );
			} );

			setTimeout( function() {
				//Force dialog.
				editor._.forcePasteDialog = true;
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
				evt.cancel();

				assert.areSame( 'foo', evt.data.dataValue, 'dataValue' );
				assert.areSame( 'paste', evt.data.method, 'method' );
				assert.areSame( dataTransfer, evt.data.dataTransfer, 'dataTransfer' );
			} );

			editor.fire( 'pasteDialogCommit', { dataValue: 'foo', dataTransfer: dataTransfer } );
		}
	} );
} )();
