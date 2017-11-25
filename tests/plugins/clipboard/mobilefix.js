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

		//Reset forcePasteDialog just to be sure
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
		wait();
	}

	function assertClick( editor, buttonName ) {
		var buttonElement = getButtonElement( editor, buttonName );

		//Reset forcePasteDialog just to be sure
		editor._.forcePasteDialog = false;

		buttonElement.once( 'click', function() {
			assert.isFalse( editor._.forcePasteDialog, 'Forcing paste dialog' );
		}, null, null, 999 );

		buttonElement.$.click();
	}

	var tests = {
		'test force dialog when button is touched': function( editor ) {
			assertTouchEnd( editor, 'Paste' );
		},

		'test does not force dialog when button is clicked': function( editor ) {
			assertClick( editor, 'Paste' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tests[ 'test add custom paste button' ] = function() {
		bender.editorBot.create( {
			name: 'custom_button',
			config: {
				language: 'en',
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor;

						CKEDITOR.plugins.clipboard.addPasteButton( editor, 'CustomPaste', {
							label: 'test',
							command: 'paste',
							toolbar: 'clipboard,40'
						} );

						arrayAssert.itemsAreEqual( [ 'Paste', 'CustomPaste' ], editor._.pasteButtons );
					}
				}
			}
		}, function( bot ) {
			assertTouchEnd( bot.editor, 'CustomPaste' );
		} );
	};

	bender.test( tests );
}() );
