/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard,wysiwygarea */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				language: 'en'
			}
		},

		divarea: {
			config: {
				language: 'en',
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				language: 'en'
			}
		}
	};

	function getButtonElement( editor, name ) {
		var button = editor.ui.get( name ),
			buttonElement = CKEDITOR.document.getById( button._.id );

		return buttonElement;
	}

	function assertTouchEnd( editor, buttonName ) {
		var buttonElement = getButtonElement( editor, buttonName ),
			dialogSpy = sinon.spy(),
			dialogListener;

		// Reset forcePasteDialog just to be sure
		editor._.forcePasteDialog = false;

		dialogListener = editor.on( 'pasteDialog', dialogSpy );

		editor.once( 'dialogShow', function( evt ) {
			resume( function() {
				var dialog = evt.data;

				dialogListener.removeListener();

				assert.areSame( 1, dialogSpy.callCount, 'pasteDialog event count' );

				dialog.fire( 'cancel' );
				dialog.hide();
			} );
		} );

		buttonElement.once( 'touchend', function() {
			assert.isTrue( editor._.forcePasteDialog, 'Forcing paste dialog' );
		}, null, null, 999 );

		buttonElement.fire( 'touchend' );
		buttonElement.$.click();
		if ( CKEDITOR.env.edge ) {
			// Trigger Paste command directly as button click does not trigger it on Edge.
			editor.execCommand( 'paste' );
		}

		wait();
	}

	function assertClick( editor, buttonName ) {
		var buttonElement = getButtonElement( editor, buttonName );

		// Reset forcePasteDialog just to be sure
		editor._.forcePasteDialog = false;

		buttonElement.once( 'click', function() {
			assert.isFalse( editor._.forcePasteDialog, 'Forcing paste dialog' );
		}, null, null, 999 );

		buttonElement.$.click();
	}

	var tests = {
		setUp: function() {
			if ( CKEDITOR.env.ie ) {
				// IE and Edge are not supported on mobile.
				assert.ignore();
			}
		},

		'test force dialog when button is touched': function( editor ) {
			if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				// Ignore `touchend` tests for IE as there is not paste dialog due to different flow.
				assert.ignore();
			}
			assertTouchEnd( editor, 'Paste' );
		},

		'test does not force dialog when button is clicked': function( editor ) {
			assertClick( editor, 'Paste' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	tests[ 'test add custom paste button' ] = function() {
		if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
			// Ignore for IE as there is not paste dialog due to different flow.
			assert.ignore();
		}

		bender.editorBot.create( {
			name: 'custom_button',
			config: {
				language: 'en',
				removePlugins: 'pastetext,pastefromword',
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor;

						CKEDITOR.plugins.clipboard.addPasteButton( editor, 'CustomPaste', {
							label: 'test',
							command: 'paste',
							toolbar: 'clipboard,40'
						} );
					}
				}
			}
		}, function( bot ) {
			arrayAssert.itemsAreEqual( [ 'Paste', 'CustomPaste' ], bot.editor._.pasteButtons );
			assertTouchEnd( bot.editor, 'CustomPaste' );
		} );
	};

	bender.test( tests );
}() );
