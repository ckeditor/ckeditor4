/* bender-tags: editor,widget,dialog */
/* bender-ckeditor-plugins: easyimage,toolbar,contextmenu,undo */
/* bender-include: _helpers/tools.js */
/* global easyImageTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline'
		}
	};

	var originalGetClientRect = CKEDITOR.dom.element.prototype.getClientRect,
		widgetHtml = '<figure class="easyimage easyimage-full"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		tests = {
			setUp: function() {
				bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );

				if ( CKEDITOR.env.ie ) {
					CKEDITOR.dom.element.prototype.getClientRect = function() {
						return {
							width: 0,
							height: 0,
							left: 0,
							top: 0
						};
					};
				}
			},

			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}

				if ( CKEDITOR.env.ie ) {
					CKEDITOR.dom.element.prototype.getClientRect = originalGetClientRect;
				}
			},

			'test commands are enabled only on widget': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					easyImageTools.assertCommandsState( editor, {
						easyimageFull: CKEDITOR.TRISTATE_DISABLED,
						easyimageSide: CKEDITOR.TRISTATE_DISABLED,
						easyimageAlt: CKEDITOR.TRISTATE_DISABLED
					} );

					widget.focus();

					easyImageTools.assertCommandsState( editor, {
						easyimageFull: CKEDITOR.TRISTATE_ON,
						easyimageSide: CKEDITOR.TRISTATE_OFF,
						easyimageAlt: CKEDITOR.TRISTATE_OFF
					} );
				} );
			},

			'test easyimageAlt command': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					editor.once( 'dialogShow', function( evt ) {
						resume( function() {
							var dialog = evt.data;

							assert.areSame( 'foo', dialog.getValueOf( 'info', 'txtAlt' ),
								'Initial value is fetched from image' );

							dialog.setValueOf( 'info', 'txtAlt', 'bar' );
							dialog.getButton( 'ok' ).click();

							assert.areSame( 'bar', editor.editable().findOne( 'img' ).getAttribute( 'alt' ),
								'Alt text of image is changed' );

							// (#2423)
							assert.areSame( widget, dialog.getModel( editor ), 'Dialog model should point at widget' );
							assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ), 'Dialog should be in editing mode' );
						} );
					} );

					widget.focus();
					editor.execCommand( 'easyimageAlt' );
					wait();
				} );
			},

			'test easyimageFull and easyimageSide commands': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					widget.focus();

					assert.isFalse( widget.element.hasClass( 'easyimage-side' ), 'Image does not have side class' );
					assert.isTrue( widget.hasClass( 'easyimage' ), 'Widget wrapper has main class' );
					assert.isFalse( widget.hasClass( 'easyimage-side' ),
						'Widget wrapper does not have side class' );

					bot.contextmenu( function( menu ) {
						easyImageTools.assertMenuItemsState( menu.items, {
							easyimagefull: CKEDITOR.TRISTATE_ON,
							easyimageside: CKEDITOR.TRISTATE_OFF
						} );

						editor.execCommand( 'easyimageSide' );

						assert.isTrue( widget.element.hasClass( 'easyimage-side' ), 'Image has side class' );
						assert.isTrue( widget.hasClass( 'easyimage' ), 'Widget wrapper has main class' );
						assert.isTrue( widget.hasClass( 'easyimage-side' ), 'Widget wrapper has side class' );

						bot.contextmenu( function( menu ) {
							easyImageTools.assertMenuItemsState( menu.items, {
								easyimagefFull: CKEDITOR.TRISTATE_OFF,
								easyimageside: CKEDITOR.TRISTATE_ON
							} );

							menu.hide();
						} );
					} );
				} );
			},

			'test balloontoolbar integration': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) ),
						toolbar = editor.balloonToolbars._contexts[ 0 ].toolbar;

					toolbar._view.once( 'show', function() {

						easyImageTools.assertCommandsState( editor, {
							easyimageFull: CKEDITOR.TRISTATE_ON,
							easyimageSide: CKEDITOR.TRISTATE_OFF,
							easyimageAlt: CKEDITOR.TRISTATE_OFF
						} );

						editor.once( 'afterCommandExec', function() {
							resume( function() {
								easyImageTools.assertCommandsState( editor, {
									easyimageFull: CKEDITOR.TRISTATE_OFF,
									easyimageSide: CKEDITOR.TRISTATE_ON,
									easyimageAlt: CKEDITOR.TRISTATE_OFF
								} );
							} );
						} );

						editor.execCommand( 'easyimageSide' );
					} );

					widget.focus();
					wait();
				} );
			}
		};

	// Force Edge to run every test in new CKEditor's instance.
	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests, CKEDITOR.env.edge );
	bender.test( tests );
} )();
