/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar */

( function() {
	'use strict';

	function assertUpcast( bot, data, widget ) {
		var editor = bot.editor;

		bot.setData( data, function() {
			var widgets = editor.editable().find( '[data-widget="' + widget + '"]' );

			assert.areSame( 1, widgets.count(), 'Widget is properly upcasted' );
		} );
	}

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
		'test adding image widget': function( editor ) {
			var expectedParts = {
				caption: 'figcaption',
				image: 'img',
				loader: 'progress'
			};

			CKEDITOR.plugins.imagebase.addImageWidget( editor, 'testWidget', {
				parts: {
					loader: 'progress'
				}
			} );

			objectAssert.ownsKeys( [ 'testWidget' ], editor.widgets.registered );
			objectAssert.areDeepEqual( expectedParts, editor.widgets.registered.testWidget.parts );
		},

		'test upcasting image widget': function( editor, bot ) {
			assert.areSame( 'figure', editor.widgets.registered.testWidget.upcast );
			assertUpcast( bot, '<figure>Foo</figure>', 'testWidget' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
