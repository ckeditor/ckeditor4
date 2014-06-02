/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,image,forms,link,toolbar */

( function() {
	'use strict';

	var getById = widgetTestsTools.getWidgetById,
		fixHtml = widgetTestsTools.fixHtml;

	bender.editor = {
		config: {
			extraAllowedContent: 'img[id]'
		}
	};

	var onShowCount = 0,
		onOkCount = 0;

	CKEDITOR.on( 'dialogDefinition', function( evt ) {
		var dialog = evt.data;

		if ( dialog.name == 'link' ) {
			var def = dialog.definition;

			def.onShow = function() {
				onShowCount++;
			};

			def.onOk = function() {
				onOkCount++;
			};
		}
	} );

	bender.test( {
		'test disable Image plugin when Image2 is loaded': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.dialog( 'image', function( dialog ) {
				try {
					assert.isObject( dialog.widget, 'Dialog displayed in the context of the widget.' );
				} catch ( e ) {
					throw e;
				} finally {
					dialog.hide();
				}
			} );
		},

		'test disable ImageButton when Image2 is loaded': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			assert.isUndefined( editor.ui.get( 'ImageButton' ), 'ImageButton button is not present when Image2 is loaded.' );
			assert.isUndefined( editor.commands.imagebutton, 'ImageButton command is not defined when Image2 is loaded.' );
		},

		'test overwrite onShow and onOk in link dialog definition (widget focused)': function() {
			var bot = this.editorBot;

			var html = '<p>' +
					'<a href="http://x"><img alt="x" id="x" src="_assets/foo.png" /></a>' +
				'</p>',
				expected = '<p>' +
					'<a href="http://z"><img alt="x" id="x" src="_assets/foo.png" /></a>' +
				'</p>';

			bot.setData( html, function() {
				getById( bot.editor, 'x' ).focus();

				bot.dialog( 'link', function( dialog ) {
					try {
						assert.areSame( 0, onShowCount, 'Default onShow should not be called if Image2 widget is focused' );

						dialog.setValueOf( 'info', 'url', 'z' );
						dialog.getButton( 'ok' ).click();

						assert.areSame( 0, onOkCount, 'Default onOk should not be called if Image2 widget is focused' );
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}

					assert.areSame( fixHtml( expected ), fixHtml( bot.getData() ), 'Link updated successfully' );
				} );
			} );
		},

		'test overwrite onShow and onOk in link dialog definition (no widget focused)': function() {
			var bot = this.editorBot;

			bot.setData( '', function() {
				bot.editor.on( 'dialogShow', function( evt ) {
					resume( function() {
						var dialog = evt.data;

						dialog.setValueOf( 'info', 'url', 'foo' );
						dialog.getButton( 'ok' ).click();

						try {
							assert.areSame( 1, onShowCount, 'Default onShow should be executed' );
							assert.areSame( 1, onOkCount, 'Default onOk should be executed' );
						} catch ( e ) {
							throw e;
						} finally {
							dialog.hide();
						}
					} );
				} );

				bot.execCommand( 'link' );

				wait();
			} );
		}
	} );
} )();