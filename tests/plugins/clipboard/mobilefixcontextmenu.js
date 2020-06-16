/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard,wysiwygarea,contextmenu */

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

	function assertTouchEnd( bot, editor ) {
		var notificationSpy = sinon.spy( editor, 'showNotification' ),
			dialogSpy = sinon.spy(),
			dialogListener;

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

		bot.contextmenu( function( menu ) {
			var menuItem = menu.findItemByCommandName( 'paste' );

			menuItem.element.once( 'touchend', function() {
				assert.isTrue( editor._.forcePasteDialog, 'Forcing paste dialog' );
				assert.isFalse( notificationSpy.called, 'Notification not shown' );
				notificationSpy.restore();
			}, null, null, 999 );

			menuItem.element.fire( 'touchend' );
			if ( CKEDITOR.env.edge ) {
				// Trigger Paste command directly as button click does not trigger it on Edge.
				editor.execCommand( 'paste' );
			}
			menuItem.element.$.click();

			wait();
		} );
	}

	function assertClick( bot, editor ) {
		var notificationSpy = sinon.spy( editor, 'showNotification' );

		bot.contextmenu( function( menu ) {
			var menuItem = menu.findItemByCommandName( 'paste' );

			menuItem.element.once( 'click', function() {
				assert.isFalse( editor._.forcePasteDialog, 'Forcing paste dialog' );
				if ( !CKEDITOR.env.ie || CKEDITOR.env.edge ) {
					// There are no paste notifications on IE browsers.
					assert.areSame( 1, notificationSpy.callCount, 'Notification shown' );
				}
				notificationSpy.restore();
			}, null, null, 999 );

			if ( CKEDITOR.env.edge ) {
				// Trigger Paste command directly as button click does not trigger it on Edge.
				editor.execCommand( 'paste' );
			}
			menuItem.element.$.click();
		} );
	}

	var editorBots,
		tests = {
			init: function() {
				editorBots = this.editorBots;
			},

			setUp: function() {
				this.editors.classic._.forcePasteDialog = false;
				this.editors.divarea._.forcePasteDialog = false;
				this.editors.inline._.forcePasteDialog = false;
			},

			'test force dialog when button is touched': function( editor ) {
				if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
					// Ignore `touchend` tests for IE as there is no paste dialog due to different flow.
					assert.ignore();
				}
				assertTouchEnd( editorBots[ editor.name ], editor );
			},

			'test does not force dialog when button is clicked': function( editor ) {
				assertClick( editorBots[ editor.name ], editor );
			}
		};

	bender.test(
		bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests ) );
}() );
