/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar,contextmenu,undo */

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

	function assertMenuItemsState( items, asserts ) {
		CKEDITOR.tools.array.forEach( items, function( item ) {
			if ( asserts[ item.command ] ) {
				assert.areSame( asserts[ item.command ], item.state,
					'Menu item ' + item.command + ' has appropriate state' );
			}
		} );
	}

	function assertCommandsState( editor, asserts ) {
		var command;

		for ( command in asserts ) {
			assert.areSame( asserts[ command ], editor.getCommand( command ).state,
				'Command ' + command + ' has appropriate state' );
		}
	}

	function getEasyImageBalloonContext( editor ) {
		return editor.balloonToolbars._contexts[ 0 ];
	}

	var widgetHtml = '<figure class="image easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		sideWidgetHtml = '<figure class="image easyimage easyimage-side"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
			},

			'test commands are enabled only on widget': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					assertCommandsState( editor, {
						easyimageFull: CKEDITOR.TRISTATE_DISABLED,
						easyimageSide: CKEDITOR.TRISTATE_DISABLED,
						easyimageAlt: CKEDITOR.TRISTATE_DISABLED
					} );

					widget.focus();

					assertCommandsState( editor, {
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
					assert.areSame( 'full', widget.data.type, 'Widget has correct type data' );

					bot.contextmenu( function( menu ) {
						assertMenuItemsState( menu.items, {
							easyimageFull: CKEDITOR.TRISTATE_ON,
							easyimageSide: CKEDITOR.TRISTATE_OFF
						} );

						editor.execCommand( 'easyimageSide' );

						assert.isTrue( widget.element.hasClass( 'easyimage-side' ), 'Image has side class' );
						assert.isTrue( widget.hasClass( 'easyimage' ), 'Widget wrapper has main class' );
						assert.isTrue( widget.hasClass( 'easyimage-side' ), 'Widget wrapper has side class' );
						assert.areSame( 'side', widget.data.type, 'Widget has correct type data' );

						bot.contextmenu( function( menu ) {
							assertMenuItemsState( menu.items, {
								easyimageFull: CKEDITOR.TRISTATE_OFF,
								easyimageSide: CKEDITOR.TRISTATE_ON
							} );

							menu.hide();
						} );
					} );
				} );
			},

			'test initial type data for side image': function( editor, bot ) {
				bot.setData( sideWidgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					assert.areSame( 'side', widget.data.type, 'Widget has correct type data' );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
