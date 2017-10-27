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

	function assertUpcast( bot, data, widget ) {
		var editor = bot.editor;

		bot.setData( data, function() {
			var widgets = editor.editable().find( '[data-widget="' + widget + '"]' );

			assert.areSame( 1, widgets.count(), 'Widget is properly upcasted' );
		} );
	}

	var widgetHtml = '<figure class="easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
			},

			'test upcasting image widget': function( editor, bot ) {
				assertUpcast( bot, widgetHtml + '<figure>Foo</figure>', 'easyimage' );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
