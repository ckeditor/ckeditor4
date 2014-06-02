/* bender-tags: editor,unit,dialog */
/* bender-ckeditor-plugins: entities,button,clipboard */

( function() {
	'use strict';

	bender.editor = true;

	bender.test(
	{
		setUp : function() {
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		'pasteDialog event' : function() {
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

		'paste html': CKEDITOR.env.ie ?
		function() {
			var tc = this,
				editor = this.editor;

			editor.on( 'pasteDialogCommit', function( evt ) {
					evt.removeListener();

					tc.resume( function() {
							assert.areEqual( 'abc<b>def</b>', evt.data.toLowerCase() );
						} );
				} );

			editor.on( 'dialogShow', function( evt ) {
					evt.removeListener();

					tc.resume( function() {
							var dialog = editor._.storedDialogs.paste;
							assert.isTrue( !!dialog );

							var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
								.getInputElement().getFrameDocument();

							// IE needs some time to create editable body.
							setTimeout( function() {
									frameDoc.getBody().setHtml( 'abc<b>def</b>' );

									dialog.fire( 'ok' );
									dialog.hide();
								}, 10 );

							tc.wait();
						} );
				} );

			// Editor.execCommand( 'paste' ) opens IE security alert which breaks tests.
			editor.openDialog( 'paste' );
			tc.wait();
		}
		:
		function() {
			var tc = this,
				editor = this.editor,
				beforePasteFired = false;

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
						} );
				} );

			editor.on( 'dialogShow', function( evt ) {
					evt.removeListener();

					tc.resume( function() {
							var dialog = editor._.storedDialogs.paste;
							assert.isTrue( !!dialog );

							var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
								.getInputElement().getFrameDocument();

							frameDoc.getBody().setHtml( 'abc<b>def</b>' );

							dialog.fire( 'ok' );
							dialog.hide();

							tc.wait();
						} );
				} );

			setTimeout( function() { editor.execCommand( 'paste' ); } );
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
		}
	} );
} )();