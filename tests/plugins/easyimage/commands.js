/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */

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

	var widgetHtml = '<figure class="image easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
			},

			'test eiAltText command': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
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

					editor.widgets.instances[ 0 ].focus();
					editor.execCommand( 'eiAltText' );
					wait();
				} );
			},

			'test eiFullImage and eiSideImage commands': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					widget.focus();

					assert.isFalse( widget.element.hasClass( 'easyimage--side' ), 'Image does not have side class' );

					bot.contextmenu( function( menu ) {
						assertMenuItemsState( menu.items, {
							eiFullImage: CKEDITOR.TRISTATE_ON,
							eiSideImage: CKEDITOR.TRISTATE_OFF
						} );

						editor.execCommand( 'eiSideImage' );

						assert.isTrue( widget.element.hasClass( 'easyimage--side' ), 'Image has side class' );

						bot.contextmenu( function( menu ) {
							assertMenuItemsState( menu.items, {
								eiFullImage: CKEDITOR.TRISTATE_OFF,
								eiSideImage: CKEDITOR.TRISTATE_ON
							} );

							menu.hide();
						} );
					} );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
