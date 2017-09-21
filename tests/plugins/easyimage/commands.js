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

	var tests = {
		tearDown: function() {
			var currentDialog = CKEDITOR.dialog.getCurrent();

			if ( currentDialog ) {
				currentDialog.hide();
			}
		},

		'test eiAltText command': function( editor, bot ) {

			bot.setData( '<figure class="image"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>', function() {
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
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
